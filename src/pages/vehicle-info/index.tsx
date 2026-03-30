import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import {
  Car,
  CheckCircle,
  CalendarCheck,
  ImageOff,
  Pencil,
  Zap,
} from 'lucide-react';
import { fetchVehicleInfo } from '@/api/user';
import { VehicleInfo } from '@/types/user';
import {
  VEHICLE_TYPES,
  VEHICLE_TYPE_IDS,
} from '@/pages/verify-vehicle/vehicle-type-selector';
import PullToRefresh from '@/components/ui/pull-to-refresh';

// Reverse lookup: vehicleTypeId → VehicleType
const vehicleTypeById: Record<string, (typeof VEHICLE_TYPES)[number]> =
  VEHICLE_TYPES.reduce(
    (acc, t) => {
      acc[VEHICLE_TYPE_IDS[t.code]] = t;
      return acc;
    },
    {} as Record<string, (typeof VEHICLE_TYPES)[number]>,
  );

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
    <Box
      style={{
        height: 130,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {url ? (
        <img
          src={url}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ImageOff size={24} color="#D1D5DB" />
          <p style={{ fontSize: 11, color: '#D1D5DB' }}>Không có ảnh</p>
        </Box>
      )}
    </Box>
  </Box>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: FC = () => (
  <Box
    style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}
  >
    {[120, 100, 180].map((h, i) => (
      <Box
        key={i}
        className="animate-pulse"
        style={{ height: h, borderRadius: 16, background: '#E9EBED' }}
      />
    ))}
  </Box>
);

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow: FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Box
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: '#DCFCE7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box style={{ flex: 1 }}>
      <p
        style={{
          fontSize: 11,
          color: '#9CA3AF',
          fontWeight: 600,
          marginBottom: 1,
        }}
      >
        {label}
      </p>
      <Box>{value}</Box>
    </Box>
  </Box>
);

function vehicleById(id: string) {
  return vehicleTypeById[id] ?? null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const VehicleInfoPage: FC = () => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVehicle = useCallback(async () => {
    setLoading(true);
    const v = await fetchVehicleInfo();
    setVehicle(v);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVehicle();
  }, []);

  const vehicleType = vehicle?.vehicleTypeId
    ? vehicleById(vehicle.vehicleTypeId)
    : null;

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
          <Box
            style={{
              position: 'absolute',
              top: -24,
              right: -24,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              bottom: -16,
              left: -16,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            }}
          />

          <Box style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Box
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Car size={26} color="#fff" />
            </Box>
            <Box>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: '24px',
                  }}
                >
                  Thông tin xe của tôi
                </p>
                {!loading && vehicle?.approvalStatus && (
                  <Box
                    style={{
                      background:
                        vehicle.approvalStatus === 'Approved'
                          ? 'rgba(255,255,255,0.25)'
                          : 'rgba(251,191,36,0.4)',
                      borderRadius: 100,
                      padding: '2px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle size={10} color="#fff" />
                    <span
                      style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}
                    >
                      {vehicle.approvalStatus === 'Approved'
                        ? 'Đã xác thực'
                        : 'Chờ duyệt'}
                    </span>
                  </Box>
                )}
              </Box>
              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '18px',
                }}
              >
                Xe điện được xác minh để tích điểm
              </p>
            </Box>
          </Box>
        </Box>

        {loading ? (
          <Skeleton />
        ) : !vehicle ? (
          <Box style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>
              Không thể tải thông tin xe
            </p>
          </Box>
        ) : (
          <Box
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Vehicle details card */}
            <Box
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                Chi tiết phương tiện
              </p>

              <InfoRow
                icon={<Car size={18} color="#288F4E" />}
                label="BIỂN SỐ XE"
                value={
                  <p
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#111827',
                      letterSpacing: 1.5,
                    }}
                  >
                    {vehicle.licensePlate}
                  </p>
                }
              />

              <Box style={{ height: 1, background: '#F3F4F6' }} />

              <InfoRow
                icon={
                  <Zap
                    size={18}
                    color="#288F4E"
                    fill="#288F4E"
                    strokeWidth={0}
                  />
                }
                label="LOẠI PHƯƠNG TIỆN"
                value={
                  <p
                    style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}
                  >
                    {vehicleType?.label ?? vehicle.vehicleTypeName ?? 'Xe điện'}
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
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
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
                background: '#fff',
                borderRadius: 16,
                padding: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                Ảnh xe
              </p>
              <Box style={{ display: 'flex', gap: 10 }}>
                <PhotoCard url={vehicle.photoUrl1} label="ẢNH 1" />
                {vehicle.photoUrl2 && (
                  <PhotoCard url={vehicle.photoUrl2} label="ẢNH 2" />
                )}
              </Box>
            </Box>

            {/* Rejection reason */}
            {vehicle.rejectionReason && (
              <Box
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 14,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>❌</span>
                <Box>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#B91C1C',
                      marginBottom: 3,
                    }}
                  >
                    Lý do từ chối
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#991B1B',
                      lineHeight: '18px',
                    }}
                  >
                    {vehicle.rejectionReason}
                  </p>
                </Box>
              </Box>
            )}

            {/* Notice */}
            {vehicle.approvalStatus !== 'Approved' && (
              <Box
                style={{
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: 14,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
                <p
                  style={{ fontSize: 12, color: '#92400E', lineHeight: '18px' }}
                >
                  Yêu cầu cập nhật thông tin xe sẽ được xem xét trong{' '}
                  <strong>1–2 ngày làm việc</strong>.
                </p>
              </Box>
            )}
          </Box>
        )}
      </PullToRefresh>

      {/* Sticky CTA */}
      {/* <Box
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
          <Pencil size={17} />
          Cập nhật thông tin xe
        </button>
      </Box> */}
    </Page>
  );
};

export default VehicleInfoPage;
