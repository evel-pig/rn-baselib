
import { NativeModules, Platform } from 'react-native';
const { RNBaselib } = NativeModules;

let Baselib = {
  checkPhotoPermission(callback) {
    if (RNBaselib.checkPhotoPermission) {
      RNBaselib.checkPhotoPermission(callback);
    }
  },

  checkCameraPermission(callback) {
    if (RNBaselib.checkCameraPermission) {
      RNBaselib.checkCameraPermission(callback);
    }
  },

  checkLocationPermission(callback, type) {
    if (RNBaselib.checkLocationPermission) {
      if (Platform.OS === 'ios') {
        let t = (type && typeof type === 'string' && type === 'always') ? 2 : 1;
        RNBaselib.checkLocationPermission(t, callback);
      } else {
        RNBaselib.checkLocationPermission(callback);
      }
    }
  },

  checkContactsPermission(callback) {
    if (RNBaselib.checkContactsPermission) {
      RNBaselib.checkContactsPermission(callback);
    }
  },

  checkNotificationPermission(callback) {
    if (RNBaselib.checkNotificationPermission) {
      RNBaselib.checkNotificationPermission(callback);
    }
  },

  checkSMSPermission(callback) {
    if (RNBaselib.checkSMSPermission) {
      if (Platform.OS === 'android') {
        RNBaselib.checkSMSPermission(callback);
      } else {
        console.warn('checkSMSPermission 函数只支持 android 平台');
      }
    }
  },

  checkPhonePermission(callback) {
    if (RNBaselib.checkPhonePermission) {
      if (Platform.OS === 'android') {
        RNBaselib.checkPhonePermission(callback);
      } else {
        console.warn('checkPhonePermission 函数只支持 android 平台');
      }
    }
  },
}

export default Baselib;
