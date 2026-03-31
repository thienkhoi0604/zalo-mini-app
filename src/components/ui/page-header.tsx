import React, { FC, ReactNode } from 'react';
import { Box } from 'zmp-ui';
import { ACTIVE_THEME } from '@/constants/theme';

interface PageHeaderProps {
  children: ReactNode;
  /**
   * Extra padding below the content before the wave starts (px).
   * Increase if content is close to the bottom edge.
   */
  paddingBottom?: number;
}

/**
 * Themed gradient header used across all main pages.
 *
 * Renders:
 *  • Three-stop gradient background from ACTIVE_THEME
 *  • Translucent decorative blobs for depth
 *  • Optional texture overlay (ACTIVE_THEME.headerTexture)
 *  • SVG wave divider at the bottom that blends into the page body colour
 *
 * To swap seasonal themes, edit `ACTIVE_THEME` in src/constants/theme.ts.
 */
const PageHeader: FC<PageHeaderProps> = ({ children, paddingBottom = 16 }) => {
  const t = ACTIVE_THEME;
  const gradient = `linear-gradient(135deg, ${t.headerFrom} 0%, ${t.headerMid} 55%, ${t.headerTo} 100%)`;
  const blob = `rgba(255,255,255,${t.blobOpacity})`;
  const blobFaint = `rgba(255,255,255,${t.blobOpacity * 0.65})`;

  return (
    <Box
      style={{
        position: 'relative',
        flexShrink: 0,
        background: gradient,
        overflow: 'hidden',
      }}
    >
      {/* ── Decorative blobs ── */}
      <Box style={{ position: 'absolute', top: -38, right: -26, width: 160, height: 160, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />
      <Box style={{ position: 'absolute', top: 20, right: 100, width: 56, height: 56, borderRadius: '50%', background: blobFaint, pointerEvents: 'none' }} />
      <Box style={{ position: 'absolute', bottom: 18, left: -22, width: 120, height: 120, borderRadius: '50%', background: blobFaint, pointerEvents: 'none' }} />
      <Box style={{ position: 'absolute', bottom: 30, left: '44%', width: 48, height: 48, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />

      {/* ── Optional texture overlay ── */}
      {t.headerTexture && (
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${t.headerTexture})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            opacity: t.headerTextureOpacity ?? 0.08,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Content ── */}
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          padding: `14px 16px ${paddingBottom + 40}px`,
        }}
      >
        {children}
      </Box>

      {/* ── Wave divider ── */}
      {/* Fill matches pageBg so the transition is seamless */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          lineHeight: 0,
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 390 40"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: 40 }}
        >
          <path d={t.wavePath} fill={t.pageBg} />
        </svg>
      </div>
    </Box>
  );
};

export default PageHeader;
