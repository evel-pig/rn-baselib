import React, { ReactNode } from 'react';
import {
  ViewStyle,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  View,
  StyleProp,
  TextStyle,
  Text,
} from 'react-native';
import appStyles, { Theme } from '../../styles';

export interface ImageButtonProps {
  /** 点击函数 */
  onPress?: (e?: any) => void;
  /** 点击时按钮透明度 */
  activeOpacity?: number;
  /** 图片资源 */
  source?: ImageSourcePropType;
  /** 图片样式 */
  imgStyle: StyleProp<ImageStyle>;
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;
  /** 是否不能点击 */
  disabled?: boolean;
  /** 右上角是否显示红点, 默认不显示 */
  redPoint?: boolean;
  /** 红点的样式 */
  redPointStyle?: StyleProp<ViewStyle>;
  /** 传入子组件 */
  children?: ReactNode;
  /** 图片左边文字 */
  textLeft?: string;
  /** 图片右边文字 */
  textRight?: string;
  /** 图片上边文字 */
  textUp?: string;
  /** 图片下边文字 */
  textBottom?: string;
  /** 图片左边文字样式 */
  textLeftStyle?: StyleProp<TextStyle>;
  /** 图片右边文字 样式*/
  textRightStyle?: StyleProp<TextStyle>;
  /** 图片上边文字样式 */
  textUpStyle?: StyleProp<TextStyle>;
  /** 图片下边文字样式 */
  textBottomStyle?: StyleProp<TextStyle>;
  /** 传入图片左边控件 */
  leftComponent?: ReactNode;
  /** 传入图片右边控件 */
  rightComponent?: ReactNode;
  /** 传入图片顶部控件 */
  upComponent?: ReactNode;
  /** 传入图片底部控件 */
  bottomComponent?: ReactNode;
}

const ImageButton = (props: ImageButtonProps) => {
  const {
    source,
    imgStyle,
    onPress = () => { },
    activeOpacity = 0.6,
    style,
    disabled = false,
    redPoint = false,
    redPointStyle,
    children = null,
    textLeft,
    textRight,
    textUp,
    textBottom,
    textLeftStyle,
    textRightStyle,
    textUpStyle,
    textBottomStyle,
    leftComponent,
    rightComponent,
    upComponent,
    bottomComponent,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[styles.container, style]}
      hitSlop={Theme.hitSlop}
      disabled={disabled}
    >
      {upComponent}
      {textUp ? <Text style={[appStyles.font_30, { marginBottom: px2dp(10) }, textUpStyle]}>{textUp}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leftComponent}
        {textLeft ? <Text style={[appStyles.font_30, { marginRight: px2dp(10) }, textLeftStyle]}>{textLeft}</Text> : null}
        {source ? <Image source={source} style={imgStyle} /> : null}
        {textRight ? <Text style={[appStyles.font_30, { marginLeft: px2dp(10) }, textRightStyle]}>{textRight}</Text> : null}
        {rightComponent}
      </View>
      {textBottom ? <Text style={[appStyles.font_30, { marginTop: px2dp(10) }, textBottomStyle]}>{textBottom}</Text> : null}
      {bottomComponent}
      {redPoint ? <View style={[styles.redPoint, redPointStyle]} /> : null}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  redPoint: {
    position: 'absolute',
    right: px2dp(10),
    top: px2dp(10),
    height: px2dp(20),
    width: px2dp(20),
    borderRadius: px2dp(10),
    backgroundColor: Theme.red,
  },
});

export default ImageButton;
