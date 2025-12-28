import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import { colors } from '../content/colors';
import { addressService } from '../services/addressService';
import { RootStackParamList } from '../navigation/RootNavigator';

type AddressListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AddressListScreen = () => {
  const navigation = useNavigation<AddressListScreenNavigationProp>();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = async (refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await addressService.getAllAddresses();
      if (response.success) {
        setAddresses(response.data || []);
      } else {
        setError(response.error || 'Failed to load addresses');
      }
    } catch (err: any) {
      setError(err.error || 'Failed to load addresses. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    // Reload addresses when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
    });
    return unsubscribe;
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddAddress = () => {
    // Navigate to AddEditAddress - both screens are in RootNavigator
    navigation.navigate('AddEditAddress', { addressId: undefined });
  };

  const handleEditAddress = (address: any) => {
    // Navigate to AddEditAddress - both screens are in RootNavigator
    navigation.navigate('AddEditAddress', { addressId: address._id });
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await addressService.deleteAddress(addressId);
              loadAddresses();
            } catch (err: any) {
              Alert.alert('Error', err.error || 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await addressService.setDefaultAddress(addressId);
      loadAddresses();
    } catch (err: any) {
      Alert.alert('Error', err.error || 'Failed to set default address');
    }
  };

  const renderAddress = (address: any) => (
    <View key={address._id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <Icon
            name={
              address.addressType === 'Home'
                ? 'home'
                : address.addressType === 'Work'
                ? 'work'
                : 'location-on'
            }
            size={moderateScale(20)}
            color={colors.primary}
          />
          <Text style={styles.addressType}>{address.addressType}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity
            onPress={() => handleEditAddress(address)}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="edit" size={moderateScale(20)} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteAddress(address._id)}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="delete" size={moderateScale(20)} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressContent}>
        <Text style={styles.addressText}>{address.addressLine1}</Text>
        {address.addressLine2 && (
          <Text style={styles.addressText}>{address.addressLine2}</Text>
        )}
        {address.landmark && (
          <Text style={styles.landmarkText}>Near {address.landmark}</Text>
        )}
        <Text style={styles.addressText}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactText}>
            {address.contactName} • {address.contactPhone}
          </Text>
        </View>
      </View>

      {!address.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(address._id)}
        >
          <Text style={styles.setDefaultButtonText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="My Addresses"
        showBack
        onBackPress={handleBackPress}
        rightComponent={
          <TouchableOpacity
            onPress={handleAddAddress}
            style={styles.addButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="add" size={moderateScale(24)} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading addresses...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={moderateScale(48)} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadAddresses()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="location-off" size={moderateScale(64)} color={colors.gray[400]} />
            <Text style={styles.emptyText}>No addresses saved</Text>
            <Text style={styles.emptySubtext}>
              Add your first address to get started
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={handleAddAddress}
            >
              <Text style={styles.addFirstButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => loadAddresses(true)}
                colors={[colors.primary]}
              />
            }
          >
            {addresses.map((address) => renderAddress(address))}
            {addresses.length < 5 && (
              <TouchableOpacity
                style={styles.addNewCard}
                onPress={handleAddAddress}
              >
                <Icon name="add-circle-outline" size={moderateScale(32)} color={colors.primary} />
                <Text style={styles.addNewText}>Add New Address</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
  },
  addButton: {
    padding: scale(4),
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  addressType: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.text,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    marginLeft: scale(8),
  },
  defaultBadgeText: {
    color: colors.white,
    fontSize: moderateScale(10),
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: scale(12),
  },
  actionButton: {
    padding: scale(4),
  },
  addressContent: {
    marginBottom: verticalScale(12),
  },
  addressText: {
    fontSize: moderateScale(14),
    color: colors.text,
    marginBottom: scale(4),
    lineHeight: moderateScale(20),
  },
  landmarkText: {
    fontSize: moderateScale(12),
    color: colors.textSecondary,
    marginBottom: scale(4),
    fontStyle: 'italic',
  },
  contactInfo: {
    marginTop: scale(8),
    paddingTop: scale(8),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contactText: {
    fontSize: moderateScale(13),
    color: colors.textSecondary,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  setDefaultButtonText: {
    fontSize: moderateScale(12),
    color: colors.primary,
    fontWeight: '600',
  },
  addNewCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: scale(24),
    marginBottom: verticalScale(16),
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewText: {
    fontSize: moderateScale(14),
    color: colors.primary,
    fontWeight: '600',
    marginTop: scale(8),
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
  },
  retryButtonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: colors.text,
    marginTop: verticalScale(16),
    marginBottom: scale(8),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  addFirstButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
  },
  addFirstButtonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default AddressListScreen;

