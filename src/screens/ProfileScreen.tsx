import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import Header from '../components/Header';
import { colors } from '../content/colors';
import { RootStackParamList } from '../navigation/RootNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    dispatch(logout());
    // Navigation will be handled by RootNavigator based on auth state
  };

  const handleAddressPress = () => {
    // Navigate to AddressList - both screens are in RootNavigator
    navigation.navigate('AddressList');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Profile" showBack onBackPress={handleBackPress} />
      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Profile</Text>
          {isAuthenticated && user ? (
            <View style={styles.userInfo}>
              <Text style={styles.email}>{user.email}</Text>
              {user.fullName && (
                <Text style={styles.name}>{user.fullName}</Text>
              )}
              {user.phone && (
                <Text style={styles.phone}>{user.phone}</Text>
              )}

              {/* Address Section */}
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleAddressPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconContainer}>
                      <Icon name="location-on" size={moderateScale(24)} color={colors.primary} />
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemTitle}>My Addresses</Text>
                      <Text style={styles.menuItemSubtitle}>Manage your delivery addresses</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={moderateScale(24)} color={colors.gray[400]} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.subtitle}>Please login to view profile</Text>
          )}
        </ScrollView>
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
  contentInner: {
    padding: scale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    color: colors.text,
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: colors.textSecondary,
  },
  userInfo: {
    width: '100%',
  },
  email: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: scale(5),
    color: colors.text,
    textAlign: 'center',
  },
  name: {
    fontSize: moderateScale(16),
    color: colors.textSecondary,
    marginBottom: scale(5),
    textAlign: 'center',
  },
  phone: {
    fontSize: moderateScale(16),
    color: colors.textSecondary,
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  section: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scale(2),
  },
  menuItemSubtitle: {
    fontSize: moderateScale(12),
    color: colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    marginTop: verticalScale(20),
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProfileScreen;

