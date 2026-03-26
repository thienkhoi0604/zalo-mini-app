# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server (zmp start)
npm run deploy     # Deploy to Zalo platform (zmp deploy)
npm run build:css  # Rebuild Tailwind CSS → src/css/styles.css
```

No lint or test scripts are configured. TypeScript errors surface via the Vite build.

## Architecture

### Platform
This is a **Zalo Mini App** — a React app running inside the Zalo mobile super-app. Key platform constraints:
- `zmp-sdk` for native features (auth, location, system info)
- `zmp-ui` for platform-native UI components (`Box`, `Page`, `Sheet`, `BottomNavigation`, `SnackbarProvider`)
- Safe-area insets are handled manually via `--zaui-safe-area-inset-top` CSS variable (see `src/components/layout.tsx`)
- `app-config.json` controls the Zalo shell (title, status bar, primary color)

### Routing & Layout
All routes are declared in `src/components/layout.tsx`, which also owns:
- The `AppHeader` (back button + page title) — titles mapped in `getRouteTitle()`
- Auth initialization on mount
- The `ProtectedRoute` wrapper that guards authenticated routes

The bottom nav is in `src/components/navigation.tsx`.

### State Management (Zustand)
Each feature has its own store in `src/stores/`. Stores follow this pattern:
- State fields initialized with safe defaults (`[]`, `false`, `null`)
- `load*()` resets to page 1; `loadMore*()` appends the next page
- `items ?? []` and `hasNext ?? false` guards on every API response assignment to prevent `.filter()` crashes when the API shape doesn't match expectations

`src/stores/index.ts` re-exports all stores.

### API Layer
`src/apis/client.ts` is the Axios instance with:
- JWT Bearer token injected automatically
- Proactive token refresh 60 s before expiry
- Reactive 401 refresh with request queue (no duplicate refresh calls)

Each API module in `src/apis/` maps between the backend's response shape and the app's internal types. **Many backend endpoints return `{ success, data: T[] }` (flat array) rather than a paginated object** — these are sliced client-side inside the API function to produce the `PaginatedApiResponse<T>` shape that stores expect. See `getUserRewards` and `getCheckinHistory` for the pattern.

Mock JSON fallbacks live in `src/mock/` and are used when the real API fails.

### Pagination / Infinite Scroll
`src/hooks/use-infinite-scroll.ts` exports `useInfiniteScroll(onLoadMore, hasMore, loading)` which returns a `sentinelRef`. Attach it to a 1 px `<div>` at the bottom of any list. Implemented on: Stations, Checkin History, My Vouchers.

### Path Alias
`@/` resolves to `src/`. Use it for all cross-directory imports.

### Styling
Tailwind CSS v3 + inline `style={{}}` props (preferred for dynamic values). The zmp-ui `Box` component accepts `flex`, `flexDirection`, and other layout props directly. Lucide React is used for icons throughout (not the zmp icon set).

### Rank System
Rank tiers are hardcoded in `src/pages/rank-benefits.tsx` as `RANK_TIERS`. The `resolveCurrentTier()` function matches the API's `currentRankCode` / `currentRankName` against the tier list using multiple fallback strategies (code match → name match) because the API's exact values may differ from the hardcoded codes.

### Key Type Conventions
- `RewardApiItem` → mapped to `Reward` via `mapApiItemToReward()` in `src/apis/rewards.ts`
- `PaginatedApiResponse<T>` (in `src/types/common.ts`) is the standard store-facing paginated type
- `UserRank` (in `src/types/user.ts`) carries `currentRankCode` and `currentRankName`
- `PointWallet` (in `src/types/point-wallet.ts`) has `currentBalance`, `totalEarned`, `totalSpent`
