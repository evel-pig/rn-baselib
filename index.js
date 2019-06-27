
import { NativeModules, Platform } from 'react-native';
const { RNBaselib } = NativeModules;

let Baselib = {
  // ---------------------------------- permission ----------------------------------
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

  toPermissionSettingCenter() {
    if (RNBaselib.toPermissionSettingCenter) {
      RNBaselib.toPermissionSettingCenter();
    }
  },

  toNotificationSetting() {
    if (Platform.OS === 'android') {
      if (RNBaselib.toNotificationSetting) {
        RNBaselib.toNotificationSetting();
      }
    } else {
      this.toPermissionSettingCenter();
    }
  },

  // ---------------------------------- device info ----------------------------------
  manufacturer: Platform.OS === 'ios' ? 'Apple' : RNBaselib.manufacturer,
  model: Platform.OS === 'ios' ? RNBaselib.model : 'Android',
  imei: Platform.OS === 'ios' ? '' : RNBaselib.imei,
  systemVersion: RNBaselib.systemVersion,
  number: Platform.OS === 'ios' ? '' : RNBaselib.number,
  serial: Platform.OS === 'ios' ? '' : RNBaselib.serial,
  mcc: RNBaselib.mcc,
  mnc: RNBaselib.mnc,
  source: Platform.OS === 'ios' ? 'Appstore' : RNBaselib.source,
  deviceName: RNBaselib.deviceName,
  // appName: RNBaselib.appName,
  bundleId: RNBaselib.bundleId,
  versionName: RNBaselib.versionName,
  versionCode: RNBaselib.versionCode,
  isDeviceRooted: false,
  isSimulator: false,
  uuid: '',
  idfa: '',
  macAddress: '',
  ipAddress: '',
  deviceModel: Platform.imei == 'ios' ? '' : RNBaselib.deviceModel,
  deviceLocale: '',

  checkDeviceRooted(callback) {
    if (Platform.OS === 'android') {
      if (RNBaselib.checkDeviceRooted) {
        RNBaselib.checkDeviceRooted((result) => {
          this.isDeviceRooted = result;
          if (callback) callback(result);
        });
      }
    } else {
      console.warn('checkDeviceRooted 函数只支持 android 平台');
    }
  },

  checkDeviceType(callback) {
    if (RNBaselib.checkDeviceType) {
      RNBaselib.checkDeviceType((result) => {
        this.isSimulator = result;
        if (callback) callback(result);
      });
    }
  },

  getKeyboardStatus(callback) {
    if (RNBaselib.getKeyboardStatus) {
      RNBaselib.getKeyboardStatus(callback);
    }
  },

  getAppStoreInfoWithId(id, callback) {
    if (Platform.OS === 'android') {
      console.warn('getAppStoreInfoWithId 函数只支持 iOS 平台');
    } else {
      if (RNBaselib.getAppStoreInfoWithId) {
        RNBaselib.getAppStoreInfoWithId(id, callback);
      }
    }
  },

  getUUID(callback) {
    if (RNBaselib.getUUID) {
      RNBaselib.getUUID((uuid) => {
        this.uuid = uuid;
        if (callback) callback(uuid);
      });
    }
  },

  getIDFA(callback) {
    if (Platform.OS === 'android') {
      console.warn('getIDFA 函数只支持 iOS 平台');
    } else {
      if (RNBaselib.getIDFA) {
        RNBaselib.getIDFA((idfa) => {
          this.idfa = idfa;
          if (callback) callback(idfa);
        });
      }
    }
  },

  getWifiMac(callback) {
    if (RNBaselib.getWifiMac) {
      RNBaselib.getWifiMac((mac) => {
        this.macAddress = mac;
        if (callback) callback(mac);
      });
    }
  },

  getWifiIP(callback) {
    if (RNBaselib.getWifiIP) {
      RNBaselib.getWifiIP((ip) => {
        this.ipAddress = ip;
        if (callback) callback(ip);
      });
    }
  },

  getDeviceModel(callback) {
    if (RNBaselib.getDeviceModel) {
      if (Platform.OS === 'ios') {
        RNBaselib.getDeviceModel((deviceid) => {
          let model = '';
          for (var i = 0; i < Object.keys(appleDeviceNamesByCode).length; i++) {
            let code = Object.keys(appleDeviceNamesByCode)[i];
            if (deviceid === code) {
              model = appleDeviceNamesByCode[code];
              break;
            }
          }
          this.deviceModel = model;
          if (callback) callback(model);
        });
      } else {
        this.deviceModel = RNBaselib.deviceModel;
        if (callback) callback(this.deviceModel);
      }
    }
  },

  getDeviceLocale(callback) {
    if (RNBaselib.getDeviceLocale) {
      RNBaselib.getDeviceLocale((deviceLocale) => {
        this.deviceLocale = deviceLocale;
        if (callback) callback(deviceLocale);
      });
    }
  },
}

Baselib.checkDeviceType();
Baselib.getUUID();
Baselib.getWifiMac();
Baselib.getWifiIP();
if (Platform.OS === 'ios') {
  Baselib.getIDFA();
  Baselib.getDeviceModel();
} else {
  Baselib.checkDeviceRooted();
}

const appleDeviceNamesByCode = {
  'iPhone5,1': 'iPhone 5',
  'iPhone5,2': 'iPhone 5',
  'iPhone5,3': 'iPhone 5c', // (model A1456, A1532 | GSM)
  'iPhone5,4': 'iPhone 5c', // (model A1507, A1516, A1526 (China), A1529 | Global)
  'iPhone6,1': 'iPhone 5s', // (model A1433, A1533 | GSM)
  'iPhone6,2': 'iPhone 5s', // (model A1457, A1518, A1528 (China), A1530 | Global)
  'iPhone7,1': 'iPhone 6 Plus', //
  'iPhone7,2': 'iPhone 6', //
  'iPhone8,1': 'iPhone 6s', //
  'iPhone8,2': 'iPhone 6s Plus', //
  'iPhone8,4': 'iPhone SE', //
  'iPhone9,1': 'iPhone 7', // (model A1660 | CDMA)
  'iPhone9,3': 'iPhone 7', // (model A1778 | Global)
  'iPhone9,2': 'iPhone 7 Plus', // (model A1661 | CDMA)
  'iPhone9,4': 'iPhone 7 Plus', // (model A1784 | Global)
  'iPhone10,3': 'iPhone X', // (model A1865, A1902)
  'iPhone10,6': 'iPhone X', // (model A1901)
  'iPhone10,1': 'iPhone 8', // (model A1863, A1906, A1907)
  'iPhone10,4': 'iPhone 8', // (model A1905)
  'iPhone10,2': 'iPhone 8 Plus', // (model A1864, A1898, A1899)
  'iPhone10,5': 'iPhone 8 Plus', // (model A1897)
  'iPhone11,2': 'iPhone XS', // (model A2097, A2098)
  'iPhone11,4': 'iPhone XS Max', // (model A1921, A2103)
  'iPhone11,6': 'iPhone XS Max', // (model A2104)
  'iPhone11,8': 'iPhone XR', // (model A1882, A1719, A2105)
  'i386': 'Simulator', // Simulator
  'x86_64': 'Simulator', // Simulator
  'iPad4,1': 'iPad Air', // 5th Generation iPad (iPad Air) - Wifi
  'iPad4,2': 'iPad Air', // 5th Generation iPad (iPad Air) - Cellular
  'iPad4,3': 'iPad Air', // 5th Generation iPad (iPad Air)
  'iPad4,4': 'iPad Mini 2', // (2nd Generation iPad Mini - Wifi)
  'iPad4,5': 'iPad Mini 2', // (2nd Generation iPad Mini - Cellular)
  'iPad4,6': 'iPad Mini 2', // (2nd Generation iPad Mini)
  'iPad4,7': 'iPad Mini 3', // (3rd Generation iPad Mini)
  'iPad4,8': 'iPad Mini 3', // (3rd Generation iPad Mini)
  'iPad4,9': 'iPad Mini 3', // (3rd Generation iPad Mini)
  'iPad5,1': 'iPad Mini 4', // (4th Generation iPad Mini)
  'iPad5,2': 'iPad Mini 4', // (4th Generation iPad Mini)
  'iPad5,3': 'iPad Air 2', // 6th Generation iPad (iPad Air 2)
  'iPad5,4': 'iPad Air 2', // 6th Generation iPad (iPad Air 2)
  'iPad6,3': 'iPad Pro 9.7-inch', // iPad Pro 9.7-inch
  'iPad6,4': 'iPad Pro 9.7-inch', // iPad Pro 9.7-inch
  'iPad6,7': 'iPad Pro 12.9-inch', // iPad Pro 12.9-inch
  'iPad6,8': 'iPad Pro 12.9-inch', // iPad Pro 12.9-inch
  'iPad7,1': 'iPad Pro 12.9-inch', // 2nd Generation iPad Pro 12.5-inch - Wifi
  'iPad7,2': 'iPad Pro 12.9-inch', // 2nd Generation iPad Pro 12.5-inch - Cellular
  'iPad7,3': 'iPad Pro 10.5-inch', // iPad Pro 10.5-inch - Wifi
  'iPad7,4': 'iPad Pro 10.5-inch', // iPad Pro 10.5-inch - Cellular
  'iPad7,5': 'iPad (6th generation)', // iPad (6th generation) - Wifi
  'iPad7,6': 'iPad (6th generation)', // iPad (6th generation) - Cellular
  'iPad8,1': 'iPad Pro 11-inch (3rd generation)', // iPad Pro 11 inch (3rd generation) - Wifi
  'iPad8,2': 'iPad Pro 11-inch (3rd generation)', // iPad Pro 11 inch (3rd generation) - 1TB - Wifi
  'iPad8,3': 'iPad Pro 11-inch (3rd generation)', // iPad Pro 11 inch (3rd generation) - Wifi + cellular
  'iPad8,4': 'iPad Pro 11-inch (3rd generation)', // iPad Pro 11 inch (3rd generation) - 1TB - Wifi + cellular
  'iPad8,5': 'iPad Pro 12.9-inch (3rd generation)', // iPad Pro 12.9 inch (3rd generation) - Wifi
  'iPad8,6': 'iPad Pro 12.9-inch (3rd generation)', // iPad Pro 12.9 inch (3rd generation) - 1TB - Wifi
  'iPad8,7': 'iPad Pro 12.9-inch (3rd generation)', // iPad Pro 12.9 inch (3rd generation) - Wifi + cellular
  'iPad8,8': 'iPad Pro 12.9-inch (3rd generation)', // iPad Pro 12.9 inch (3rd generation) - 1TB - Wifi + cellular
  'AppleTV2,1': 'Apple TV', // Apple TV (2nd Generation)
  'AppleTV3,1': 'Apple TV', // Apple TV (3rd Generation)
  'AppleTV3,2': 'Apple TV', // Apple TV (3rd Generation - Rev A)
  'AppleTV5,3': 'Apple TV', // Apple TV (4th Generation)
  'AppleTV6,2': 'Apple TV 4K', // Apple TV 4K
  'iPod1,1': 'iPod Touch', // (Original)
  'iPod2,1': 'iPod Touch', // (Second Generation)
  'iPod3,1': 'iPod Touch', // (Third Generation)
  'iPod4,1': 'iPod Touch', // (Fourth Generation)
  'iPod5,1': 'iPod Touch', // (Fifth Generation)
  'iPod7,1': 'iPod Touch', // (Sixth Generation)
  'iPhone1,1': 'iPhone', // (Original)
  'iPhone1,2': 'iPhone 3G', // (3G)
  'iPhone2,1': 'iPhone 3GS', // (3GS)
  'iPad1,1': 'iPad', // (Original)
  'iPad2,1': 'iPad 2', //
  'iPad2,2': 'iPad 2', //
  'iPad2,3': 'iPad 2', //
  'iPad2,4': 'iPad 2', //
  'iPad3,1': 'iPad', // (3rd Generation)
  'iPad3,2': 'iPad', // (3rd Generation)
  'iPad3,3': 'iPad', // (3rd Generation)
  'iPhone3,1': 'iPhone 4', // (GSM)
  'iPhone3,2': 'iPhone 4', // iPhone 4
  'iPhone3,3': 'iPhone 4', // (CDMA/Verizon/Sprint)
  'iPhone4,1': 'iPhone 4S', //
  'iPhone5,1': 'iPhone 5', // (model A1428, AT&T/Canada)
  'iPhone5,2': 'iPhone 5', // (model A1429, everything else)
  'iPad3,4': 'iPad', // (4th Generation)
  'iPad3,5': 'iPad', // (4th Generation)
  'iPad3,6': 'iPad', // (4th Generation)
  'iPad2,5': 'iPad Mini', // (Original)
  'iPad2,6': 'iPad Mini', // (Original)
  'iPad2,7': 'iPad Mini', // (Original)
};

export default Baselib;
