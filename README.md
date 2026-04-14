# Ecogreen Coin

<p style="display: flex; flex-wrap: wrap; gap: 4px">
  <img alt="react" src="https://img.shields.io/badge/react-18.2.0-blue" />
  <img alt="zmp-ui" src="https://img.shields.io/badge/zmp--ui-1.11.5-green" />
  <img alt="zmp-sdk" src="https://img.shields.io/badge/zmp--sdk-2.39.9-green" />
  <img alt="zustand" src="https://img.shields.io/badge/zustand-4.5.2-orange" />
  <img alt="tailwindcss" src="https://img.shields.io/badge/tailwindcss-3.4.10-blue" />
  <img alt="typescript" src="https://img.shields.io/badge/typescript-5.x-blue" />
</p>

A **Zalo Mini App** for the Ecogreen Coin loyalty program. Users earn points by checking in at charging stations, redeem vouchers and products, track their rank benefits, and manage their EV (electric vehicle) profile — all within the Zalo super-app.

**Key features:**

- Zalo OAuth authentication with auto account creation
- EV charging station finder with province/ward filtering and infinite scroll
- QR code check-in at stations to earn loyalty points
- Rewards catalog (vouchers, physical items, F&B products) with category and store views
- Membership rank system with tier progression and benefits
- Vehicle registration and approval workflow
- Referral program with QR code sharing
- Point wallet tracking (earned, spent, locked balance)
- User voucher management with status and expiry

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (LTS recommended)
- [Zalo Mini App CLI](https://mini.zalo.me/docs/dev-tools/cli/intro/) (`npm i -g zmp-cli`)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm start
# or: zmp start
```

Open `localhost:3000` in your browser. The app runs inside a Zalo Mini App simulator.

### Using Zalo Mini App Extension (VS Code)

1. Install [VS Code](https://code.visualstudio.com/download) and [Zalo Mini App Extension](https://mini.zalo.me/docs/dev-tools)
2. Click **Create Project** → Choose **Ecogreen Coin** template
3. Configure **App ID**, install dependencies, then go to **Run** → **Start**

### Using Zalo Mini App Studio

1. [Install Zalo Mini App Studio](https://mini.zalo.me/docs/dev-tools)
2. New project → Enter Mini App ID → Choose **Ecogreen Coin** template
3. Click **Start** to run

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API base URL |
| `VITE_BASE_URL` | `` | Vite base path (set for deployment) |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Zalo Mini App dev server (`zmp start`) |
| `npm run deploy` | Deploy to Zalo platform (`zmp deploy`) |
| `npm run build:css` | Recompile Tailwind CSS → `src/styles/styles.css` |

---

## Deployment

1. Create a mini app at [Zalo Mini App Portal](https://mini.zalo.me/)
2. Log in via CLI:
   ```bash
   zmp login
   ```
3. Deploy using your mini app ID:
   ```bash
   zmp deploy
   ```
4. Scan the QR code with Zalo to preview the deployed app

---

## Project Structure

```
ecogreen-coin/
├── src/
│   ├── api/                  # HTTP layer (Axios client + one module per resource)
│   ├── store/                # Zustand state management (one file per domain)
│   ├── types/                # TypeScript interfaces and types
│   ├── components/           # Reusable React components
│   │   ├── ui/               # Primitive UI components
│   │   ├── layout/           # App shell, bottom nav, scroll restoration
│   │   ├── routing/          # ProtectedRoute auth guard
│   │   └── providers/        # CSS variable injection
│   ├── pages/                # Route-level page components (feature-grouped)
│   │   ├── home/             # / — Home page (banner, hero, top stations/stores/vouchers)
│   │   ├── auth/             # /register — Zalo OAuth login
│   │   ├── rewards/          # /rewards/* — Rewards catalog, category drill-down, detail
│   │   ├── stores/           # /stores/* — Store list + store detail
│   │   ├── stations/         # /stations/* — Station list + detail (merged)
│   │   ├── my-vouchers/      # /my-vouchers/* — User's claimed vouchers
│   │   ├── profile/          # /profile — User profile, QR referral sheet
│   │   ├── vehicle/          # /verify-vehicle + /vehicle-info — Vehicle registration & status
│   │   ├── qr-code/          # /qr-code — QR scanner for check-ins and referrals
│   │   ├── ranks/            # /rank-benefits — Tier progression and benefits
│   │   ├── checkins/         # /checkin-history — Point transaction history
│   │   └── policy/           # /policy — Terms and concepts
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── constants/            # Brand colors, fallback images, timing constants
│   ├── styles/               # Tailwind source + compiled CSS + SCSS + icons
│   ├── assets/images/        # Static images (background, logo)
│   ├── app.ts                # App entry point
│   └── global.d.ts           # Global TypeScript declarations
├── mocks/                    # Sample API response templates (reference only)
├── app-config.json           # Zalo Mini App shell configuration
├── tailwind.config.js        # Tailwind theme and content paths
├── vite.config.mts           # Vite build config with path alias (@/)
├── postcss.config.js         # PostCSS pipeline
└── tsconfig.json             # TypeScript configuration
```

---

## Routes

| Path | Page | File | Protected |
|------|------|------|-----------|
| `/` | Home | `pages/home/index.tsx` | No |
| `/register` | Zalo OAuth login | `pages/auth/index.tsx` | No |
| `/rewards` | Rewards catalog | `pages/rewards/index.tsx` | No |
| `/rewards/all` | Full rewards list | `pages/rewards/all-list.tsx` | No |
| `/rewards/category/:category` | Category drill-down | `pages/rewards/category-feed.tsx` | No |
| `/rewards/:id` | Reward detail + redeem | `pages/rewards/detail.tsx` | Yes |
| `/stores` | Store directory | `pages/stores/index.tsx` | No |
| `/stores/:storeId` | Store detail | `pages/stores/detail.tsx` | Yes |
| `/qr-code` | QR scanner | `pages/qr-code/index.tsx` | Yes |
| `/stations` | Station list | `pages/stations/index.tsx` | Yes |
| `/stations/:id` | Station detail | `pages/stations/detail.tsx` | Yes |
| `/profile` | User profile | `pages/profile/index.tsx` | Yes |
| `/my-vouchers` | Claimed vouchers | `pages/my-vouchers/index.tsx` | Yes |
| `/my-vouchers/:id` | Voucher detail | `pages/my-vouchers/voucher-detail.tsx` | Yes |
| `/rank-benefits` | Rank tiers & benefits | `pages/ranks/index.tsx` | Yes |
| `/checkin-history` | Point transaction history | `pages/checkins/index.tsx` | Yes |
| `/verify-vehicle` | Vehicle registration | `pages/vehicle/verify.tsx` | Yes |
| `/vehicle-info` | Vehicle approval status | `pages/vehicle/info.tsx` | Yes |
| `/policy` | Terms & concepts | `pages/policy/index.tsx` | No |

Protected routes redirect unauthenticated users to `/register`.

---

## Customization

### App title

Edit `app.title` in `app-config.json`:

```json
{
  "app": {
    "title": "Ecogreen Coin"
  }
}
```

### Brand colors

Primary color is `#288F4E` (green). Update in:
- `app-config.json` → `template.primaryColor`
- `src/constants/index.ts` → `COLORS`
- `tailwind.config.js` → `theme.extend.colors`

### Tailwind CSS

Edit `src/styles/tailwind.css`, then rebuild:

```bash
npm run build:css
```

Do **not** edit `src/styles/styles.css` directly — it is auto-generated.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Platform | Zalo Mini App (`zmp-sdk`, `zmp-ui`) |
| State | Zustand 4 |
| Routing | React Router v6 |
| HTTP | Axios with JWT interceptors |
| Styling | Tailwind CSS v3 + SCSS |
| Icons | Lucide React |
| Animation | @react-spring/web |
| Carousel | Swiper 9 |
| QR Code | react-qr-code |
| Build | Vite 5 |

---

## License

Copyright (c) Ecogreen. All rights reserved.
