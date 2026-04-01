import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import type { ScanResult } from './scan';

const ScanResultView: FC<{ result: ScanResult }> = ({ result }) => {
  if (result.status === 'success' && result.type === 'referral') {
    return (
      <Box className="flex flex-col items-center" style={{ gap: 12 }}>
        <span style={{ fontSize: 56 }}>🎉</span>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#288F4E' }}>Giới thiệu thành công!</p>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '20px', maxWidth: 260 }}>
          Mã giới thiệu đã được ghi nhận.
        </p>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          Đang chuyển về trang cá nhân...
        </p>
      </Box>
    );
  }

  if (result.status === 'success' && result.type === 'checkin') {
    return (
      <Box className="flex flex-col items-center" style={{ gap: 12 }}>
        <span style={{ fontSize: 56 }}>🎉</span>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#288F4E' }}>Check-in thành công!</p>
        {result.points != null && result.points > 0 && (
          <Box
            className="flex items-center justify-center rounded-2xl px-5 py-3"
            style={{ background: '#EEF7F1', gap: 8 }}
          >
            <span style={{ fontSize: 22 }}>🪙</span>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#288F4E' }}>
              +{result.points} Points
            </p>
          </Box>
        )}
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          Đang chuyển về trang cá nhân...
        </p>
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
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          Đang chuyển về trang cá nhân...
        </p>
      </Box>
    );
  }

  return null;
};

export default ScanResultView;
