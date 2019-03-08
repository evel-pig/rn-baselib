import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appStyles, { Theme } from '../../styles';

export interface GradientButtonProps {
  /** 点击函数 */
  onPress?: (e?: any) => void;
  /** 是否不能点击 */
  disabled?: boolean;
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;
  /** 标题样式 */
  titleStyle?: StyleProp<TextStyle>;
  /** 按钮圆角 */
  borderRadius?: number;
  /** 按钮标题 */
  title: string;
  /** 不能点击时按钮颜色 */
  disableColor?: string;
  /** 按钮标题颜色 */
  titleColor?: string;
  /** 按钮标题不能点击时颜色 */
  titledisableColo?: string;
  /** 渐变颜色数组 */
  colors?: (string | number)[];
  /** 开始渐变坐标 */
  start?: { x: number; y: number };
  /** 结束渐变坐标 */
  end?: { x: number; y: number };
  /** 渐变范围 */
  locations?: number[];
  /** 是否是有角度渐变 */
  useAngle?: boolean;
  /** 角度旋转中心坐标 */
  angleCenter?: { x: number, y: number };
  /** 角度 */
  angle?: number;
  /** 渐变view样式 */
  LinearGradientStyle?: ViewStyle;
}

const GradientButton = (props: GradientButtonProps) => {
  const {
    onPress = () => { },
    disabled,
    style,
    titleStyle,
    disableColor = Theme.disabledColor,
    borderRadius = px2dp(45),
    title = '渐变按钮',
    titleColor = Theme.white,
    titledisableColo = 'rgba(255,255,255,0.6)',
    colors = disabled ? [disableColor, disableColor] : [Theme.themeLight, Theme.theme],
    locations = [0, 1],
    start = { x: 0.0, y: 0.0 },
    end = { x: 1.0, y: 0.0 },
    useAngle = false,
    angleCenter,
    angle = 0,
    LinearGradientStyle,
  } = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]} disabled={disabled} activeOpacity={0.6}>
      <LinearGradient
        colors={colors}
        locations={locations}
        start={start}
        end={end}
        useAngle={useAngle}
        angleCenter={angleCenter}
        angle={angle}
        style={[appStyles.centerFlex, { borderRadius: borderRadius, flex: 1, }, LinearGradientStyle]}
      >
        <Text style={[styles.text, { color: disabled ? titledisableColo : titleColor }, titleStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

interface Style {
  btn: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  btn: {
    width: Theme.DeviceWidth - 2 * px2dp(40),
    height: px2dp(90),
    alignSelf: 'center',
  },
  text: {
    fontSize: px2dp(30),
    backgroundColor: 'transparent',
    fontWeight: Theme.fontWeightMedium,
  },
});

export default GradientButton;
