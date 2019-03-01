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
} from 'react-native';
import appStyles, { Theme } from '../../styles';
import arrowLeft from '../assets/icons/arrow-left.png';
import arrowRight from '../assets/icons/arrow-right.png';
import arrowUp from '../assets/icons/arrow-up.png';
import arrowDown from '../assets/icons/arrow-down.png';

export interface ArrowButtonProps {
  /** 点击函数 */
  onPress?: (e?: any) => void;
  /** 是否可以点击button */
  disabled?: boolean;
  /** 标题名字 */
  title?: string;
  /** 右上角是否显示红点, 默认不显示 */
  redPoint?: boolean;
  /** 左向icon资源 */
  leftIcon?: ImageSourcePropType;
  /** 右向icon资源 */
  rightIcon?: ImageSourcePropType;
  /** 向上icon资源 */
  upIcon?: ImageSourcePropType;
  /** 向下icon资源 */
  downIcon?: ImageSourcePropType;
  /** 按钮的样式 */
  style?: StyleProp<ViewStyle>;
  /** 红点的样式 */
  redPointStyle?: StyleProp<ViewStyle>;
  /** 文字样式 */
  textStyle?: StyleProp<TextStyle>;
  /** icon样式 */
  iconStyle?: StyleProp<ImageStyle>;
  /** 箭头显示类型, 默认无箭头 */
  iconType?: 'left' | 'right' | 'up' | 'down' | 'both';
  /** 是否点击旋转箭头, 默认不旋转 */
  rotateIcon?: boolean;
  /** 传入文字左边子组件 */
  leftChildren?: ReactNode;
  /** 传入文字右边子组件 */
  rightChildren?: ReactNode;
}

export default class ArrowButton extends Component<ArrowButtonProps, any> {
  rotateAnim = new Animated.Value(0);
  isShow: boolean = false;

  static defaultProps = {
    onPress: () => { },
    disabled: false,
    redPoint: false,
    leftIcon: arrowLeft,
    rightIcon: arrowRight,
    upIcon: arrowUp,
    downIcon: arrowDown,
    rotateIcon: false,
    leftChildren: null,
    rightChildren: null,
  };

  _onPress = (e) => {
    const { onPress, rotateIcon } = this.props;
    if (rotateIcon) {
      Animated.timing(
        this.rotateAnim, {
          toValue: this.isShow ? 0 : 1,
          duration: 250,
          easing: Easing.ease,
          useNativeDriver: true,
        },
      ).start(() => this.isShow = !this.isShow);
    }
    if (onPress) onPress(e);
  }

  render() {
    const {
      disabled,
      title,
      redPoint,
      leftIcon,
      rightIcon,
      upIcon,
      downIcon,
      style,
      redPointStyle,
      textStyle,
      iconStyle,
      iconType,
      rotateIcon,
      leftChildren,
      rightChildren,
    } = this.props;

    let rotateStyle = {};
    if (rotateIcon) {
      const rotate = this.rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-180deg'],
      });
      rotateStyle = { transform: [{ rotate: rotate }] };
    }

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[styles.btn, style]}
        hitSlop={Theme.hitSlop}
        activeOpacity={0.6}
        disabled={disabled}
      >
        {leftChildren}
        {iconType === 'left' || iconType === 'both' ? <Icon source={leftIcon} iconStyle={iconStyle} style={rotateStyle} /> : null}
        {title ? <Text style={[appStyles.font_30, textStyle]} numberOfLines={1}>{title}</Text > : null}
        {iconType === 'right' || iconType === 'both' ? <Icon source={rightIcon} iconStyle={iconStyle} style={rotateStyle} /> : null}
        {iconType === 'up' ? <Icon source={upIcon} iconStyle={iconStyle} style={rotateStyle} /> : null}
        {iconType === 'down' ? <Icon source={downIcon} iconStyle={iconStyle} style={rotateStyle} /> : null}
        {redPoint ? <View style={[styles.redPoint, redPointStyle]} /> : null}
        {rightChildren}
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

const Icon = ({ source, iconStyle, style }) => {
  return (
    <Animated.View style={style}>
      <Image source={source} style={[styles.icon, iconStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: px2dp(20),
    paddingVertical: px2dp(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  redPoint: {
    position: 'absolute',
    right: px2dp(10),
    top: px2dp(10),
    height: px2dp(16),
    width: px2dp(16),
    borderRadius: px2dp(8),
    backgroundColor: Theme.red,
  },
  icon: {
    width: px2dp(30),
    height: px2dp(30),
    marginHorizontal: px2dp(5),
  },
});
