# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server (zmp start) — localhost:3000
npm run deploy     # Deploy to Zalo platform (zmp deploy)
npm run build:css  # Rebuild Tailwind CSS: src/styles/tailwind.css → src/styles/styles.css
```

No lint or test scripts are configured. TypeScript errors surface via the Vite build.

---

## Source Structure

```
src/
├── api/                  # HTTP layer — Axios client + one module per resource
│   ├── client.ts         # Axios instance: JWT injection, 401 refresh queue, base URL from VITE_API_URL
│   ├── auth.ts           # Zalo OAuth login, token refresh, localStorage token management
│   ├── feed.ts           # /app/feed — flat list (getFeedItems) + grouped by store (getFeedGrouped)
│   ├── rewards.ts        # /Rewards — detail, my-vouchers, redeem
│   ├── stations.ts       # /stations — paginated list + detail
│   ├── banners.ts        # /app/banners — unauthenticated, plain axios
│   ├── checkins.ts       # /Checkins — submit check-in + history
│   ├── user.ts           # /me/* — profile, vehicles, point-wallet, QR session, referrals
│   ├── ranks.ts          # /app/ranks
│   ├── provinces.ts      # /app/location/provinces
│   ├── wards.ts          # /app/location/wards?provinceCode=
│   ├── upload.ts         # /upload/image — multipart POST, returns URL
│   └── index.ts          # barrel re-export of all API modules
├── store/                # Zustand stores — one file per feature domain
│   ├── user.ts           # auth state, point wallet, QR scan
│   ├── rewards.ts        # allRewards, userRewards, storeGroups, globalRewards
│   ├── stations.ts       # stations list, filters (search/province/ward), pagination
│   ├── checkins.ts       # checkin history pagination
│   ├── banners.ts        # banner list (filtered by isActive, sorted by displayOrder)
│   └── index.ts          # barrel re-export of all stores
├── types/                # TypeScript interfaces (no logic)
│   ├── common.ts         # PaginatedData<T>, PaginatedApiResponse<T>
│   ├── auth.ts           # JwtTokens, LoginResponse, RefreshResponse, LoginResponseUser
│   ├── user.ts           # User, UserRank, VehicleInfo
│   ├── reward.ts         # Reward, FeedApiItem, RewardApiItem, UserReward, StoreGroup,
│   │                     #   GroupedFeedResult, FEED_ITEM_TYPES, FeedItemType, RewardSource,
│   │                     #   UserRewardItemType, RewardsFilter, GetUserRewardsParams
│   ├── station.ts        # Station, Province, Ward, GetStationsParams, StationsApiResponse
│   ├── checkin.ts        # CheckinPayload, CheckinResponse, CheckinHistoryItem, GetCheckinHistoryParams
│   ├── banner.ts         # Banner
│   ├── rank.ts           # AppRank
│   ├── point-wallet.ts   # PointWallet
│   └── menu.ts           # MenuItem
├── components/
│   ├── ui/               # Primitive reusable components
│   │   ├── app.tsx           # Root app wrapper with Zalo integration
│   │   ├── sheet.tsx         # Portal-wrapped zmp-ui Sheet (fixes position:fixed inside overflow:hidden)
│   │   ├── pull-to-refresh.tsx
│   │   ├── skeleton.tsx      # TextSkeleton, ImageSkeleton
│   │   ├── section.tsx       # Container with optional title
│   │   ├── divider.tsx       # Spacer div
│   │   ├── list-item.tsx     # Title + subtitle + chevron row
│   │   ├── list-renderer.tsx # Generic collapsible list
│   │   └── elastic-textarea.tsx # Auto-expanding textarea
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
│   │   ├── member-card.tsx       # Avatar, name, rank badge
│   │   ├── section-list.tsx      # Menu (edit, vehicles, referrals, rank, history, logout)
│   │   ├── unverified-banner.tsx # Prompt to verify vehicle
│   │   └── qr-code-sheet.tsx     # Referral QR code sheet
│   ├── rewards/          # Flat structure — no sub-folders
│   │   ├── index.tsx         # /rewards — balance header + Danh mục / Cửa hàng tab switcher
│   │   ├── category-feed.tsx # /rewards/category/:category — grid filtered by itemTypeTranslate
│   │   ├── store-feed.tsx    # Cửa hàng tab: global rewards + per-store sections (Grouped=true)
│   │   ├── item-cards-list.tsx # Danh mục tab: horizontal-scroll rows grouped by category
│   │   ├── item-card.tsx     # Shared reward card (type chip, stock badge, price display)
│   │   └── detail.tsx        # /rewards/:id (protected) — detail + redeem
│   ├── qr-code/          # /qr-code (protected)
│   │   ├── index.tsx
│   │   ├── scan-result-view.tsx  # Success / error / referral result display
│   │   └── scan.ts               # runScan() — checkin vs referral code detection
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
│   │   ├── voucher-card.tsx          # Status, expiry, usage info
│   │   └── voucher-detail-sheet.tsx  # Bottom sheet detail modal
│   ├── rank-benefits/    # /rank-benefits (protected)
│   │   ├── index.tsx
│   │   ├── tiers.ts          # TierConfig, buildTierConfig(), resolveCurrentTier()
│   │   ├── hero-banner.tsx
│   │   ├── progress-steps.tsx
│   │   └── rank-card.tsx
│   ├── checkin-history/  # /checkin-history (protected, infinite scroll)
│   │   ├── index.tsx
│   │   ├── history-item.tsx
│   │   ├── history-skeleton.tsx
│   │   ├── summary-banner.tsx    # Total points earned
│   │   └── utils.ts              # formatTime(), formatGroupLabel(), groupByDate()
│   ├── verify-vehicle/   # /verify-vehicle (protected)
│   │   ├── index.tsx
│   │   ├── vehicle-type-selector.tsx
│   │   └── image-picker.tsx      # Camera/gallery image selection
│   └── vehicle-info/     # /vehicle-info (protected)
│       └── index.tsx             # Vehicle approval status display
├── hooks/
│   ├── use-infinite-scroll.ts         # IntersectionObserver sentinel → calls onLoadMore
│   ├── use-snackbar-init.ts           # Initialises zmp-ui Snackbar + globalSnackbar ref
│   ├── use-virtual-keyboard-visible.ts # Detects virtual keyboard (hides bottom nav)
│   └── index.ts                       # barrel re-export (useVirtualKeyboardVisible, useSnackbarInit)
├── utils/
│   ├── zalo.ts           # requestZaloPermissions, getZaloLocationToken, getZaloAccessToken,
│   │                     #   requestLocationPermissionOnce
│   ├── date.ts           # formatDate → DD/MM/YYYY, formatDateTime → DD/MM/YYYY HH:mm
│   ├── dom.ts            # parseUnitValue (extract numeric from CSS unit string)
│   ├── notification.ts   # setGlobalSnackbar, showNotification(message, type)
│   ├── config.ts         # getConfig<T>(getter) — reads app-config.json via window.APP_CONFIG
│   └── async.ts          # wait(ms) — resolves after delay
├── constants/
│   └── index.ts          # COLORS, FALLBACK_IMAGES, REDIRECT_DELAY_MS, KEYBOARD_HEIGHT_THRESHOLD
├── styles/
│   ├── tailwind.css      # Tailwind source — EDIT THIS
│   ├── styles.css        # Compiled output — DO NOT EDIT (run build:css)
│   ├── app.scss          # Custom SCSS overrides
│   └── icons.css         # Icon styles
├── assets/images/        # background.png, logo.png
├── mocks/                # Sample API response templates (reference only, not used at runtime)
├── app.ts                # Entry point: renders App, sets window.APP_CONFIG
└── global.d.ts           # Global type declarations (*.png, *.svg, window.ZaloJavaScriptInterface)
```

---

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

---

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
- Auth initialization on mount via `initializeAuth()`
- The `ProtectedRoute` wrapper (`src/components/routing/protected-route.tsx`)

Bottom nav is in `src/components/layout/navigation.tsx` — 5 tabs with a floating QR button in the centre.

### Sheet / Modal

All bottom sheets use the `Sheet` component from `@/components/ui/sheet.tsx`, which wraps zmp-ui's `Sheet` in a **React portal** (`createPortal(..., document.body)`). This is required to prevent `position: fixed` from being broken by `overflow: hidden` on ancestor layout containers.

### State Management (Zustand)

Each feature has its own store in `src/store/`. Stores follow this pattern:
- State fields initialized with safe defaults (`[]`, `false`, `null`)
- `load*()` resets to page 1; `loadMore*()` appends the next page
- `items ?? []` and `hasNext ?? false` guards on every API response to prevent crashes

Stores:
| Store | Key State | Key Actions |
|-------|-----------|-------------|
| `useUserStore` | `user`, `pointWallet`, `isAuthenticated`, `authLoading` | `initializeAuth`, `loginWithZalo`, `loadPointWallet`, `setUnauthenticated`, `scanQRCode` |
| `useRewardsStore` | `allRewards`, `userRewards`, `globalRewards`, `storeGroups` | `loadAllRewards`, `loadRewardById`, `loadUserRewards`, `loadMoreUserRewards`, `loadStoreGroups`, `redeemReward` |
| `useStationsStore` | `stations`, `provinces`, `wards`, filters | `loadStations`, `loadMore`, `loadProvinces`, `loadWards`, `setFilters` |
| `useCheckinsStore` | `history`, `page`, `hasMore`, `historyLoading` | `loadHistory`, `loadMoreHistory` |
| `useBannersStore` | `banners`, `loading` | `loadBanners` |

### API Layer

`src/api/client.ts` is the Axios instance with:
- Base URL from `VITE_API_URL` env var (default: `http://localhost:3001`)
- JWT Bearer token injected automatically via request interceptor
- Proactive token refresh 60 s before expiry
- Reactive 401 refresh with request queue (no duplicate refresh calls)
- Token keys in localStorage: `ecogreen_access_token`, `ecogreen_refresh_token`

Each API module maps between backend response shape and app-internal types.

**Backend endpoints:**
| Module | Endpoints |
|--------|-----------|
| `auth.ts` | `POST /Auth/zalo-login`, `POST /auth/refresh` |
| `feed.ts` | `GET /app/feed` (flat + grouped modes) |
| `rewards.ts` | `GET /Rewards/{id}`, `GET /Rewards/my-vouchers`, `POST /Rewards/redeem` |
| `stations.ts` | `GET /stations`, `GET /stations/{id}` |
| `checkins.ts` | `POST /Checkins`, `GET /Checkins/history` |
| `user.ts` | `GET /me/profile`, `POST /me/vehicles/submit`, `GET /me/vehicles`, `POST /qr-code/scan`, `POST /me/qr/session`, `POST /app/referrals/scan`, `GET /me/referral-qr`, `GET /me/point-wallet` |
| `banners.ts` | `GET /app/banners` (unauthenticated) |
| `ranks.ts` | `GET /app/ranks` |
| `provinces.ts` | `GET /app/location/provinces` |
| `wards.ts` | `GET /app/location/wards?provinceCode=` |
| `upload.ts` | `POST /upload/image` |

### Feed API (`/app/feed`)

The rewards list and store-items list are both served by `/app/feed`:
- **Flat mode** (`getFeedItems`): `GET /app/feed?pageNumber=&pageSize=&itemType=` — returns paginated `items[]`
- **Grouped mode** (`getFeedGrouped`): `GET /app/feed?Grouped=true` — returns `{ globalRewards[], stores[] }`

`itemType` values are defined in `FEED_ITEM_TYPES` (in `src/types/reward.ts`):
- `VOUCHER` — discount/gift vouchers
- `PHYSICAL_ITEM` — physical merchandise
- `FNB_PRODUCT` — food & beverage store items

`FeedApiItem` is mapped to the unified `Reward` type via `mapFeedItemToReward()` in `src/api/feed.ts`.

### Rewards Feature (`src/pages/rewards/`)

Flat file structure (no sub-folders):
- `index.tsx` — balance banner + animated pill tab switcher (Danh mục / Cửa hàng)
- `item-cards-list.tsx` — Danh mục tab: horizontal-scroll rows, one per `itemTypeTranslate` category
- `category-feed.tsx` — drill-down grid for a single category with inline sort pills
- `store-feed.tsx` — Cửa hàng tab: global rewards section + per-store sections with item thumbnails
- `item-card.tsx` — shared card with type chip, stock badge, price display

### Pagination / Infinite Scroll

`src/hooks/use-infinite-scroll.ts` exports `useInfiniteScroll(onLoadMore, hasMore, loading)` → `sentinelRef`.
Attach the ref to a 1 px `<div>` at the bottom of any list. Used on: Stations, Checkin History, My Vouchers.

### Authentication Flow

1. App mount → `initializeAuth()` checks stored JWT
2. No valid token → `ProtectedRoute` redirects to `/register`
3. Login: `requestZaloPermissions()` (userInfo + userLocation scopes) → `getZaloAccessToken()` → `loginWithZaloUser()` → `POST /Auth/zalo-login` → save tokens
4. Proactive refresh 60 s before expiry; reactive 401 refresh with request queue
5. Refresh failure → `clearTokens()` + `setUnauthenticated()` → user redirected to `/register`

### QR Code Scan Flow

Located in `src/pages/qr-code/scan.ts` (`runScan()`):
1. Launch Zalo native QR scanner via `zmp-sdk`
2. Detect scanned code type: referral code (prefix `REF-`) vs. station check-in code
3. For check-in: call `POST /qr-code/scan` via `useUserStore.scanQRCode()`
4. For referral: call `POST /app/referrals/scan`
5. Display result via `scan-result-view.tsx`

### Path Alias

`@/` resolves to `src/`. Use it for all cross-directory imports.

### Styling

Tailwind CSS v3 + inline `style={{}}` props (preferred for dynamic values). The zmp-ui `Box` component accepts `flex`, `flexDirection`, and other layout props directly. Lucide React is used for all icons (not the zmp icon set).

Brand colours (defined in `src/constants/index.ts`):
| Constant | Value | Usage |
|----------|-------|-------|
| `COLORS.primary` | `#288F4E` | Main green |
| `COLORS.primaryDark` | `#1A6B38` | Hover / pressed |
| `COLORS.primaryLight` | `#EEF7F1` | Backgrounds |
| `COLORS.primaryBg` | `#F0FDF4` | Card backgrounds |
| `COLORS.brown` | `#C49A6C` | Secondary accent |
| `COLORS.brownDark` | `#A0784A` | Brown hover |
| `COLORS.brownLight` | `#F5F0E8` | Brown background |

Tailwind theme extends these as: `primary`, `green`, `background`, `gray` (`#767A7F`), `divider` (`#E9EBED`), `skeleton` (`rgba(0,0,0,0.1)`).

### Rank System

Rank tiers are hardcoded in `src/pages/rank-benefits/tiers.ts`:
- `TierConfig` type + `buildTierConfig()` builder
- `resolveCurrentTier(appRanks, userRank)` — matches `currentRankCode` / `currentRankName` using multiple fallback strategies (code match → name match) because the API's exact values may differ from hardcoded codes

### Key Type Conventions

- `FeedApiItem` → mapped to `Reward` via `mapFeedItemToReward()` in `src/api/feed.ts`
- `RewardApiItem` → used only by `getRewardById()` in `src/api/rewards.ts` (detail endpoint)
- `RewardSource = 'Reward' | 'StoreItem'` — mirrors `FeedApiItem.sourceType` directly
- `FEED_ITEM_TYPES = { VOUCHER, PHYSICAL_ITEM, FNB_PRODUCT }` — itemType values for `/app/feed`
- `PaginatedApiResponse<T>` — standard store-facing paginated type with `.data.items`, `.data.hasNext`
- `UserRank` — carries `currentRankCode`, `currentRankName`, `progressToNextPercent`, `pointsToNext`
- `PointWallet` — has `currentBalance`, `lockedBalance`, `totalEarned`, `totalSpent`, `vehicleStatus`
- `StoreGroup + GroupedFeedResult` — represent the `/app/feed?Grouped=true` response
- `QRSessionType = 'Checkin' | 'Voucher' | 'Product'` — determines QR session purpose
- `VerifyVehiclePayload` — contains vehicle type code + two photo URLs from upload API

### Error Handling Pattern

All API modules return safe defaults on failure rather than throwing (e.g., `[]`, `null`, empty `PointWallet`). Errors are surfaced via `showNotification()` from `src/utils/notification.ts`. The Axios client handles 401 transparently via the refresh queue.

### Notifications

`src/utils/notification.ts` exports:
- `setGlobalSnackbar(snackbar)` — registers the zmp-ui snackbar instance (called in `useSnackbarInit`)
- `showNotification(message, type)` — displays a snackbar; `type` is `'success' | 'error' | 'warning' | 'info'`
