import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Theme } from '../../styles';

export interface ButtonProps {
  /** 点击函数 */
  onPress?: (e?: any) => void;
  /** 标题 */
  title?: string;
  /** 是否不能点击 */
  disabled?: boolean;
  /** 按钮圆角 */
  borderRadius?: number;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 不能点击时背景颜色 */
  disableBackgroundColor?: string;
  /** 标题颜色 */
  titleColor?: string;
  /** 能点击时标题颜色  */
  disableTitleColor?: string;
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;
  /** 标题样式 */
  titleStyle?: StyleProp<TextStyle>;
  /** 传入子组件 */
  children?: ReactNode;
}

const Button = (props: ButtonProps) => {
  const {
    onPress = () => { },
    disabled,
    style,
    titleStyle,
    backgroundColor = Theme.theme,
    disableBackgroundColor = Theme.disabledColor,
    titleColor = Theme.white,
    disableTitleColor = 'rgba(255,255,255,0.6)',
    borderRadius = px2dp(45),
    title = 'button',
    children = null,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, { borderRadius: borderRadius, backgroundColor: disabled ? disableBackgroundColor : backgroundColor }, style]}
      disabled={disabled}
      activeOpacity={0.6}
    >
      <Text style={[styles.text, titleStyle, { color: disabled ? disableTitleColor : titleColor }]}>{title}</Text>
      {children}
    </TouchableOpacity>
  );
};

interface Style {
  btn: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  btn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: px2dp(90),
    width: Theme.DeviceWidth - 2 * px2dp(40),
  },
  text: {
    fontSize: px2dp(30),
    backgroundColor: 'transparent',
    fontWeight: Theme.fontWeightMedium,
  },
});

export default Button;
