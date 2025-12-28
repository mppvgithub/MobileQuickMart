# QuickMart Mobile App Setup Guide

## 📦 Installed Dependencies

### State Management
- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux
- `redux-persist` - Persist Redux state to AsyncStorage

### Navigation
- `@react-navigation/native` - Core navigation library
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `@react-navigation/stack` - Stack navigator
- `react-native-screens` - Native screen components
- `react-native-gesture-handler` - Gesture handling
- `react-native-reanimated` - Animations

### Storage
- `@react-native-async-storage/async-storage` - AsyncStorage for data persistence

### Firebase
- `@react-native-firebase/app` - Firebase core
- `@react-native-firebase/messaging` - Firebase Cloud Messaging (Push Notifications)

## 📁 Project Structure

```
MobileQuickMart/
├── src/
│   ├── components/          # Reusable UI components
│   ├── config/             # Configuration files
│   │   └── firebase.config.example.ts
│   ├── navigation/         # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/          # API and external services
│   │   └── firebase.ts
│   ├── store/             # Redux store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       └── authSlice.ts
│   └── types/             # TypeScript types
│       └── index.ts
├── App.tsx                # Main app component
└── index.js               # Entry point
```

## 🚀 Setup Instructions

### 1. Firebase Setup

#### For Android:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Add Android app with package name: `com.mobilequickmart`
4. Download `google-services.json`
5. Place it in `android/app/google-services.json`
6. Update `android/build.gradle`:
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.4.0'
   }
   ```
7. Update `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

#### For iOS:
1. Add iOS app in Firebase Console
2. Download `GoogleService-Info.plist`
3. Place it in `ios/MobileQuickMart/GoogleService-Info.plist`
4. Run:
   ```bash
   cd ios
   pod install
   cd ..
   ```

### 2. Run the App

#### Android:
```bash
npm run android
```

#### iOS:
```bash
npm run ios
```

## 🔧 Current Features

### ✅ Implemented:
- Redux store with persist storage
- Bottom tab navigation (5 tabs: Home, Categories, Cart, Orders, Profile)
- Firebase push notification setup
- Basic screen structure
- Auth slice in Redux (ready for authentication)

### 📝 Next Steps:
1. Set up Firebase configuration files
2. Implement authentication screens (Login/OTP)
3. Connect to backend API
4. Implement product listing
5. Implement shopping cart
6. Add icons to bottom tabs

## 📱 Bottom Tab Navigation

The app currently has 5 tabs:
1. **Home** - Main screen (placeholder)
2. **Categories** - Browse products by category (placeholder)
3. **Cart** - Shopping cart (placeholder)
4. **Orders** - Order history (placeholder)
5. **Profile** - User profile (placeholder)

## 🔐 Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
    isAuthenticated: boolean,
    isLoading: boolean
  }
}
```

## 🔔 Push Notifications

Firebase Cloud Messaging is set up and ready. The app will:
- Request notification permissions
- Get FCM token on app start
- Handle foreground notifications
- Handle background notifications
- Handle notification taps

**Note:** You need to send the FCM token to your backend to associate it with users.

## 🛠️ Development Notes

- Redux state persists to AsyncStorage automatically
- Auth state is persisted (user stays logged in after app restart)
- Navigation is ready for stack navigation (for login flow, product details, etc.)
- Firebase services are initialized in App.tsx

## 📚 Useful Commands

```bash
# Start Metro bundler
npm start

# Run Android
npm run android

# Run iOS
npm run ios

# Clear Metro cache
npm start -- --reset-cache

# Clear Android build
cd android && ./gradlew clean && cd ..

# Clear iOS build
cd ios && rm -rf build && cd ..
```

