# API Reference

All requests go to the base URL configured via `APP_CONFIG.apiBaseUrl` or the `VITE_API_URL` environment variable (default: `http://localhost:3001`).

## Authentication

Most endpoints require a JWT Bearer token injected automatically by the Axios client (`src/api/client.ts`).

- Token storage keys: `ecogreen_access_token`, `ecogreen_refresh_token` (localStorage)
- Proactive token refresh: 60 s before expiry
- Reactive 401 refresh: failed requests are queued and retried after token refresh
- Refresh failure: tokens cleared, user redirected to `/register`

---

## Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/Auth/zalo-login` | No | Exchange Zalo access token for JWT tokens |
| `POST` | `/auth/refresh` | No | Refresh access + refresh tokens |

**`POST /Auth/zalo-login`**
```json
// Request
{ "accessToken": "<zalo_access_token>", "code": "<location_token (optional)>" }

// Response
{
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id", "zaloUserId", "fullName", "avatarUrl", "phone", "email",
      "role", "userName", "address", "provinceCode", "wardCode",
      "latitude", "longitude", "isVehicleApproved", "status",
      "lastLoginAt", "createdAt", "rank", "points", "verified", "voucherCount"
    }
  }
}
```

**`POST /auth/refresh`**
```json
// Request
{ "refreshToken": "..." }

// Response
{ "data": { "accessToken": "...", "refreshToken": "..." } }
```

---

### Feed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/app/feed` | Yes | Paginated flat list of feed items |
| `GET` | `/app/feed?Grouped=true` | Yes | Feed grouped by store (globalRewards + stores) |

**`GET /app/feed` (flat)**

Query params: `pageNumber`, `pageSize`, `Type` (item type filter), `StoreId`

```json
// Response
{
  "data": {
    "items": [/* FeedApiItem[] */],
    "pageNumber": 1,
    "pageSize": 50,
    "totalCount": 100,
    "totalPages": 2,
    "hasPrevious": false,
    "hasNext": true
  }
}
```

**`GET /app/feed?Grouped=true`**

```json
// Response
{
  "data": {
    "globalRewards": [/* FeedApiItem[] */],
    "stores": [
      {
        "storeId", "storeName", "storeAddress", "distanceKm",
        "latitude", "longitude", "storeImageUrl", "phone",
        "openTime", "closeTime", "workingStatus",
        "items": [/* FeedApiItem[] */]
      }
    ]
  }
}
```

**`FeedApiItem` shape:**
```ts
{
  id, code, name, description, shortDescription, imageUrl,
  itemType,          // 'VOUCHER' | 'PHYSICAL_ITEM' | 'FNB_PRODUCT' | 'SERVICE' | 'RETAIL_PRODUCT'
  itemTypeTranslate, // human-readable category label
  sourceType,        // 'Reward' | 'StoreItem'
  pointCost,         // cost in Lá (Rewards)
  coinCost,          // cost in GreenCoin (StoreItems)
  price,
  stock,
  validFrom, validTo,
  appliesToAll,
  storeId, storeName, storeAddress, storeImageUrl, storePhone,
  storeOpenTime, storeCloseTime,
  distanceKm, latitude, longitude
}
```

---

### Rewards (Vouchers)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/Rewards/{id}` | Yes | Get reward detail by ID |
| `GET` | `/app/store-items/{id}` | Yes | Get store item detail by ID |
| `GET` | `/Rewards/my-vouchers` | Yes | Get paginated user vouchers |
| `POST` | `/Rewards/redeem` | Yes | Redeem a reward or store item |

**`GET /Rewards/{id}`**
```json
// Response
{
  "data": {
    "id", "code", "name", "type", "description", "shortDescription",
    "imageUrl", "pointCost", "validFrom", "validTo", "isActive",
    "appliesToAll",
    "appliedStores": [{ "id", "name", "address", "imageUrl", "googleMapsDirectionUrl" }],
    "storeNames": ["..."],
    "storeIds": ["..."]
  }
}
```

**`GET /app/store-items/{id}`**
```json
// Response
{
  "data": {
    "id", "code", "name", "typeName", "description", "shortDescription",
    "imageUrl", "coinCost", "price", "stock",
    "storeId", "storeName", "storeImageUrl",
    "address", "wardName", "provinceName", "googleMapsDirectionUrl"
  }
}
```

**`GET /Rewards/my-vouchers`**

Query params: `pageNumber`, `pageSize`, `IsUsed` (boolean, optional)

```json
// Response
{
  "data": {
    "items": [
      {
        "id", "code", "imageUrl", "rewardId", "rewardName",
        "shortDescription",
        "storeName", "storeItemId",
        "itemType",   // "Reward" | "Product"
        "status", "issuedAt", "expiredAt", "usedAt",
        "appliesToAll",
        "appliedStores": [/* AppliedStore[] */],
        "appliedStoreItems": [/* AppliedStoreItem[] */],
        "pointCost",
        "promotionSnapshot": {
          // present for Reward items; null for Product items
          "description": "Full description text",
          "shortDescription": "Brief tagline"
          // also carries pointCost used as fallback when top-level pointCost is null
        }
      }
    ],
    "pageNumber": 1,
    "pageSize": 5,
    "totalCount": 20,
    "hasNext": true
  }
}
```

> `pointCost` is resolved from `item.pointCost ?? item.promotionSnapshot?.pointCost`.

**`POST /Rewards/redeem`**
```json
// Request
{ "rewardId": "...", "itemType": "Reward" | "Product" }

// Response
{ "data": { "pointsDeducted": 100 } }
```

---

### Stores

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/app/stores` | Yes | Paginated list of stores |
| `GET` | `/app/stores/{id}` | Yes | Store detail by ID |

**`GET /app/stores`**

Query params: `pageNumber`, `pageSize`

```json
// Response
{
  "data": {
    "items": [/* AppStore[] */],
    "hasNext": true
  }
}
```

**`AppStore` shape:**
```ts
{
  id, code, name, address,
  latitude, longitude,
  provinceCode, provinceName,
  wardCode, wardName,
  description, imageUrl, storeImageUrl,
  phone, operatingHours,
  openTime, closeTime,
  distanceKm,
  googleMapsDirectionUrl,
  stations: []
}
```

---

### Stations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/stations` | Yes | Paginated + filtered list of stations |
| `GET` | `/stations/{id}` | Yes | Station detail by ID |

**`GET /stations`**

Query params: `pageNumber`, `pageSize`, `search`, `provinceCode`, `wardCode` (see `GetStationsParams`)

```json
// Response (StationsApiResponse)
{
  "success": true,
  "data": {
    "items": [/* Station[] */],
    "pageNumber": 1,
    "pageSize": 5,
    "totalCount": 30,
    "totalPages": 6,
    "hasPrevious": false,
    "hasNext": true
  }
}
```

---

### Check-ins

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/Checkins` | Yes | Submit a check-in |

**`POST /Checkins`**
```json
// Request (CheckinPayload)
{ /* station/QR session data */ }

// Response (CheckinResponse)
{ /* points earned, status, etc. */ }
```

> Check-in history is served by `GET /me/point-transactions` (see User section).

---

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/me/profile` | Yes | Fetch current user profile |
| `POST` | `/me/vehicles/submit` | Yes | Submit vehicle verification |
| `GET` | `/me/vehicles` | Yes | Fetch user's vehicle info |
| `GET` | `/me/point-wallet` | Yes | Fetch point wallet balance |
| `GET` | `/me/point-transactions` | Yes | Fetch point transaction history |
| `POST` | `/me/qr/session` | Yes | Create a QR session token |
| `GET` | `/me/referral-qr` | Yes | Fetch referral QR code string |
| `POST` | `/qr-code/scan` | Yes | Scan another user's QR (check-in referral) |
| `POST` | `/app/referrals/scan` | Yes | Scan a referral code |
| `GET` | `/app/vehicle-types` | Yes | List available vehicle types |

**`GET /me/profile`**
```json
// Response
{ "data": { /* User object */ } }
```

**`POST /me/vehicles/submit`**
```json
// Request (VerifyVehiclePayload)
{
  "vehicleTypeId": "...",
  "licensePlate": "...",
  "photoUrl1": "...",
  "photoUrl2": "... (optional)"
}
```

**`GET /me/point-wallet`**
```json
// Response
{
  "data": {
    "currentBalance": 500,
    "lockedBalance": 0,
    "totalEarned": 1200,
    "totalSpent": 700,
    "greenCoin": 50,
    "vehicleStatus": "Approved",
    "lastEarnedAt": "2024-01-01T00:00:00Z",
    "lastSpentAt": null
  }
}
```

**`POST /me/qr/session`**
```json
// Request
{ "assetId": null | "...", "type": "Checkin" | "Voucher" | "Product" }

// Response
{ "data": { "token": "...", "expiresInSeconds": 300 } }
```

**`POST /qr-code/scan`**
```json
// Request
{ "scannedUserId": "..." }

// Response
{ "points": 10, "totalPoints": 510 }
```

**`POST /app/referrals/scan`**
```json
// Request
{ "referralCode": "REF-XXXXXX" }
```

**`GET /app/vehicle-types`**
```json
// Response
{
  "data": {
    "items": [
      { "id", "code", "name", "description", "isActive", "imageUrl" }
    ]
  }
}
```

---

### Banners

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/app/banners` | **No** | List active banners by placement |

**`GET /app/banners`**

Query params: `placement` (default: `"Home"`)

```json
// Response
{ "data": [/* Banner[] */] }
```

> This endpoint is unauthenticated and uses plain `axios` (not the shared `axiosClient`).

---

### Ranks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/app/ranks` | Yes | List all rank tiers |

```json
// Response
{ "data": { "items": [/* AppRank[] */] } }
```

---

### Location

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/app/location/provinces` | Yes | List all provinces |
| `GET` | `/app/location/wards` | Yes | List wards for a province |

**`GET /app/location/wards`**

Query params: `provinceCode`

---

### Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload/image` | Yes | Upload an image file |

**`POST /upload/image`**

Content-Type: `multipart/form-data`

- Field: `file` — JPEG image (client compresses to max 1280 px, 75% quality before upload)

```json
// Response
{ "url": "https://..." }
```

---

## Common Response Patterns

**Paginated response:**
```ts
{
  success: boolean;
  data: {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    hasNext: boolean;
    // some endpoints also include: totalPages, hasPrevious
  }
}
```

**Error handling:**
- `400` — invalid request (message from server body)
- `401` — unauthorized (triggers token refresh; on failure: redirect to `/register`)
- `403` — forbidden
- `404` — not found
- `500` — server error
- Network timeout / offline: user-facing snackbar notification via `showNotification()`

All API modules return safe defaults (`[]`, `null`, empty objects) on failure rather than throwing, except for `auth.ts` and `checkins.ts` (submit) which propagate errors to callers.

---

## All Endpoints Summary

| Method | Endpoint | Auth | Module |
|--------|----------|------|--------|
| `POST` | `/Auth/zalo-login` | No | auth |
| `POST` | `/auth/refresh` | No | auth |
| `GET` | `/app/feed` | Yes | feed |
| `GET` | `/app/feed?Grouped=true` | Yes | feed |
| `GET` | `/Rewards/{id}` | Yes | vouchers |
| `GET` | `/app/store-items/{id}` | Yes | vouchers |
| `GET` | `/Rewards/my-vouchers` | Yes | vouchers |
| `POST` | `/Rewards/redeem` | Yes | vouchers |
| `GET` | `/app/stores` | Yes | stores |
| `GET` | `/app/stores/{id}` | Yes | stores |
| `GET` | `/stations` | Yes | stations |
| `GET` | `/stations/{id}` | Yes | stations |
| `POST` | `/Checkins` | Yes | checkins |
| `GET` | `/me/profile` | Yes | user |
| `POST` | `/me/vehicles/submit` | Yes | user |
| `GET` | `/me/vehicles` | Yes | user |
| `GET` | `/me/point-wallet` | Yes | user |
| `GET` | `/me/point-transactions` | Yes | user |
| `POST` | `/me/qr/session` | Yes | user |
| `GET` | `/me/referral-qr` | Yes | user |
| `POST` | `/qr-code/scan` | Yes | user |
| `POST` | `/app/referrals/scan` | Yes | user |
| `GET` | `/app/vehicle-types` | Yes | user |
| `GET` | `/app/banners` | **No** | banners |
| `GET` | `/app/ranks` | Yes | ranks |
| `GET` | `/app/location/provinces` | Yes | provinces |
| `GET` | `/app/location/wards` | Yes | wards |
| `POST` | `/upload/image` | Yes | upload |
