/**
 * ─── App Theme ────────────────────────────────────────────────────────────────
 *
 * To switch to a seasonal theme, change the ONE line at the bottom:
 *   export const ACTIVE_THEME: AppTheme = THEMES.christmas;
 *
 * Everything that reads ACTIVE_THEME — page backgrounds, header gradients,
 * wave shapes — will update automatically.
 */

export interface AppTheme {
  name: string;

  // ── Page body ──────────────────────────────────────────────────────────────
  /** Scrollable content area background */
  pageBg: string;

  // ── Header gradient (three colour stops) ──────────────────────────────────
  headerFrom: string;
  headerMid: string;
  headerTo: string;

  // ── Decorative blobs on the header ────────────────────────────────────────
  /** Opacity of the white translucent circles (0 – 1) */
  blobOpacity: number;

  // ── Wave divider ──────────────────────────────────────────────────────────
  /**
   * SVG path for the wave at the bottom of every page header.
   * Canvas: viewBox="0 0 390 40". The path should end with L390,40 L0,40 Z.
   * The fill is always `pageBg`, creating a seamless colour transition.
   *
   * ✦ Seasonal tip: swap this path for holiday silhouettes — Christmas tree
   *   peaks, Easter egg bumps, Tết lantern arches, etc.
   */
  wavePath: string;

  // ── Optional texture overlay on the header ────────────────────────────────
  /** URL of a repeating image/texture layered over the gradient (null = none) */
  headerTexture?: string;
  headerTextureOpacity?: number;
}

// ─── Wave path library ────────────────────────────────────────────────────────

const WAVES = {
  /** Gentle organic double-wave — nature / eco feel */
  organic:
    'M0,14 C60,30 130,2 200,16 C270,30 330,6 390,18 L390,40 L0,40 Z',

  /** Deep smooth arch — minimal / premium */
  arch:
    'M0,32 Q195,0 390,32 L390,40 L0,40 Z',

  /** Rolling hills — spring / summer */
  hills:
    'M0,0 C130,40 260,40 390,0 L390,40 L0,40 Z',

  /** Bubbly bumps — Easter / playful festivals */
  bubbles:
    'M0,22 C30,6 60,38 90,22 C120,6 150,38 180,22 C210,6 240,38 270,22 C300,6 330,38 360,22 C375,17 383,19 390,17 L390,40 L0,40 Z',

  /** Mountain peaks — Christmas / winter / highlands */
  mountains:
    'M0,40 L0,30 L25,10 L50,30 L80,8 L115,30 L145,10 L180,30 L210,8 L250,30 L280,10 L320,30 L350,8 L390,30 L390,40 Z',

  /** Gentle zig-zag — Mid-Autumn / geometric festivals */
  zigzag:
    'M0,40 L0,20 L32,0 L65,20 L97,0 L130,20 L162,0 L195,20 L228,0 L260,20 L292,0 L325,20 L358,0 L390,20 L390,40 Z',
} as const;

// ─── Theme definitions ────────────────────────────────────────────────────────

export const THEMES = {
  /** Default Ecogreen brand — green, organic, year-round */
  default: {
    name: 'Ecogreen',
    pageBg: '#F2F7F4',
    headerFrom: '#0D3D20',
    headerMid: '#1A6B38',
    headerTo: '#2FA85F',
    blobOpacity: 0.07,
    wavePath: WAVES.organic,
  } satisfies AppTheme,

  /** Christmas — deep red with snowy mountain peaks */
  christmas: {
    name: 'Christmas',
    pageBg: '#FFF5F5',
    headerFrom: '#6B1B1B',
    headerMid: '#991B1B',
    headerTo: '#DC2626',
    blobOpacity: 0.09,
    wavePath: WAVES.mountains,
  } satisfies AppTheme,

  /** Easter — soft violet with egg-bump wave */
  easter: {
    name: 'Easter',
    pageBg: '#FAF5FF',
    headerFrom: '#3B1870',
    headerMid: '#6D28D9',
    headerTo: '#9333EA',
    blobOpacity: 0.09,
    wavePath: WAVES.bubbles,
  } satisfies AppTheme,

  /** Tết (Lunar New Year) — gold & red with arch wave */
  tet: {
    name: 'Tết',
    pageBg: '#FFF7ED',
    headerFrom: '#7C2D12',
    headerMid: '#C2410C',
    headerTo: '#F59E0B',
    blobOpacity: 0.08,
    wavePath: WAVES.arch,
  } satisfies AppTheme,

  /** Mid-Autumn — deep indigo with geometric lantern wave */
  midAutumn: {
    name: 'Trung Thu',
    pageBg: '#FFF8F0',
    headerFrom: '#1E1B4B',
    headerMid: '#3730A3',
    headerTo: '#F59E0B',
    blobOpacity: 0.08,
    wavePath: WAVES.zigzag,
  } satisfies AppTheme,

  /** Summer — ocean blue with rolling hills */
  summer: {
    name: 'Summer',
    pageBg: '#F0F9FF',
    headerFrom: '#082F49',
    headerMid: '#0369A1',
    headerTo: '#0EA5E9',
    blobOpacity: 0.08,
    wavePath: WAVES.hills,
  } satisfies AppTheme,
} as const;

/**
 * ── ACTIVE THEME ──────────────────────────────────────────────────────────────
 * Change this one line to switch the entire app's seasonal appearance.
 *
 * Examples:
 *   export const ACTIVE_THEME: AppTheme = THEMES.christmas;
 *   export const ACTIVE_THEME: AppTheme = THEMES.tet;
 *   export const ACTIVE_THEME: AppTheme = THEMES.easter;
 */
export const ACTIVE_THEME: AppTheme = THEMES.default;
