import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Request permission for push notifications
export const requestUserPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  } else {
    // Android permissions are automatically granted
    return true;
  }
};

// Get FCM token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestUserPermission();
    if (!hasPermission) {
      console.log('Permission not granted for push notifications');
      return null;
    }

    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Setup foreground message handler
export const setupForegroundMessageHandler = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message received:', remoteMessage);
    // Handle foreground notifications here
    // You can show a local notification or update UI
  });
};

// Setup background message handler (must be called outside component)
export const setupBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message received:', remoteMessage);
    // Handle background notifications here
  });
};

// Setup notification opened app handler
export const setupNotificationOpenedHandler = (
  callback: (remoteMessage: any) => void
) => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app:', remoteMessage);
    callback(remoteMessage);
  });

  // Check if app was opened from a quit state
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification opened app from quit state:', remoteMessage);
        callback(remoteMessage);
      }
    });
};

// Delete FCM token (for logout)
export const deleteFCMToken = async (): Promise<void> => {
  try {
    await messaging().deleteToken();
    console.log('FCM token deleted');
  } catch (error) {
    console.error('Error deleting FCM token:', error);
  }
};

