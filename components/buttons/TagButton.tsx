import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appStyles, { Theme } from '../../styles';

export interface TagButtonProps {
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
  /** 是否选中状态 */
  selected?: boolean;
  /** 未选中状态背景颜色 */
  unSelectedColor?: string;
}

const TagButton = (props: TagButtonProps) => {
  const {
    selected = false,
    onPress = () => { },
    disabled,
    style,
    titleStyle,
    unSelectedColor = Theme.white,
    borderRadius = px2dp(45),
    title = 'tag',
    titleColor = Theme.fontColor,
    titledisableColo = Theme.fontColor,
    locations = [0, 1],
    start = { x: 0.0, y: 0.0 },
    end = { x: 0.0, y: 1.0 },
    colors = selected ? [Theme.yellowLight, Theme.yellow] : [unSelectedColor, unSelectedColor],
    useAngle = false,
    angleCenter,
    angle = 0,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
    >
      <LinearGradient
        colors={selected ? colors : [unSelectedColor, unSelectedColor]}
        locations={locations}
        start={start}
        end={end}
        useAngle={useAngle}
        angleCenter={angleCenter}
        angle={angle}
        style={[appStyles.centerRow, styles.linear, { borderRadius: borderRadius, borderWidth: Theme.borderWidth, borderColor: selected ? 'transparent' : Theme.fontColor_99 }, style]}
      >
        <Text style={[appStyles.font_30, { color: disabled ? titledisableColo : titleColor }, titleStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linear: {
    paddingHorizontal: px2dp(50),
    paddingVertical: px2dp(20),
    // minHeight: px2dp(70),
  },
});

export default TagButton;
