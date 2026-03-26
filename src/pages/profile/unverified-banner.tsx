import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { useToBeImplemented } from '@/hooks';

const UnverifiedBanner: FC = () => {
  const onClick = useToBeImplemented();

  return (
    <Box
      className="mx-4 mt-3 rounded-2xl flex items-start"
      style={{
        background: '#FFFBF0',
        border: '1.5px solid #F0C060',
        padding: '14px 16px',
        gap: 12,
      }}
    >
      <Box
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 40, height: 40, background: '#FEF08A' }}
      >
        <span style={{ fontSize: 20 }}>🛡️</span>
      </Box>
      <Box style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>
          Tài khoản chưa xác thực
        </p>
        <p style={{ fontSize: 13, color: '#555', marginTop: 3, lineHeight: '18px' }}>
          Vui lòng xác thực để nhận các đặc quyền và tài khoản được bảo mật tốt nhất.
        </p>
        <p
          onClick={onClick}
          style={{ color: '#A0784A', fontWeight: 600, fontSize: 14, marginTop: 8, cursor: 'pointer' }}
        >
          Xác thực ngay
        </p>
      </Box>
    </Box>
  );
};

export default UnverifiedBanner;