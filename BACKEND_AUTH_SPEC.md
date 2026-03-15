# Backend Authentication Specification
## Ecogreen Coin Zalo Mini App - Secure OAuth2 Flow

---

## 🔒 Security Flow

```
FRONTEND                          BACKEND                     ZALO SERVERS
   |                                |                              |
   |-- 1. User opens Mini App ------|                              |
   |                                |                              |
   |-- 2. getUserInfo()             |                              |
   |     (Zalo SDK prompt)          |                              |
   |     ✅ Gets: userInfo          |                              |
   |     ✅ Gets: accessToken       |                              |
   |                                |                              |
   |-- 3. POST /auth/zalo-miniapp --|                              |
   |     payload: {                 |                              |
   |       zaloAccessToken,         |                              |
   |       zaloId,                  |-- 4. Verify token on -------|
   |       displayName,             |     Zalo API servers        |
   |       avatar                   |                              |
   |     }                          |<-- ✅ Returns userId --------|
   |                                |     (if token valid)        |
   |                                |                              |
   |                                |-- 5. Check DB: User exists?  |
   |                                |     If NO: Create account    |
   |                                |     Map: zaloId -> userId   |
   |                                |                              |
   |                                |-- 6. Generate JWT session   |
   |                                |     (accessToken + refresh) |
   |<-- Response: {               |                              |
   |    user: BackendUser,          |                              |
   |    tokens: JwtTokens           |                              |
   |  }                             |                              |
   |                                |                              |
   |-- 7. Save JWT tokens to LS ----|                              |
   |-- 8. Store user in Zustand ----|                              |
   |-- 9. Show protected routes ----|                              |
```

---

## 📋 Required Backend Endpoints

### 1. POST `/auth/zalo-miniapp` - OAuth Login & Auto-Create
**Purpose:** Verify Zalo access token, create user if new, return JWT session

**Request:**
```json
{
  "zaloAccessToken": "string (from Zalo SDK)",
  "zaloId": "string (user.id from Zalo SDK)",
  "displayName": "string (user.name)",
  "avatar": "string (user.avatar URL)"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string (your DB user ID)",
    "zaloId": "string (Zalo ID)",
    "displayName": "string",
    "avatar": "string"
  },
  "tokens": {
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT)",
    "expiresIn": 3600
  }
}
```

**Error Response (400/401):**
```json
{
  "error": "Invalid Zalo token" | "Token verification failed"
}
```

**Implementation Steps:**
1. Extract `zaloAccessToken` from request
2. Call Zalo API to verify token:
   ```
   GET https://identity.zalopay.vn/api/accounts/me
   Header: Authorization: Bearer {zaloAccessToken}
   ```
   ⚠️ **CRITICAL:** This prevents token spoofing attacks
3. Extract `zaloId` from Zalo API response (validates token is real)
4. Check if user exists in DB by `zaloId`:
   - **If exists:** Skip to step 6
   - **If not exists:** Create new user with:
     - `zaloId` (from verified Zalo response)
     - `displayName` (from request)
     - `avatar` (from request)
     - `createdAt` (current timestamp)
     - `lastLogin` (current timestamp)
5. Update user `lastLogin` timestamp
6. Generate JWT tokens:
   - `accessToken`: 1 hour expiry, includes userId
   - `refreshToken`: 30 days expiry, includes userId + refresh claim
7. Return user + tokens

---

### 2. POST `/auth/refresh` - Token Refresh
**Purpose:** Refresh expired access token using refresh token

**Request:**
```json
{
  "refreshToken": "string (JWT)"
}
```

**Response (200 OK):**
```json
{
  "tokens": {
    "accessToken": "string (new JWT)",
    "refreshToken": "string (new JWT or same)",
    "expiresIn": 3600
  }
}
```

**Error Response (401/403):**
```json
{
  "error": "Invalid refresh token" | "Token expired"
}
```

**Implementation Steps:**
1. Validate `refreshToken` JWT:
   - Check signature
   - Check expiry
   - Verify refresh claim exists
2. Extract `userId` from token
3. Get user from DB (verify still exists)
4. Generate new `accessToken` (1 hour)
5. Optionally rotate `refreshToken` (30 days)
6. Return new tokens

---

### 3. GET `/auth/me` - Get Current User
**Purpose:** Fetch authenticated user info using JWT

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "zaloId": "string",
    "displayName": "string",
    "avatar": "string"
  }
}
```

**Error Response (401/403):**
```json
{
  "error": "Unauthorized" | "Invalid token"
}
```

**Implementation Steps:**
1. Extract JWT from Authorization header
2. Validate JWT signature and expiry
3. Extract `userId` from token
4. Get user from DB
5. Return user info

---

## 🛡️ Security Checklist

- ✅ **Always verify Zalo token on backend** - Never trust frontend claims
- ✅ **Use HTTPS only** - All API calls must be encrypted
- ✅ **JWT signature validation** - Verify token hasn't been tampered
- ✅ **Token expiry checks** - Access tokens short-lived (1h), refresh tokens longer (30d)
- ✅ **Rate limiting** - Prevent brute force on `/auth/zalo-miniapp`
- ✅ **CORS properly configured** - Only allow Mini App origin
- ✅ **Secure refresh tokens** - Store separately, rotate if compromised
- ✅ **User ID immutability** - Never allow zaloId to change once created

---

## 🔄 Frontend-Backend Interaction

### First Login Flow
```
Frontend                          Backend
  |                                 |
  |-- POST /auth/zalo-miniapp ------|
  |     (zaloAccessToken)           |
  |                                 |-- Verify with Zalo
  |                                 |-- Create user in DB
  |                                 |-- Generate JWT
  |<-- Return JWT + user data ------|
  |                                 |
  |-- Save to localStorage          |
  |-- Auto-login works ✅
```

### Token Expiry (Auto-Refresh)
```
Frontend (30s timer)              Backend
  |                                 |
  |-- Check if refresh needed       |
  |-- POST /auth/refresh ------------|
  |     (refreshToken)              |
  |                                 |-- Validate refresh token
  |                                 |-- Generate new access token
  |<-- Return new JWT --------------|
  |                                 |
  |-- Update localStorage           |
  |-- Continue using app ✅
```

### API Error (401 Caught)
```
Frontend                          Backend
  |                                 |
  |-- GET /api/orders --------------|
  |     (old accessToken)           |
  |                                 |-- Token expired
  |<-- 401 Unauthorized ------------|
  |                                 |
  |-- POST /auth/refresh ------------|
  |     (refreshToken)              |
  |                                 |-- Generate new token
  |<-- Return new JWT --------------|
  |                                 |
  |-- Retry GET /api/orders --------|
  |     (new accessToken)           |
  |<-- 200 OK ✅ ------------------|
```

---

## 📊 Database Schema (Suggested)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  zalo_id VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login TIMESTAMP
);

-- Refresh tokens (optional, for token invalidation)
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR(1000) NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  revoked BOOLEAN DEFAULT false
);
```

---

## ⚠️ Common Pitfalls to Avoid

1. **❌ NOT verifying Zalo token** - Frontend can forge tokens
   → **✅ Always verify with Zalo API**

2. **❌ Storing passwords** - Zalo auth is passwordless
   → **✅ Only store zaloId mapping**

3. **❌ Long-lived access tokens** - Increases compromise risk
   → **✅ Use 1-hour expiry for access tokens**

4. **❌ Same secret for all tokens** - If compromised, both fail
   → **✅ Use separate refresh token secrets**

5. **❌ No token validation on API endpoints** - Unauthenticated access
   → **✅ Validate JWT on every protected endpoint**

---

## 🧪 Testing Your Backend

```bash
# 1. Test login with valid Zalo token
curl -X POST http://localhost:3000/auth/zalo-miniapp \
  -H "Content-Type: application/json" \
  -d '{
    "zaloAccessToken": "REAL_ZALO_TOKEN",
    "zaloId": "123456789",
    "displayName": "John Doe",
    "avatar": "https://..."
  }'

# 2. Test refresh endpoint
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "JWT_REFRESH_TOKEN"}'

# 3. Test /auth/me endpoint
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer JWT_ACCESS_TOKEN"
```

---

## 📝 Frontend Implementation Details

### Where Access Token is Captured
- **File:** `src/stores/user.ts`
- **Function:** `loadZaloUser()`
- **Source:** `getUserInfo()` from Zalo SDK
- **Stored in:** `zaloAccessToken` state

### Where Token is Sent to Backend
- **File:** `src/apis/authorization/service.ts`
- **Function:** `loginWithZaloUser(userInfo, zaloAccessToken)`
- **Payload:** Includes `zaloAccessToken` field
- **Endpoint:** `POST /auth/zalo-miniapp`

### Token Refresh Mechanism
- **File:** `src/apis/authorization/service.ts`
- **Function:** `refreshTokens()`
- **Trigger:** Every 30 seconds (periodic) + on 401 (reactive)
- **Endpoint:** `POST /auth/refresh`

---

## 🚀 Ready for Implementation?

Your frontend is now ready. Implement these 3 endpoints on your backend and everything will work automatically:

1. ✅ `POST /auth/zalo-miniapp` - Login with Zalo token verification
2. ✅ `POST /auth/refresh` - Refresh access token
3. ✅ `GET /auth/me` - Get current user

Good luck! 🎉
