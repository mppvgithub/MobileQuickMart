# Address Management Feature Setup

## Overview

Complete address management feature with map location picker, similar to Zepto/Swiggy.

## Features Implemented

### 1. **Address List Screen** (`src/screens/AddressListScreen.tsx`)
- Lists all user addresses
- Shows default address badge
- Edit and delete functionality
- Set default address option
- Add new address button
- Pull-to-refresh support
- Empty state with "Add Address" button

### 2. **Add/Edit Address Screen** (`src/screens/AddEditAddressScreen.tsx`)
- Map location picker (expandable/collapsible)
- Address type selection (Home/Work/Other)
- All address fields:
  - Address Line 1 (required)
  - Address Line 2 (optional)
  - Landmark (optional)
  - City (required)
  - State (required)
  - Pincode (required, 6 digits)
  - Contact Name (required)
  - Contact Phone (required, 10 digits)
  - Set as default toggle
- Map marker can be dragged
- Tap on map to set location
- Form validation

### 3. **Profile Screen Updates**
- Added "My Addresses" menu item
- Navigates to Address List screen
- Clean UI with icon and description

### 4. **Address Service** (`src/services/addressService.ts`)
- `getAllAddresses()` - Get all addresses
- `getAddressById(id)` - Get single address
- `createAddress(data)` - Create new address
- `updateAddress(id, data)` - Update address
- `deleteAddress(id)` - Delete address
- `setDefaultAddress(id)` - Set default address

## API Endpoints Used

All endpoints require authentication (Bearer token):

- `GET /api/addresses` - Get all addresses
- `GET /api/addresses/:id` - Get address by ID
- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PUT /api/addresses/:id/set-default` - Set default address

## Address Fields

**Required:**
- `addressLine1` - Street address / Building name
- `city` - City name
- `state` - State name
- `pincode` - 6-digit pincode
- `contactName` - Name for delivery
- `contactPhone` - Phone number for delivery

**Optional:**
- `addressLine2` - Apartment/Flat number
- `landmark` - Nearby landmark
- `addressType` - Home, Work, or Other (default: Home)
- `latitude` - Latitude coordinate
- `longitude` - Longitude coordinate
- `isDefault` - Default address flag

## Map Setup

### Android Setup

1. **Get Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select a project
   - Enable "Maps SDK for Android"
   - Create API key
   - Restrict API key to Android apps

2. **Add API Key to AndroidManifest.xml:**
   ```xml
   <application>
     <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
   </application>
   ```

### iOS Setup

1. **Get Google Maps API Key:**
   - Enable "Maps SDK for iOS" in Google Cloud Console
   - Create API key
   - Restrict API key to iOS apps

2. **Add API Key to AppDelegate.swift:**
   ```swift
   import GoogleMaps
   
   func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
     GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_API_KEY")
     // ... rest of code
   }
   ```

3. **Update Podfile:**
   ```ruby
   pod 'react-native-maps', :path => '../node_modules/react-native-maps'
   ```

4. **Run pod install:**
   ```bash
   cd ios && pod install
   ```

## Navigation Flow

```
Profile Screen
  ↓ (Tap "My Addresses")
Address List Screen
  ↓ (Tap "Add" or "Add New Address")
Add/Edit Address Screen
  ↓ (Fill form, select map location, Save)
Address List Screen (refreshed)
```

## Usage

1. **View Addresses:**
   - Go to Profile → Tap "My Addresses"
   - See all saved addresses
   - Default address is marked with badge

2. **Add Address:**
   - Tap "+" button or "Add New Address"
   - Fill in address details
   - Optionally select location on map
   - Toggle "Set as default" if needed
   - Tap "Save"

3. **Edit Address:**
   - Tap edit icon on address card
   - Modify details
   - Tap "Save"

4. **Delete Address:**
   - Tap delete icon on address card
   - Confirm deletion

5. **Set Default Address:**
   - Tap "Set as Default" button on non-default address
   - Or toggle "Set as default" when creating/editing

## Notes

- Maximum 5 addresses per user (enforced by backend)
- Map location is optional but recommended
- Pincode must be 6 digits
- Contact phone must be 10 digits
- Default address is shown first in the list

## Testing

1. Create an address without map location
2. Create an address with map location
3. Edit an address
4. Set default address
5. Delete an address
6. Verify maximum 5 addresses limit

