# Google Maps API Key Setup Guide

## 📍 Where to Set Your Google Maps API Key

### **Android Setup**

**File:** `android/app/src/main/AndroidManifest.xml`

Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE" />
```

**Location:** Inside the `<application>` tag (already added for you)

---

### **iOS Setup**

**File:** `ios/MobileQuickMart/AppDelegate.swift`

Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```swift
// Initialize Google Maps with API Key
GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_API_KEY_HERE")
```

**Location:** Inside the `didFinishLaunchingWithOptions` function (already added for you)

---

## 🔑 How to Get Your Google Maps API Key

### Step 1: Create/Select a Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### Step 2: Enable Maps SDK

**For Android:**
1. Navigate to **APIs & Services** → **Library**
2. Search for **"Maps SDK for Android"**
3. Click **Enable**

**For iOS:**
1. Navigate to **APIs & Services** → **Library**
2. Search for **"Maps SDK for iOS"**
3. Click **Enable**

### Step 3: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy your API key

### Step 4: Restrict API Key (Recommended)

**For Android:**
1. Click on your API key to edit it
2. Under **Application restrictions**, select **Android apps**
3. Click **Add an item**
4. Enter your package name: `com.mobilequickmart` (or your actual package name)
5. Add your app's SHA-1 certificate fingerprint
   - Get SHA-1: `cd android && ./gradlew signingReport`
   - Look for `SHA1:` in the output
6. Under **API restrictions**, select **Restrict key**
7. Select **Maps SDK for Android**
8. Click **Save**

**For iOS:**
1. Click on your API key to edit it
2. Under **Application restrictions**, select **iOS apps**
3. Click **Add an item**
4. Enter your bundle ID: `com.mobilequickmart` (or your actual bundle ID)
5. Under **API restrictions**, select **Restrict key**
6. Select **Maps SDK for iOS**
7. Click **Save**

---

## 📝 Files Already Updated

✅ **Android:**
- `android/app/src/main/AndroidManifest.xml` - API key meta-data added
- Location permissions added

✅ **iOS:**
- `ios/MobileQuickMart/AppDelegate.swift` - GoogleMaps import and API key initialization added
- `ios/MobileQuickMart/Info.plist` - Location permission descriptions added

---

## 🚀 After Adding API Key

### Android:
1. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `AndroidManifest.xml`
2. Rebuild the app:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

### iOS:
1. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `AppDelegate.swift`
2. Install pods (if not already done):
   ```bash
   cd ios
   pod install
   cd ..
   ```
3. Rebuild the app:
   ```bash
   npm run ios
   ```

---

## ⚠️ Important Notes

1. **Never commit your API key to version control!**
   - Consider using environment variables or a config file that's in `.gitignore`
   - For production, use different API keys for debug and release builds

2. **Billing:** Google Maps requires a billing account (but has a free tier with $200/month credit)

3. **Testing:** You can test with an unrestricted key first, but always restrict it before production

4. **Package Name:** Make sure the package name/bundle ID matches your actual app configuration

---

## 🔍 Verify Setup

After adding your API key, test the map feature:
1. Open the app
2. Go to Profile → My Addresses
3. Tap "Add Address"
4. Tap "Select Location on Map"
5. You should see a map with your current location (if permissions granted)

If you see a blank map or errors, check:
- API key is correct
- Maps SDK is enabled in Google Cloud Console
- Permissions are granted (location)
- App is rebuilt after changes

