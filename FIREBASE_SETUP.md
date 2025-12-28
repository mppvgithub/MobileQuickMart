# Firebase Setup Instructions

## ✅ Configuration Added

Firebase configuration has been added to the project with your credentials:
- **Project ID**: musu-food
- **API Key**: AIzaSyCS9sn6Szm5MZHeKTjwN52mxSTYhNKmRmU
- **Messaging Sender ID**: 937547096615

## 📱 Native Configuration Files

### Android (`android/app/google-services.json`)
✅ Created with your Firebase config
⚠️ **Action Required**: You need to download the actual `google-services.json` from Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **musu-food**
3. Go to **Project Settings** > **Your apps**
4. Click on Android app (or add one with package name: `com.mobilequickmart`)
5. Download `google-services.json`
6. Replace the file at `android/app/google-services.json`

### iOS (`ios/MobileQuickMart/GoogleService-Info.plist`)
✅ Created with your Firebase config
⚠️ **Action Required**: You need to download the actual `GoogleService-Info.plist` from Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **musu-food**
3. Go to **Project Settings** > **Your apps**
4. Click on iOS app (or add one with bundle ID: `com.mobilequickmart`)
5. Download `GoogleService-Info.plist`
6. Replace the file at `ios/MobileQuickMart/GoogleService-Info.plist`

## 🔧 Android Setup

1. **Update `android/build.gradle`** (if not already done):
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

2. **Update `android/app/build.gradle`**:
```gradle
apply plugin: 'com.google.gms.google-services'
```

3. **Sync Gradle**:
```bash
cd android
./gradlew clean
```

## 🍎 iOS Setup

1. **Install Pods**:
```bash
cd ios
pod install
cd ..
```

2. **Verify `GoogleService-Info.plist` is added to Xcode**:
   - Open `ios/MobileQuickMart.xcworkspace` in Xcode
   - Ensure `GoogleService-Info.plist` is in the project navigator
   - If not, drag and drop it into the project

## ✅ Verification

After adding the native config files:

1. **Android**: Build should work without errors
2. **iOS**: Pod install should complete successfully
3. **Test**: Run the app and check console for FCM token

## 📝 Current Status

- ✅ Firebase config file created (`src/config/firebase.config.ts`)
- ✅ Firebase service updated (`src/services/firebase.ts`)
- ✅ Android `google-services.json` template created
- ✅ iOS `GoogleService-Info.plist` template created
- ⚠️ **Need**: Download actual config files from Firebase Console

## 🚀 Next Steps

1. Download actual `google-services.json` and `GoogleService-Info.plist` from Firebase Console
2. Replace the template files
3. Run `cd ios && pod install` for iOS
4. Build and test the app

## 📚 Firebase Services Enabled

Currently configured for:
- ✅ Firebase Cloud Messaging (Push Notifications)
- ✅ Firebase Analytics (if needed)

To add more services (Auth, Firestore, Storage, etc.):
1. Install the respective package: `npm install @react-native-firebase/auth`
2. The native config files already support all Firebase services

