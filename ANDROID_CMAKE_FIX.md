# Android CMake Configuration Fix for react-native-worklets-core

## Issue
```
Task :react-native-worklets-core:configureCMakeDebug[arm64-v8a] FAILED
```

## Solution Steps

### 1. Verify CMake is Installed
CMake should be installed via Android Studio SDK Manager. Check if it exists:
```bash
ls ~/Library/Android/sdk/cmake
```

If CMake is not installed:
- Open Android Studio
- Go to **Tools > SDK Manager**
- Under **SDK Tools** tab, check **CMake** and **NDK**
- Click **Apply** to install

### 2. Clean Build Cache
```bash
cd android
./gradlew clean
rm -rf .gradle build app/build
rm -rf node_modules/react-native-worklets-core/android/.cxx
```

### 3. Verify NDK Version
Ensure NDK version matches in `android/build.gradle`:
```gradle
ndkVersion = "27.1.12297006"  // Should match installed NDK
```

### 4. Check CMake Version
React Native Worklets Core requires CMake 3.8+. Verify you have a compatible version:
```bash
~/Library/Android/sdk/cmake/3.31.0/bin/cmake --version
```

### 5. Set Environment Variable (if needed)
If Android Gradle Plugin can't find CMake automatically, set it:
```bash
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/27.1.12297006
export PATH=$PATH:$ANDROID_HOME/cmake/3.31.0/bin
```

### 6. Rebuild
```bash
cd android
./gradlew clean
./gradlew :app:assembleDebug
```

## Alternative: Disable Worklets (if not immediately needed)

If you're not using react-native-reanimated features that require worklets immediately, you can temporarily remove it:

1. Remove from `package.json`:
```bash
npm uninstall react-native-reanimated react-native-worklets-core
```

2. Remove from `babel.config.js`:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // plugins: [
  //   'react-native-reanimated/plugin', // Comment out
  // ],
};
```

3. Clean and rebuild:
```bash
cd android && ./gradlew clean
```

## Common Issues

### Issue: CMake not found
**Solution**: Install CMake via Android Studio SDK Manager

### Issue: NDK version mismatch
**Solution**: Update `ndkVersion` in `android/build.gradle` to match installed version

### Issue: Build cache corruption
**Solution**: Clean all build artifacts and rebuild

### Issue: Architecture-specific build failure
**Solution**: Try building for specific architecture:
```bash
./gradlew :app:assembleDebug -PreactNativeArchitectures=arm64-v8a
```

## Verification

After applying fixes, verify the build works:
```bash
cd android
./gradlew :react-native-worklets-core:configureCMakeDebug
```

If successful, you should see CMake configuration output without errors.

