# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server (zmp start)
npm run deploy     # Deploy to Zalo platform (zmp deploy)
npm run build:css  # Rebuild Tailwind CSS → src/styles/styles.css
```

No lint or test scripts are configured. TypeScript errors surface via the Vite build.

## Source Structure

```
src/
├── api/                  # HTTP layer — Axios client + one module per resource
│   ├── client.ts         # Axios instance: JWT injection, 401 refresh queue
│   ├── auth.ts           # Zalo OAuth login, token refresh, /auth/me
│   └── *.ts              # banners, checkins, provinces, wards, rewards, stations, user, ranks, upload
├── store/                # Zustand stores — one file per feature domain
│   └── index.ts          # barrel re-export of all stores
├── types/                # TypeScript interfaces (no logic)
├── components/
│   ├── ui/               # Primitive reusable components (sheet, skeleton, divider, etc.)
│   ├── layout/           # App shell: index.tsx (routes + AppHeader), navigation.tsx
│   ├── routing/          # protected-route.tsx — auth guard wrapper
│   └── providers/        # config-provider.tsx — zmp-ui config wrapper
├── pages/                # Route-level components, one folder per route
├── hooks/                # Custom React hooks (use-infinite-scroll, use-snackbar-init, use-virtual-keyboard-visible)
├── utils/                # Pure helpers: date, dom, async, config, notification, zalo (Zalo SDK wrappers)
├── constants/            # Brand colours, fallback images, timing constants
├── types/                # Shared TypeScript types
├── styles/               # CSS: tailwind.css (input), styles.css (compiled output), app.scss, icons.css
├── assets/images/        # Static images (background.png, logo.png)
└── mocks/                # JSON fallback data used when the real API fails
```

## Architecture

### Platform
This is a **Zalo Mini App** — a React app running inside the Zalo mobile super-app. Key platform constraints:
- `zmp-sdk` for native features (auth, location, system info)
- `zmp-ui` for platform-native UI components (`Box`, `Page`, `Sheet`, `BottomNavigation`, `SnackbarProvider`)
- Safe-area insets are handled manually via `--zaui-safe-area-inset-top` CSS variable (see `src/components/layout/index.tsx`)
- `app-config.json` controls the Zalo shell (title, status bar, primary color)

### Routing & Layout
All routes are declared in `src/components/layout/index.tsx`, which also owns:
- The `AppHeader` (back button + page title) — titles mapped in `getRouteTitle()`
- Auth initialization on mount
- The `ProtectedRoute` wrapper (`src/components/routing/protected-route.tsx`) that guards authenticated routes

The bottom nav is in `src/components/layout/navigation.tsx`.

### Sheet / Modal
All bottom sheets use the `Sheet` component from `@/components/ui/sheet`, which wraps zmp-ui's `Sheet` in a **React portal** (`createPortal(..., document.body)`). This is required to prevent `position: fixed` from being broken by `overflow: hidden` on ancestor layout containers.

### State Management (Zustand)
Each feature has its own store in `src/store/`. Stores follow this pattern:
- State fields initialized with safe defaults (`[]`, `false`, `null`)
- `load*()` resets to page 1; `loadMore*()` appends the next page
- `items ?? []` and `hasNext ?? false` guards on every API response assignment to prevent `.filter()` crashes when the API shape doesn't match expectations

`src/store/index.ts` re-exports all stores.

### API Layer
`src/api/client.ts` is the Axios instance with:
- JWT Bearer token injected automatically
- Proactive token refresh 60 s before expiry
- Reactive 401 refresh with request queue (no duplicate refresh calls)

Each API module in `src/api/` maps between the backend's response shape and the app's internal types. **Many backend endpoints return `{ success, data: T[] }` (flat array) rather than a paginated object** — these are sliced client-side inside the API function to produce the `PaginatedApiResponse<T>` shape that stores expect. See `getUserRewards` and `getCheckinHistory` for the pattern.

Mock JSON fallbacks live in `src/mocks/` and are used when the real API fails.

### Pagination / Infinite Scroll
`src/hooks/use-infinite-scroll.ts` exports `useInfiniteScroll(onLoadMore, hasMore, loading)` which returns a `sentinelRef`. Attach it to a 1 px `<div>` at the bottom of any list. Implemented on: Stations, Checkin History, My Vouchers.

### Path Alias
`@/` resolves to `src/`. Use it for all cross-directory imports.

### Styling
Tailwind CSS v3 + inline `style={{}}` props (preferred for dynamic values). The zmp-ui `Box` component accepts `flex`, `flexDirection`, and other layout props directly. Lucide React is used for icons throughout (not the zmp icon set).

### Rank System
Rank tiers are hardcoded in `src/pages/rank-benefits/tiers.ts` as `RANK_TIERS`. The `resolveCurrentTier()` function matches the API's `currentRankCode` / `currentRankName` against the tier list using multiple fallback strategies (code match → name match) because the API's exact values may differ from the hardcoded codes. The page is split into sub-components: `hero-banner.tsx`, `progress-steps.tsx`, `rank-card.tsx`.

### Key Type Conventions
- `RewardApiItem` → mapped to `Reward` via `mapApiItemToReward()` in `src/api/rewards.ts`
- `PaginatedApiResponse<T>` (in `src/types/common.ts`) is the standard store-facing paginated type
- `UserRank` (in `src/types/user.ts`) carries `currentRankCode` and `currentRankName`
- `PointWallet` (in `src/types/point-wallet.ts`) has `currentBalance`, `totalEarned`, `totalSpent`
