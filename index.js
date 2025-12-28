/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setupBackgroundMessageHandler } from './src/services/firebase';

// Setup Firebase background message handler
setupBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
