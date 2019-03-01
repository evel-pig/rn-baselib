import { Dimensions, StatusBar, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from './theme';
import platform from './platform';

const window = Dimensions.get('window');

const DeviceWidth = window.width;
const DeviceHeight = window.height;

/**
 * 定义全局函数
 */
declare global {
  /**
   * 根据750px的设计稿比例转换成dp
   * @param {number} px
   * @returns {number}
   */
  function px2dp(px: number): number;
}

declare const global: any;
global['px2dp'] = (px: number) => {
  return (px / 750) * window.width;
};

// theme:不可被改写部分;
const NavBarHeight = platform.isIOS ? 44 : px2dp(88);

const StatusBarHeight = platform.isIOS ?
  (platform.isIPhoneX ? 44 : 20) :
  (platform.overAndroid5 ? StatusBar.currentHeight : 0);

const HeaderHeight = NavBarHeight + StatusBarHeight;

const HeaderPaddingTop = platform.isIOS ? 0 : StatusBarHeight;

const ViewHeight = DeviceHeight - HeaderHeight;

const iPhoneXBottom = platform.isIPhoneX ? 34 : 0;

export const Theme = {
  ...theme,
  fontWeightMedium: '500' as '500',
  fontWeightThin: '200' as '200',
  borderWidth: px2dp(1),
  hitSlop: {
    top: px2dp(10),
    bottom: px2dp(10),
    left: px2dp(10),
    right: px2dp(10),
  },
  DeviceWidth,
  DeviceHeight,
  StatusBarHeight,
  HeaderHeight,
  HeaderPaddingTop,
  ViewHeight,
  iPhoneXBottom,
  NavBarHeight,
};

export const Platform = platform;

const styles = StyleSheet.create({
  font: {
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_20: {
    fontSize: px2dp(20),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_22: {
    fontSize: px2dp(22),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_24: {
    fontSize: px2dp(24),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_26: {
    fontSize: px2dp(26),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_28: {
    fontSize: px2dp(28),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_30: {
    fontSize: px2dp(30),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_30_bold: {
    fontSize: px2dp(30),
    color: theme.fontColor,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  } as TextStyle,
  font_32: {
    fontSize: px2dp(32),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_34: {
    fontSize: px2dp(34),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_36: {
    fontSize: px2dp(36),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_40: {
    fontSize: px2dp(40),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_48: {
    fontSize: px2dp(48),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_50: {
    fontSize: px2dp(50),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_60: {
    fontSize: px2dp(60),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_72: {
    fontSize: px2dp(72),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  font_80: {
    fontSize: px2dp(80),
    color: theme.fontColor,
    backgroundColor: 'transparent',
  } as TextStyle,
  border: {
    borderWidth: Theme.borderWidth,
    borderColor: Theme.borderColor,
  } as ViewStyle,
  borderTop: {
    borderTopWidth: Theme.borderWidth,
    borderTopColor: Theme.borderColor,
  } as ViewStyle,
  borderBottom: {
    borderBottomWidth: Theme.borderWidth,
    borderBottomColor: Theme.borderColor,
  } as ViewStyle,
  borderLeft: {
    borderLeftWidth: Theme.borderWidth,
    borderLeftColor: Theme.borderColor,
  } as ViewStyle,
  borderRight: {
    borderRightWidth: Theme.borderWidth,
    borderRightColor: Theme.borderColor,
  } as ViewStyle,
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  centerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  centerFlexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  // 一些通用样式
  itemView: {
    height: px2dp(100),
    paddingRight: px2dp(40),
    paddingLeft: px2dp(40),
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  hitSlop10: {
    top: px2dp(20),
    bottom: px2dp(20),
    left: px2dp(20),
    right: px2dp(20),
  } as ViewStyle,
  card: {
    marginTop: px2dp(40),
    marginHorizontal: px2dp(40),
    borderRadius: px2dp(16),
    overflow: 'hidden',
  } as ViewStyle,
});

export default styles;
