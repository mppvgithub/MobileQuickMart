import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmailInputScreen from '../screens/auth/EmailInputScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

export type AuthStackParamList = {
  EmailInput: undefined;
  OTPVerification: { email: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="EmailInput"
    >
      <Stack.Screen name="EmailInput" component={EmailInputScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

