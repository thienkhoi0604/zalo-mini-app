import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Zap, Clock, Lock } from 'lucide-react';
import type { ScanResult } from './scan';
import CoinIcon from '@/components/ui/coin-icon';

function formatCheckinTime(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ScanResultView: FC<{ result: ScanResult }> = ({ result }) => {
  if (result.status === 'success' && result.type === 'referral') {
    return (
      <Box className="flex flex-col items-center" style={{ gap: 12 }}>
        <span style={{ fontSize: 56 }}>🎉</span>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#288F4E' }}>Giới thiệu thành công!</p>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '20px', maxWidth: 260 }}>
          Mã giới thiệu đã được ghi nhận.
        </p>
      </Box>
    );
  }

  if (result.status === 'success' && result.type === 'checkin') {
    const { station } = result;
    const checkinTimeLabel = formatCheckinTime(station?.checkinTime);

    return (
      <Box className="flex flex-col items-center w-full" style={{ gap: 16 }}>
        {/* Success header */}
        <Box className="flex flex-col items-center" style={{ gap: 8 }}>
          <span style={{ fontSize: 52 }}>🎉</span>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#288F4E' }}>Check-in thành công!</p>
        </Box>

        {/* Points badge */}
        {result.points != null && result.points > 0 && (
          <Box
            className="flex items-center justify-center rounded-2xl px-6 py-3"
            style={{ background: 'linear-gradient(135deg, #EEF7F1, #D1FAE5)', border: '1px solid #A7F3D0', gap: 8 }}
          >
            <CoinIcon size={26} />
            <p style={{ fontSize: 22, fontWeight: 900, color: '#288F4E', letterSpacing: -0.5 }}>
              +{result.points}
            </p>
          </Box>
        )}

        {/* Station info card */}
        {station?.stationName && (
          <Box
            className="w-full rounded-2xl"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.09)', border: '1px solid #F0F4F0', background: '#fff', overflow: 'hidden' }}
          >
            {/* Header */}
            <Box
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <Box
                style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, #2FA85F, #1A6B38)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Zap size={14} color="#fff" fill="#fff" strokeWidth={0} />
              </Box>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#111827', flex: 1 }}>
                {station.stationName}
              </p>
            </Box>

            {/* Details */}
            <Box style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {checkinTimeLabel && (
                <Box flex className="items-center" style={{ gap: 8 }}>
                  <Clock size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: '#6B7280' }}>{checkinTimeLabel}</p>
                </Box>
              )}

              {station.isPointLocked && (
                <Box
                  flex
                  className="items-center rounded-xl"
                  style={{ gap: 8, background: '#FEF9EF', border: '1px solid #FDE68A', padding: '8px 12px' }}
                >
                  <Lock size={13} color="#D97706" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: '#92400E' }}>
                    Điểm đang được giữ chờ xác nhận
                  </p>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  if (result.status === 'error') {
    return (
      <Box className="flex flex-col items-center" style={{ gap: 12 }}>
        <span style={{ fontSize: 56 }}>❌</span>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#EF4444' }}>Thất bại</p>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '20px', maxWidth: 260 }}>
          {result.message}
        </p>
      </Box>
    );
  }

  return null;
};

export default ScanResultView;
