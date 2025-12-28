/**
 * QuickMart Mobile App
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { getFCMToken, setupForegroundMessageHandler, setupNotificationOpenedHandler } from './src/services/firebase';
import { colors } from './src/content/colors';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Setup Firebase push notifications
    const initializeFirebase = async () => {
      // Setup foreground message handler
      setupForegroundMessageHandler();

      // Setup notification opened handler
      setupNotificationOpenedHandler((remoteMessage) => {
        console.log('Notification opened:', remoteMessage);
        // Handle navigation based on notification data
      });

      // Get FCM token
      const token = await getFCMToken();
      if (token) {
        // TODO: Send token to backend to associate with user
        console.log('FCM Token ready:', token);
      }
    };

    initializeFirebase();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar 
            barStyle="dark-content"
            backgroundColor={colors.white}
            translucent={false}
          />
          <AppNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
