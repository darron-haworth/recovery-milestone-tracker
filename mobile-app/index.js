/**
 * @format
 */

// Import crypto polyfill first to prevent crypto module errors
import './src/utils/crypto-polyfill';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
