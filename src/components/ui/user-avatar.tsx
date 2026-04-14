import React, { FC } from 'react';
import { Box } from 'zmp-ui';

interface UserAvatarProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  size?: number;
  /** Opacity of the semi-transparent white background (0–1). Default 0.2 */
  bgOpacity?: number;
  /** Opacity of the semi-transparent white border (0–1). Default 0.4 */
  borderOpacity?: number;
}

const UserAvatar: FC<UserAvatarProps> = ({
  avatarUrl,
  fullName,
  size = 44,
  bgOpacity = 0.2,
  borderOpacity = 0.4,
}) => {
  const initial = fullName?.trim().split(' ').pop()?.charAt(0).toUpperCase() ?? '?';

  return (
    <Box
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: `rgba(255,255,255,${bgOpacity})`,
        border: `2px solid rgba(255,255,255,${borderOpacity})`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={fullName ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <span style={{ fontSize: size * 0.41, fontWeight: 700, color: '#fff' }}>
          {initial}
        </span>
      )}
    </Box>
  );
};

export default UserAvatar;
