# Authentication Setup Guide

## Overview

The app implements Zepto-style email-first authentication with OTP verification. Users enter their email, receive an OTP, and are automatically registered/logged in upon verification.

## Architecture

### 1. **API Configuration** (`src/config/api.ts`)
- Base URL configured for development (localhost) and production
- Android emulator uses `10.0.2.2:3000` for localhost
- iOS simulator uses `localhost:3000`

### 2. **Token Storage** (`src/utils/tokenStorage.ts`)
- Secure token storage using AsyncStorage
- Stores access token and refresh token separately
- Provides methods to save, retrieve, and clear tokens

### 3. **Axios Setup** (`src/services/api.ts`)
- Configured axios instance with interceptors
- **Request Interceptor**: Automatically adds Bearer token to all requests
- **Response Interceptor**: Handles 401 errors (token expired/invalid)
- Base URL and timeout configured

### 4. **Auth Service** (`src/services/authService.ts`)
- `requestOTP(email)`: Sends OTP to user's email
- `verifyOTP(email, otp)`: Verifies OTP and returns user data + tokens

### 5. **Redux Auth Slice** (`src/store/slices/authSlice.ts`)
- Manages authentication state
- `loadStoredTokens`: Async thunk to load tokens on app start
- `setCredentials`: Saves user data and tokens (also saves to storage)
- `logout`: Clears all auth data and tokens

## Navigation Flow

```
App Start
  ↓
Splash Screen (checks stored tokens)
  ↓
┌─────────────────┬─────────────────┐
│  Authenticated  │  Not Authenticated│
│       ↓         │        ↓         │
│   MainTabs     │   Auth Stack     │
│   (Home, etc)   │   (Email → OTP)  │
└─────────────────┴─────────────────┘
```

### RootNavigator Logic:
1. **Loading State**: Shows Splash screen while checking stored tokens
2. **Authenticated**: Shows MainTabs (Home, Categories, Cart, Orders)
3. **Not Authenticated**: Shows AuthNavigator (Email → OTP)

## Screens

### 1. **SplashScreen** (`src/screens/SplashScreen.tsx`)
- Shows app logo and loading indicator
- Dispatches `loadStoredTokens` on mount
- Automatically navigates based on auth state

### 2. **EmailInputScreen** (`src/screens/auth/EmailInputScreen.tsx`)
- User enters email address
- Validates email format
- Calls `authService.requestOTP()`
- Navigates to OTP verification on success

### 3. **OTPVerificationScreen** (`src/screens/auth/OTPVerificationScreen.tsx`)
- 6-digit OTP input with auto-focus
- Supports paste functionality
- Calls `authService.verifyOTP()`
- On success: Saves credentials to Redux and storage
- Resend OTP functionality

## API Endpoints

### Request OTP
```
POST /api/users/request-otp
Body: { "email": "user@example.com" }
```

### Verify OTP
```
POST /api/users/verify-otp
Body: { "email": "user@example.com", "otp": "123456" }
Response: {
  success: true,
  data: {
    user: { ... },
    tokens: {
      accessToken: "...",
      refreshToken: "..."
    },
    isNewUser: boolean
  }
}
```

## Token Management

### Storage
- Tokens stored securely in AsyncStorage
- Keys: `@QuickMart:accessToken`, `@QuickMart:refreshToken`
- Automatically persisted via Redux Persist

### Usage
- Axios automatically adds token to all requests via interceptor
- Token format: `Authorization: Bearer <token>`
- On 401 error: Tokens are cleared and user redirected to login

## Security Features

1. **Secure Storage**: Tokens stored in AsyncStorage (encrypted on iOS Keychain when available)
2. **Automatic Token Injection**: All API requests automatically include token
3. **Token Refresh Handling**: Ready for refresh token implementation
4. **Auto Logout**: Clears tokens on 401 errors

## Testing

### Development Setup
1. Start backend server: `cd ExpressQuickMart && npm start`
2. Backend should run on `http://localhost:3000`
3. For Android emulator, backend accessible at `http://10.0.2.2:3000`
4. For iOS simulator, backend accessible at `http://localhost:3000`

### Test Flow
1. Open app → Splash screen appears
2. Enter email → OTP sent
3. Enter OTP → User logged in
4. Navigate to Profile → See user info
5. Logout → Returns to auth screen

## Next Steps

- [ ] Implement refresh token endpoint
- [ ] Add token refresh logic in axios interceptor
- [ ] Add user profile completion flow
- [ ] Add error handling for network issues
- [ ] Add loading states for better UX

