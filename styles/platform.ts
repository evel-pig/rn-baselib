import { Platform, Dimensions } from 'react-native';

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414; // xs max && xr
const XSMAX_HEIGHT = 896;  // xs max && xr

/**
 * 判断是否IOS平台
 */
const isIOS = Platform.OS === 'ios';

/**
 * 判断是否iPhoneX,XS,XR,XS Max;
 */
const isIPhoneX = isIOS &&
  ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) || (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)) ||
  ((D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) || (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT));

/**
 * 判断是否Android平台
 */
const isAndroid = Platform.OS === 'android';

/**
 * 判断是否Android5.x平台
 */
const isAndroid5 = isAndroid && Platform.Version > 20 && Platform.Version < 23;

/**
 * 判断是否Android5.0以上平台
 */
const overAndroid5 = isAndroid && Platform.Version > 20;

const platform = {
  isIOS,
  isIPhoneX,
  isAndroid,
  isAndroid5,
  overAndroid5,
};

export default platform;
