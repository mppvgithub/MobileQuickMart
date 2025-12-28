import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import ProductListScreen from '../screens/ProductListScreen';
import SearchScreen from '../screens/SearchScreen';
import AddressListScreen from '../screens/AddressListScreen';
import AddEditAddressScreen from '../screens/AddEditAddressScreen';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainTabs: undefined;
  Profile: undefined;
  ProductList: { category: string };
  Search: undefined;
  AddressList: undefined;
  AddEditAddress: { addressId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Show splash while loading
  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="ProductList"
            component={ProductListScreen}
            options={{
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="AddressList"
            component={AddressListScreen}
            options={{
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="AddEditAddress"
            component={AddEditAddressScreen}
            options={{
              presentation: 'card',
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;

