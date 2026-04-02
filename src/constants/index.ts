// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const COLORS = {
  primary: '#288F4E',
  primaryDark: '#1A6B38',
  primaryLight: '#EEF7F1',
  primaryBg: '#F0FDF4',
  brown: '#C49A6C',
  brownDark: '#A0784A',
  brownLight: '#F5F0E8',
} as const;

// ─── Fallback Assets ──────────────────────────────────────────────────────────

import logoImg from '@/assets/images/logo.png';

export const FALLBACK_IMAGES = {
  station: logoImg,
  reward: logoImg,
};

export const KEYBOARD_HEIGHT_THRESHOLD = 160;
