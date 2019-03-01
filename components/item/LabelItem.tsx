import React, { Component, ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  View,
  StyleSheet,
  ImageSourcePropType,
  ImageStyle,
  Animated,
  Easing,
  StyleProp,
  Image,
  GestureResponderEvent,
} from 'react-native';
import HorizontalLine from '../HorizontalLine';
import appStyles, { Theme } from '../../styles';
import arrowRight from '../assets/icons/arrow-right.png';

export interface LabelItemProps {
  /** 点击函数 */
  onPress?: (event: GestureResponderEvent) => void;
  /** 是否不可以点击button, 默认false */
  disabled?: boolean;
  /** 按钮的样式 */
  style?: StyleProp<ViewStyle>;
  /** 点击透明度, 默认0.6 */
  activeOpacity?: number;
  /** 底部分隔线样式 */
  borderStyle?: StyleProp<ViewStyle>;
  /** 右边文字点击函数 */
  onPressRight?: (event: GestureResponderEvent) => void;
  /** 左边文字点击函数 */
  onPressLeft?: (event: GestureResponderEvent) => void;
  /** 右边文字 */
  textRight?: string;
  /** 左边文字 */
  textLeft?: string;
  /** 右边第二行文字 */
  textRightDes?: string;
  /** 左边第二行文字 */
  textLeftDes?: string;
  /** 右边文字样式 */
  textRightStyle?: StyleProp<TextStyle>;
  /** 左边文字样式 */
  textLeftStyle?: StyleProp<TextStyle>;
  /** 右边第二行文字样式 */
  textRightDesStyle?: StyleProp<TextStyle>;
  /** 左边第二行文字样式 */
  textLeftDesStyle?: StyleProp<TextStyle>;
  /** 是否显示底部分隔线, 默认true */
  border?: boolean;
  /** 是否显示最右边箭头, 默认false */
  showArrow?: boolean;
  /** 传入左边文字前面的控件 */
  beforeTextLeftComponent?: ReactNode;
  /** 传入左边文字后面的控件 */
  afterTextLeftComponent?: ReactNode;
  /** 传入右边文字前面的控件 */
  beforeTextRightComponent?: ReactNode;
  /** 传入右边文字后面的控件 */
  afterTextRightComponent?: ReactNode;
  /** 传入中间的控件 */
  centerComponent?: ReactNode;
}

export default class LabelItem extends Component<LabelItemProps, any> {

  static defaultProps = {
    disabled: false,
    activeOpacity: 0.6,
    textRight: '',
    textLeft: '',
    border: true,
    showArrow: false,
  };

  _onPress = (e) => {
    const { onPress } = this.props;
    if (onPress) onPress(e);
  }

  render() {
    const {
      style,
      disabled,
      activeOpacity,
      borderStyle,
      onPressRight,
      onPressLeft,
      textRight,
      textLeft,
      textRightStyle,
      textLeftStyle,
      border,
      showArrow,
      beforeTextLeftComponent,
      afterTextLeftComponent,
      beforeTextRightComponent,
      afterTextRightComponent,
      textRightDes,
      textLeftDes,
      textRightDesStyle,
      textLeftDesStyle,
      centerComponent,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[styles.container, style]}
        hitSlop={Theme.hitSlop}
        activeOpacity={activeOpacity}
        disabled={disabled}
      >
        {beforeTextLeftComponent}
        <TextView onPress={onPressLeft || this._onPress} textStyle={textLeftStyle} text={textLeft} des={textLeftDes} desStyle={textLeftDesStyle} />
        {afterTextLeftComponent}
        <View style={appStyles.centerFlex} >
          {centerComponent}
        </View>
        {beforeTextRightComponent}
        <TextView onPress={onPressRight || this._onPress} textStyle={textRightStyle} text={textRight} des={textRightDes} desStyle={textRightDesStyle} />
        {afterTextRightComponent}
        {showArrow ? <Image source={arrowRight} style={styles.arrow} /> : null}
        {border ? <HorizontalLine style={borderStyle} /> : null}
      </TouchableOpacity>
    );
  }
}

const TextView = ({ onPress, textStyle, text, des, desStyle }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'column' }}
      activeOpacity={1}
      onPress={onPress}
      hitSlop={Theme.hitSlop}
    >
      {text ? <Text style={[appStyles.font_30, textStyle]}>{text}</Text> : null}
      {des ? <Text style={[appStyles.font_24, { marginTop: px2dp(24) }, desStyle]}>{des}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: px2dp(20),
    paddingVertical: px2dp(10),
    flex: 1,
    height: px2dp(100),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.white,
  } as ViewStyle,
  arrow: {
    width: px2dp(30),
    height: px2dp(30),
    marginHorizontal: px2dp(5),
    marginLeft: px2dp(10),
  } as ImageStyle,
});
