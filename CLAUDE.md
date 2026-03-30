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
│   ├── feed.ts           # /app/feed — flat list (getFeedItems) + grouped by store (getFeedGrouped)
│   ├── rewards.ts        # /Rewards — detail, my-vouchers, redeem (list replaced by feed.ts)
│   ├── stations.ts       # /stations — list + detail
│   ├── banners.ts        # /app/banners
│   ├── checkins.ts       # /Checkins — submit + history
│   ├── user.ts           # /me/* — profile, vehicles, point-wallet, QR session, referrals
│   ├── ranks.ts          # /app/ranks
│   ├── provinces.ts      # /app/location/provinces
│   ├── wards.ts          # /app/location/wards
│   ├── upload.ts         # /upload/image
│   └── index.ts          # barrel re-export of all API modules
├── store/                # Zustand stores — one file per feature domain
│   ├── user.ts           # auth state, point wallet, QR scan
│   ├── rewards.ts        # allRewards, userRewards, storeGroups, globalRewards
│   ├── stations.ts       # stations list, filters (search/province/ward), pagination
│   ├── checkins.ts       # checkin history pagination
│   ├── banners.ts        # banner list
│   └── index.ts          # barrel re-export of all stores
├── types/                # TypeScript interfaces (no logic)
│   ├── common.ts         # PaginatedData<T>, PaginatedApiResponse<T>
│   ├── auth.ts           # JwtTokens, LoginResponse, RefreshResponse
│   ├── user.ts           # User, UserRank, VehicleInfo
│   ├── reward.ts         # Reward, FeedApiItem, RewardApiItem, UserReward, StoreGroup,
│   │                     #   GroupedFeedResult, FEED_ITEM_TYPES, FeedItemType, RewardSource
│   ├── station.ts        # Station, Province, Ward, GetStationsParams
│   ├── checkin.ts        # CheckinPayload, CheckinResponse, CheckinHistoryItem
│   ├── banner.ts         # Banner
│   ├── rank.ts           # AppRank
│   ├── point-wallet.ts   # PointWallet
│   └── menu.ts           # MenuItem
├── components/
│   ├── ui/               # Primitive reusable components
│   │   ├── sheet.tsx         # Portal-wrapped zmp-ui Sheet (fixes position:fixed inside overflow:hidden)
│   │   ├── pull-to-refresh.tsx
│   │   ├── skeleton.tsx      # TextSkeleton, ImageSkeleton
│   │   ├── section.tsx       # Container with optional title
│   │   ├── divider.tsx       # Spacer div
│   │   ├── list-item.tsx     # Title + subtitle + chevron row
│   │   ├── list-renderer.tsx # Generic collapsible list
│   │   ├── elastic-textarea.tsx
│   │   └── app.tsx
│   ├── layout/
│   │   ├── index.tsx         # App shell: all Routes, AppHeader, safe-area insets, auth init
│   │   ├── navigation.tsx    # Bottom nav: Home / Stations / QR FAB / Rewards / Profile
│   │   └── scroll-restoration.tsx
│   ├── routing/
│   │   └── protected-route.tsx  # Auth guard → redirects to /register if unauthenticated
│   └── providers/
│       └── config-provider.tsx  # Injects CSS variables onto document.documentElement
├── pages/                # Route-level components
│   ├── index/            # / — Home
│   │   ├── index.tsx
│   │   ├── banner.tsx        # Swiper carousel; taps open URL via openWebview
│   │   ├── hero-header.tsx
│   │   ├── top-stations.tsx
│   │   └── top-vouchers.tsx
│   ├── register.tsx      # /register — Zalo OAuth login page
│   ├── profile/          # /profile (protected)
│   │   ├── index.tsx
│   │   ├── member-card.tsx
│   │   ├── section-list.tsx
│   │   ├── unverified-banner.tsx
│   │   └── qr-code-sheet.tsx
│   ├── rewards/          # Flat structure — no sub-folders
│   │   ├── index.tsx         # /rewards — balance header + Danh mục / Cửa hàng tab switcher
│   │   ├── category-feed.tsx # /rewards/category/:category — grid filtered by itemTypeTranslate
│   │   ├── store-feed.tsx    # Store tab: global rewards + per-store sections (Grouped=true)
│   │   ├── item-cards-list.tsx # Category tab: horizontal-scroll rows grouped by category
│   │   ├── item-card.tsx     # Shared reward card (used in all scroll rows)
│   │   └── detail.tsx        # /rewards/:id (protected) — detail + redeem
│   ├── qr-code/          # /qr-code (protected)
│   │   ├── index.tsx
│   │   ├── scan-result-view.tsx
│   │   └── scan.ts
│   ├── stations/         # /stations (protected, infinite scroll)
│   │   ├── index.tsx
│   │   ├── search-filter.tsx # Province/ward Sheet pickers + search input
│   │   └── station-card.tsx
│   ├── station-detail/   # /stations/:id (protected)
│   │   ├── index.tsx         # Google Maps via openWebview
│   │   ├── info-row.tsx
│   │   └── stat-card.tsx
│   ├── my-vouchers/      # /my-vouchers (protected, infinite scroll)
│   │   ├── index.tsx
│   │   ├── voucher-card.tsx
│   │   └── voucher-detail-sheet.tsx
│   ├── rank-benefits/    # /rank-benefits (protected)
│   │   ├── index.tsx
│   │   ├── tiers.ts          # Hardcoded RANK_TIERS + resolveCurrentTier()
│   │   ├── hero-banner.tsx
│   │   ├── progress-steps.tsx
│   │   └── rank-card.tsx
│   ├── checkin-history/  # /checkin-history (protected, infinite scroll)
│   │   ├── index.tsx
│   │   ├── history-item.tsx
│   │   ├── history-skeleton.tsx
│   │   ├── summary-banner.tsx
│   │   └── utils.ts
│   ├── verify-vehicle/   # /verify-vehicle (protected)
│   │   ├── index.tsx
│   │   ├── vehicle-type-selector.tsx
│   │   └── image-picker.tsx
│   └── vehicle-info/     # /vehicle-info (protected)
│       └── index.tsx
├── hooks/
│   ├── use-infinite-scroll.ts         # IntersectionObserver sentinel → calls onLoadMore
│   ├── use-snackbar-init.ts           # Initialises zmp-ui Snackbar + globalSnackbar ref
│   ├── use-virtual-keyboard-visible.ts # Detects virtual keyboard (hides bottom nav)
│   └── index.ts                       # barrel re-export
├── utils/
│   ├── zalo.ts           # requestZaloPermissions, getZaloLocationToken, getZaloAccessToken
│   ├── date.ts           # formatDate, formatDateTime → DD/MM/YYYY [HH:mm]
│   ├── dom.ts            # parseUnitValue (extract numeric from CSS unit string)
│   ├── notification.ts   # setGlobalSnackbar, showNotification(message, type)
│   ├── config.ts         # getConfig — reads app-config.json
│   └── async.ts          # wait(ms) — resolves after delay
├── constants/
│   └── index.ts          # COLORS, FALLBACK_IMAGES, REDIRECT_DELAY_MS, KEYBOARD_HEIGHT_THRESHOLD
├── styles/
│   ├── tailwind.css      # Tailwind source (edit this)
│   ├── styles.css        # Compiled output — DO NOT edit directly; run build:css
│   ├── app.scss
│   └── icons.css
├── assets/images/        # background.png, logo.png
├── mocks/                # Sample response templates from the real API (reference only, not used as fallbacks)
├── app.ts                # Entry point
└── global.d.ts           # Global type declarations
```

## Routes

| Path | File | Protected |
|------|------|-----------|
| `/` | `pages/index/index.tsx` | No |
| `/register` | `pages/register.tsx` | No |
| `/rewards` | `pages/rewards/index.tsx` | No |
| `/rewards/:id` | `pages/rewards/detail.tsx` | Yes |
| `/rewards/category/:category` | `pages/rewards/category-feed.tsx` | No |
| `/qr-code` | `pages/qr-code/index.tsx` | Yes |
| `/stations` | `pages/stations/index.tsx` | Yes |
| `/stations/:id` | `pages/station-detail/index.tsx` | Yes |
| `/profile` | `pages/profile/index.tsx` | Yes |
| `/my-vouchers` | `pages/my-vouchers/index.tsx` | Yes |
| `/rank-benefits` | `pages/rank-benefits/index.tsx` | Yes |
| `/checkin-history` | `pages/checkin-history/index.tsx` | Yes |
| `/verify-vehicle` | `pages/verify-vehicle/index.tsx` | Yes |
| `/vehicle-info` | `pages/vehicle-info/index.tsx` | Yes |

All routes are declared in `src/components/layout/index.tsx`. `ProtectedRoute` redirects unauthenticated users to `/register`.

## Architecture

### Platform
This is a **Zalo Mini App** — a React app running inside the Zalo mobile super-app. Key platform constraints:
- `zmp-sdk` for native features (auth, location, system info)
- `zmp-ui` for platform-native UI components (`Box`, `Page`, `Sheet`, `BottomNavigation`, `SnackbarProvider`)
- Safe-area insets handled via `--zaui-safe-area-inset-top` CSS variable (see `src/components/layout/index.tsx`)
- `app-config.json` controls the Zalo shell (title, status bar, primary color, permissions)
- External links and maps open via `openWebview` (not `openOutApp` — lacks permission)

### Routing & Layout
All routes are declared in `src/components/layout/index.tsx`, which also owns:
- The `AppHeader` (back button + page title) — titles mapped in `getRouteTitle()`
- Auth initialization on mount
- The `ProtectedRoute` wrapper (`src/components/routing/protected-route.tsx`)

Bottom nav is in `src/components/layout/navigation.tsx` — 5 tabs with a floating QR button in the centre.

### Sheet / Modal
All bottom sheets use the `Sheet` component from `@/components/ui/sheet`, which wraps zmp-ui's `Sheet` in a **React portal** (`createPortal(..., document.body)`). This is required to prevent `position: fixed` from being broken by `overflow: hidden` on ancestor layout containers.

### State Management (Zustand)
Each feature has its own store in `src/store/`. Stores follow this pattern:
- State fields initialized with safe defaults (`[]`, `false`, `null`)
- `load*()` resets to page 1; `loadMore*()` appends the next page
- `items ?? []` and `hasNext ?? false` guards on every API response to prevent crashes

`src/store/index.ts` re-exports all stores.

### API Layer
`src/api/client.ts` is the Axios instance with:
- JWT Bearer token injected automatically
- Proactive token refresh 60 s before expiry
- Reactive 401 refresh with request queue (no duplicate refresh calls)

Each API module maps between backend response shape and app-internal types.

### Feed API (`/app/feed`)
The rewards list and store-items list are both served by `/app/feed`:
- **Flat mode** (`getFeedItems`): `GET /app/feed?pageNumber=&pageSize=&itemType=` — returns paginated `items[]`
- **Grouped mode** (`getFeedGrouped`): `GET /app/feed?Grouped=true` — returns `{ globalRewards[], stores[] }`

`itemType` values are defined in `FEED_ITEM_TYPES` (in `src/types/reward.ts`) and set per call in `src/store/rewards.ts`:
- Reward items: `Voucher`, `PhysicalItem`
- Store items: `FnbProduct`

`FeedApiItem.sourceType` (`'Reward' | 'StoreItem'`) maps directly to `Reward.source` — no translation layer.

### Rewards Feature (`src/pages/rewards/`)
Flat file structure (no sub-folders):
- `index.tsx` — balance banner + animated pill tab switcher (Danh mục / Cửa hàng)
- `item-cards-list.tsx` — Danh mục tab: horizontal-scroll rows, one per `itemTypeTranslate` category
- `category-feed.tsx` — drill-down grid for a single category with inline sort pills
- `store-feed.tsx` — Cửa hàng tab: global rewards section + per-store sections with item thumbnails
- `item-card.tsx` — shared card with type chip, stock badge, price display

### Pagination / Infinite Scroll
`src/hooks/use-infinite-scroll.ts` exports `useInfiniteScroll(onLoadMore, hasMore, loading)` → `sentinelRef`. Attach it to a 1 px `<div>` at the bottom of any list. Used on: Stations, Checkin History, My Vouchers.

### Authentication Flow
1. App mount → `initializeAuth()` checks stored JWT
2. No valid token → `ProtectedRoute` redirects to `/register`
3. Login: Zalo OAuth (scopes: userInfo, userLocation) → `POST /auth/zalo-login` → save tokens
4. Proactive refresh 60 s before expiry; reactive 401 refresh with request queue
5. Refresh failure → clear tokens, show notification, user redirected to `/register`

### Path Alias
`@/` resolves to `src/`. Use it for all cross-directory imports.

### Styling
Tailwind CSS v3 + inline `style={{}}` props (preferred for dynamic values). The zmp-ui `Box` component accepts `flex`, `flexDirection`, and other layout props directly. Lucide React is used for icons throughout (not the zmp icon set).

Brand colours: primary `#288F4E` (green), dark `#1A6B38`, light `#EEF7F1`. Defined in `src/constants/index.ts`.

### Rank System
Rank tiers are hardcoded in `src/pages/rank-benefits/tiers.ts` as `RANK_TIERS`. The `resolveCurrentTier()` function matches the API's `currentRankCode` / `currentRankName` using multiple fallback strategies (code match → name match) because the API's exact values may differ from the hardcoded codes.

### Key Type Conventions
- `FeedApiItem` → mapped to `Reward` via `mapFeedItemToReward()` in `src/api/feed.ts`
- `RewardApiItem` → used only by `getRewardById()` in `src/api/rewards.ts` (detail endpoint)
- `RewardSource` = `'Reward' | 'StoreItem'` — mirrors `FeedApiItem.sourceType` directly
- `FEED_ITEM_TYPES` = `{ VOUCHER, PHYSICAL_ITEM, FNB_PRODUCT }` — itemType values for `/app/feed`; defined separately so Business Logic can change the mapping without touching store logic
- `PaginatedApiResponse<T>` (in `src/types/common.ts`) is the standard store-facing paginated type
- `UserRank` (in `src/types/user.ts`) carries `currentRankCode` and `currentRankName`
- `PointWallet` (in `src/types/point-wallet.ts`) has `currentBalance`, `totalEarned`, `totalSpent`
- `StoreGroup` + `GroupedFeedResult` (in `src/types/reward.ts`) represent the Grouped feed response
