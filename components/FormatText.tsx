import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Text,
  TextStyle,
  FlexAlignType,
} from 'react-native';
import appStyles from '../styles';

interface FormatTextProps {
  /** 文字数组 */
  texts: string[];
  /** 文字样式数组, 默认文字样式是 appStyles.font_30 */
  textStyles?: StyleProp<TextStyle>[];
  /** 各段文字对齐方式 */
  alignItems?: FlexAlignType;
  /** 整体样式, 默认 flex-end */
  style?: StyleProp<ViewStyle>;
}

const FormatText = (props: FormatTextProps) => {
  const {
    textStyles = [],
    texts = [],
    style,
    alignItems = 'flex-end',
  } = props;
  return (
    <View style={[{ flexDirection: 'row', alignItems: alignItems }, style]} >
      <Text>
        {
          texts.length > 0 && texts.map((str, index) => {
            let tmpS = {};
            if (index < textStyles.length) {
              tmpS = textStyles[index];
            }
            return <Text key={index} style={[appStyles.font_30, tmpS]}>{str}</Text>;
          })
        }
      </Text>
    </View>
  );
};

export default FormatText;
