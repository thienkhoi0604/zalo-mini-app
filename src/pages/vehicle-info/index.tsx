import React, { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page } from 'zmp-ui';
import {
  Car,
  CheckCircle,
  CalendarCheck,
  ImageOff,
  Zap,
  XCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { fetchVehicleInfo } from '@/api/user';
import { VehicleInfo } from '@/types/user';
import PullToRefresh from '@/components/ui/pull-to-refresh';

type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

const formatDate = (iso?: string) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// ─── Photo card ───────────────────────────────────────────────────────────────

const PhotoCard: FC<{ url?: string; label: string }> = ({ url, label }) => (
  <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>{label}</p>
    <Box style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: 12, overflow: 'hidden', background: '#F3F4F6' }}>
      <Box
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {url ? (
          <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <ImageOff size={24} color="#D1D5DB" />
            <p style={{ fontSize: 11, color: '#D1D5DB' }}>Không có ảnh</p>
          </Box>
        )}
      </Box>
    </Box>
  </Box>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: FC = () => (
  <Box style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
    {[120, 100, 180].map((h, i) => (
      <Box key={i} className="animate-pulse" style={{ height: h, borderRadius: 16, background: '#E9EBED' }} />
    ))}
  </Box>
);

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow: FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Box
      style={{
        width: 36, height: 36, borderRadius: 10, background: '#DCFCE7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box style={{ flex: 1 }}>
      <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 1 }}>{label}</p>
      <Box>{value}</Box>
    </Box>
  </Box>
);

// ─── Status badge config ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ApprovalStatus, { bg: string; icon: React.ReactNode; label: string }> = {
  Approved: {
    bg: 'rgba(255,255,255,0.25)',
    icon: <CheckCircle size={10} color="#fff" />,
    label: 'Đã xác thực',
  },
  Pending: {
    bg: 'rgba(251,191,36,0.4)',
    icon: <Clock size={10} color="#fff" />,
    label: 'Chờ duyệt',
  },
  Rejected: {
    bg: 'rgba(239,68,68,0.4)',
    icon: <XCircle size={10} color="#fff" />,
    label: 'Từ chối',
  },
};

// ─── Not submitted state ───────────────────────────────────────────────────────

const NotSubmittedView: FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      style={{
        margin: 16,
        background: '#FFFBF0',
        border: '1.5px solid #F0C060',
        borderRadius: 16,
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <Box
        style={{
          width: 56, height: 56, borderRadius: '50%', background: '#FEF08A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 26 }}>🛡️</span>
      </Box>
      <Box>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>
          Chưa gửi thông tin xe
        </p>
        <p style={{ fontSize: 13, color: '#555', lineHeight: '18px' }}>
          Vui lòng xác thực xe điện để tích điểm khi sạc.
        </p>
      </Box>
      <button
        onClick={() => navigate('/verify-vehicle')}
        style={{
          marginTop: 4,
          width: '100%',
          height: 48,
          borderRadius: 14,
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #2FA85F, #1A6B38)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(40,143,78,0.3)',
        }}
      >
        Xác thực ngay
      </button>
    </Box>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const VehicleInfoPage: FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVehicle = useCallback(async () => {
    setLoading(true);
    const result = await fetchVehicleInfo();
    setVehicles(result);
    setLoading(false);
  }, []);

  useEffect(() => { loadVehicle(); }, []);

  const vehicle = vehicles?.[0] ?? null;
  const notSubmitted = vehicles !== null && vehicles.length === 0;
  const status = vehicle?.approvalStatus as ApprovalStatus | undefined;
  const statusConfig = status ? STATUS_CONFIG[status] : null;

  return (
    <Page className="flex-1 flex flex-col">
      <PullToRefresh onRefresh={loadVehicle} className="flex-1">

        {/* Hero banner */}
        <Box
          style={{
            background: 'linear-gradient(135deg, #2FA85F 0%, #1A6B38 100%)',
            padding: '22px 20px 26px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box style={{ position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <Box style={{ position: 'absolute', bottom: -16, left: -16, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <Box style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Box
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Car size={26} color="#fff" />
            </Box>
            <Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: '24px' }}>
                  Thông tin xe của tôi
                </p>
                {!loading && statusConfig && (
                  <Box
                    style={{
                      background: statusConfig.bg,
                      borderRadius: 100,
                      padding: '2px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {statusConfig.icon}
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
                      {statusConfig.label}
                    </span>
                  </Box>
                )}
              </Box>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '18px' }}>
                Xe điện được xác minh để tích điểm
              </p>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        {loading ? (
          <Skeleton />
        ) : vehicles === null ? (
          <Box style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>Không thể tải thông tin xe</p>
          </Box>
        ) : notSubmitted ? (
          <NotSubmittedView />
        ) : vehicle && (
          <Box style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Rejection reason */}
            {status === 'Rejected' && vehicle.rejectionReason && (
              <Box
                style={{
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 14, padding: '12px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <XCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <Box>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#B91C1C', marginBottom: 3 }}>
                    Lý do từ chối
                  </p>
                  <p style={{ fontSize: 12, color: '#991B1B', lineHeight: '18px' }}>
                    {vehicle.rejectionReason}
                  </p>
                </Box>
              </Box>
            )}

            {/* Vehicle details card */}
            <Box
              style={{
                background: '#fff', borderRadius: 16, padding: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Chi tiết phương tiện</p>

              <InfoRow
                icon={<Car size={18} color="#288F4E" />}
                label="BIỂN SỐ XE"
                value={
                  <p style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: 1.5 }}>
                    {vehicle.licensePlate}
                  </p>
                }
              />

              <Box style={{ height: 1, background: '#F3F4F6' }} />

              <InfoRow
                icon={<Zap size={18} color="#288F4E" fill="#288F4E" strokeWidth={0} />}
                label="LOẠI PHƯƠNG TIỆN"
                value={
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    {vehicle.vehicleTypeName ?? 'Xe điện'}
                  </p>
                }
              />

              {vehicle.reviewedAt && (
                <>
                  <Box style={{ height: 1, background: '#F3F4F6' }} />
                  <InfoRow
                    icon={<CalendarCheck size={18} color="#288F4E" />}
                    label="NGÀY XÁC THỰC"
                    value={
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                        {formatDate(vehicle.reviewedAt)}
                      </p>
                    }
                  />
                </>
              )}
            </Box>

            {/* Photos card */}
            <Box
              style={{
                background: '#fff', borderRadius: 16, padding: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Ảnh xe</p>
              <Box style={{ display: 'flex', gap: 10 }}>
                <PhotoCard url={vehicle.photoUrl1} label="ẢNH 1" />
                {vehicle.photoUrl2 && <PhotoCard url={vehicle.photoUrl2} label="ẢNH 2" />}
              </Box>
            </Box>

            {/* Pending notice */}
            {status === 'Pending' && (
              <Box
                style={{
                  background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: 14, padding: '12px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <Clock size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#92400E', lineHeight: '18px' }}>
                  Yêu cầu xác thực xe sẽ được xem xét trong{' '}
                  <strong>1–2 ngày làm việc</strong>.
                </p>
              </Box>
            )}

          </Box>
        )}
      </PullToRefresh>

      {/* Resubmit button for Rejected state */}
      {!loading && status === 'Rejected' && (
        <Box
          style={{
            flexShrink: 0,
            padding: '12px 16px',
            background: '#fff',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <button
            onClick={() => navigate('/verify-vehicle')}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #2FA85F, #1A6B38)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(40,143,78,0.35)',
            }}
          >
            <RotateCcw size={17} />
            Nộp lại thông tin xe
          </button>
        </Box>
      )}
    </Page>
  );
};

export default VehicleInfoPage;
