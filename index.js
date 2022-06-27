/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import GeoLocation from './src/GeoLocation';
import Device from './src/Device';
import {name as appName} from './app.json';
import {LogBox} from 'react-native';

LogBox.ignoreAllLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => Device);
