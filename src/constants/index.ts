// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const COLORS = {
  primary: '#288F4E',
  primaryDark: '#1A6B38',
  primaryLight: '#EEF7F1',
  primaryBg: '#F0FDF4',
  primaryBorder: '#A7D9B8',
  primaryFade: '#D1EDD9',
  brown: '#C49A6C',
  brownDark: '#A0784A',
  brownLight: '#F5F0E8',
} as const;

// ─── Category Palette ──────────────────────────────────────────────────────────

export const CATEGORY_PALETTE = [
  { accent: '#288F4E', accentLight: '#DCFCE7', accentMid: '#BBF7D0' },
  { accent: '#D97706', accentLight: '#FEF3C7', accentMid: '#FDE68A' },
  { accent: '#7C3AED', accentLight: '#EDE9FE', accentMid: '#DDD6FE' },
  { accent: '#0891B2', accentLight: '#CFFAFE', accentMid: '#A5F3FC' },
  { accent: '#DB2777', accentLight: '#FCE7F3', accentMid: '#FBCFE8' },
  { accent: '#059669', accentLight: '#D1FAE5', accentMid: '#A7F3D0' },
] as const;

// ─── Fallback Assets ──────────────────────────────────────────────────────────

import logoImg from '@/assets/images/coin-logo.png';

export const FALLBACK_IMAGES = {
  station: logoImg,
  reward: logoImg,
};

export const KEYBOARD_HEIGHT_THRESHOLD = 160;
