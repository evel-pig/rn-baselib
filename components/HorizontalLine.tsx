import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Theme } from '../styles';

interface HorizontalLineProps {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const HorizontalLine = ({ color = Theme.borderColor, style }: HorizontalLineProps) => {
  return <View style={[styles.line, { backgroundColor: color }, style]} />;
};

const styles = StyleSheet.create({
  line: {
    height: Theme.borderWidth,
    position: 'absolute',
    left: px2dp(20),
    right: 0,
    bottom: 0,
  },
});

export default HorizontalLine;
