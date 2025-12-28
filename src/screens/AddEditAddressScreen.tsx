import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker } from 'react-native-maps';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import { colors } from '../content/colors';
import { addressService } from '../services/addressService';
import { RootStackParamList } from '../navigation/RootNavigator';

type AddEditAddressScreenRouteProp = RouteProp<RootStackParamList, 'AddEditAddress'>;
type AddEditAddressScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditAddress'>;

const AddEditAddressScreen = () => {
  const navigation = useNavigation<AddEditAddressScreenNavigationProp>();
  const route = useRoute<AddEditAddressScreenRouteProp>();
  const { addressId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(!!addressId);
  const [showMap, setShowMap] = useState(false);

  // Form fields
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isDefault, setIsDefault] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    contactName?: string;
    contactPhone?: string;
  }>({});

  // Map region
  const [region, setRegion] = useState({
    latitude: 19.0760, // Default to Mumbai
    longitude: 72.8777,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (addressId) {
      loadAddress();
    } else {
      // Get current location for new address
      getCurrentLocation();
    }
  }, [addressId]);

  const getCurrentLocation = async () => {
    try {
      // For now, use default location
      // In production, use Geolocation API
      setRegion({
        latitude: 19.0760,
        longitude: 72.8777,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLatitude(19.0760);
      setLongitude(72.8777);
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const loadAddress = async () => {
    if (!addressId) return;

    try {
      setIsLoadingAddress(true);
      const response = await addressService.getAddressById(addressId);
      if (response.success && response.data) {
        const addr = response.data;
        setAddressLine1(addr.addressLine1 || '');
        setAddressLine2(addr.addressLine2 || '');
        setLandmark(addr.landmark || '');
        setCity(addr.city || '');
        setState(addr.state || '');
        setPincode(addr.pincode || '');
        setAddressType(addr.addressType || 'Home');
        setContactName(addr.contactName || '');
        setContactPhone(addr.contactPhone || '');
        setLatitude(addr.latitude);
        setLongitude(addr.longitude);
        setIsDefault(addr.isDefault || false);

        if (addr.latitude && addr.longitude) {
          setRegion({
            latitude: addr.latitude,
            longitude: addr.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    } catch (err: any) {
      Alert.alert('Error', err.error || 'Failed to load address');
      navigation.goBack();
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    setLatitude(lat);
    setLongitude(lng);
    setRegion({
      ...region,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleSave = async () => {
    // Validation
    const newErrors: typeof errors = {};
    let hasErrors = false;

    if (!addressLine1.trim()) {
      newErrors.addressLine1 = 'Please enter address line 1';
      hasErrors = true;
    }
    if (!city.trim()) {
      newErrors.city = 'Please enter city';
      hasErrors = true;
    }
    if (!state.trim()) {
      newErrors.state = 'Please enter state';
      hasErrors = true;
    }
    if (!pincode.trim() || !/^\d{6}$/.test(pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
      hasErrors = true;
    }
    if (!contactName.trim()) {
      newErrors.contactName = 'Please enter contact name';
      hasErrors = true;
    }
    if (!contactPhone.trim() || contactPhone.length < 10) {
      newErrors.contactPhone = 'Please enter a valid 10-digit phone number';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    setIsLoading(true);
    try {
      const addressData = {
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        addressType,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        latitude,
        longitude,
        isDefault,
      };

      if (addressId) {
        await addressService.updateAddress(addressId, addressData);
        Alert.alert('Success', 'Address updated successfully');
      } else {
        await addressService.createAddress(addressData);
        Alert.alert('Success', 'Address added successfully');
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.error || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (isLoadingAddress) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={addressId ? 'Edit Address' : 'Add Address'} showBack onBackPress={handleBackPress} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading address...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={addressId ? 'Edit Address' : 'Add Address'}
        showBack
        onBackPress={handleBackPress}
        rightComponent={
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            style={styles.saveButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        }
      />
      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Map Section */}
            <View style={styles.mapSection}>
              <TouchableOpacity
                style={styles.mapToggle}
                onPress={() => setShowMap(!showMap)}
              >
                <Icon
                  name={showMap ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={moderateScale(24)}
                  color={colors.text}
                />
                <Text style={styles.mapToggleText}>
                  {showMap ? 'Hide Map' : 'Select Location on Map'}
                </Text>
              </TouchableOpacity>
              {showMap && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    region={region}
                    onPress={handleMapPress}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                  >
                    {latitude && longitude && (
                      <Marker
                        coordinate={{ latitude, longitude }}
                        draggable
                        onDragEnd={(e) => {
                          const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
                          setLatitude(lat);
                          setLongitude(lng);
                        }}
                      />
                    )}
                  </MapView>
                </View>
              )}
            </View>

            {/* Address Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address Type</Text>
              <View style={styles.typeContainer}>
                {(['Home', 'Work', 'Other'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      addressType === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setAddressType(type)}
                  >
                    <Icon
                      name={
                        type === 'Home'
                          ? 'home'
                          : type === 'Work'
                          ? 'work'
                          : 'location-on'
                      }
                      size={moderateScale(20)}
                      color={addressType === type ? colors.white : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        addressType === type && styles.typeButtonTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Address Fields */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address Details</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.addressLine1 && styles.inputError,
                  ]}
                  placeholder="Address Line 1 *"
                  placeholderTextColor={colors.gray[500]}
                  value={addressLine1}
                  onChangeText={(text) => {
                    setAddressLine1(text);
                    if (errors.addressLine1) {
                      setErrors({ ...errors, addressLine1: undefined });
                    }
                  }}
                />
                {errors.addressLine1 && (
                  <Text style={styles.errorText}>{errors.addressLine1}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Address Line 2 (Optional)"
                  placeholderTextColor={colors.gray[500]}
                  value={addressLine2}
                  onChangeText={setAddressLine2}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Landmark (Optional)"
                  placeholderTextColor={colors.gray[500]}
                  value={landmark}
                  onChangeText={setLandmark}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.halfInputContainer, styles.inputContainer]}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.halfInput,
                      errors.city && styles.inputError,
                    ]}
                    placeholder="City *"
                    placeholderTextColor={colors.gray[500]}
                    value={city}
                    onChangeText={(text) => {
                      setCity(text);
                      if (errors.city) {
                        setErrors({ ...errors, city: undefined });
                      }
                    }}
                  />
                  {errors.city && (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  )}
                </View>
                <View style={[styles.halfInputContainer, styles.inputContainer]}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.halfInput,
                      errors.state && styles.inputError,
                    ]}
                    placeholder="State *"
                    placeholderTextColor={colors.gray[500]}
                    value={state}
                    onChangeText={(text) => {
                      setState(text);
                      if (errors.state) {
                        setErrors({ ...errors, state: undefined });
                      }
                    }}
                  />
                  {errors.state && (
                    <Text style={styles.errorText}>{errors.state}</Text>
                  )}
                </View>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.pincode && styles.inputError,
                  ]}
                  placeholder="Pincode *"
                  placeholderTextColor={colors.gray[500]}
                  value={pincode}
                  onChangeText={(text) => {
                    // Only allow numbers and max 6 digits
                    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
                    setPincode(numericText);
                    if (errors.pincode) {
                      setErrors({ ...errors, pincode: undefined });
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {errors.pincode && (
                  <Text style={styles.errorText}>{errors.pincode}</Text>
                )}
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.contactName && styles.inputError,
                  ]}
                  placeholder="Contact Name *"
                  placeholderTextColor={colors.gray[500]}
                  value={contactName}
                  onChangeText={(text) => {
                    setContactName(text);
                    if (errors.contactName) {
                      setErrors({ ...errors, contactName: undefined });
                    }
                  }}
                />
                {errors.contactName && (
                  <Text style={styles.errorText}>{errors.contactName}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.contactPhone && styles.inputError,
                  ]}
                  placeholder="Contact Phone *"
                  placeholderTextColor={colors.gray[500]}
                  value={contactPhone}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
                    setContactPhone(numericText);
                    if (errors.contactPhone) {
                      setErrors({ ...errors, contactPhone: undefined });
                    }
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.contactPhone && (
                  <Text style={styles.errorText}>{errors.contactPhone}</Text>
                )}
              </View>
            </View>

            {/* Default Address Toggle */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsDefault(!isDefault)}
              >
                <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                  {isDefault && (
                    <Icon name="check" size={moderateScale(16)} color={colors.white} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Set as default address</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
  },
  saveButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.primary,
  },
  mapSection: {
    marginBottom: verticalScale(20),
  },
  mapToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: verticalScale(12),
  },
  mapToggleText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.text,
    marginLeft: scale(8),
  },
  mapContainer: {
    height: moderateScale(200),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.text,
    marginBottom: verticalScale(12),
  },
  typeContainer: {
    flexDirection: 'row',
    gap: scale(12),
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: scale(6),
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  inputContainer: {
    marginBottom: verticalScale(12),
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(14),
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  row: {
    flexDirection: 'row',
    gap: scale(12),
  },
  halfInputContainer: {
    flex: 1,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    fontSize: moderateScale(12),
    color: colors.error,
    marginTop: scale(4),
    marginLeft: scale(4),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  checkbox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(4),
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: moderateScale(14),
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(14),
    color: colors.textSecondary,
  },
});

export default AddEditAddressScreen;

