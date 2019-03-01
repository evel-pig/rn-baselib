import React from 'react';
import { TextProperties } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { Theme } from '../styles';

let IconComponent;

export interface IconProps extends TextProperties {
  /** 图标名字 */
  name: string;
  /** 图标大小,默认:px2dp(30) */
  size?: number;
  /** 图标颜色值, 默认是fontColor */
  color?: string;
}

const SVGIcon = ({ size = px2dp(30), style, color = Theme.fontColor, ...rest }: IconProps) => {
  return <IconComponent size={size} style={[{ backgroundColor: 'transparent', alignSelf: 'center', color: color }, style]} {...rest} />;
};

SVGIcon.setConfig = (config) => {
  IconComponent = createIconSetFromIcoMoon(config);
};

export default SVGIcon;
