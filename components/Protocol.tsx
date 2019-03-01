import React, { Component } from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TextStyle,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Text,
} from 'react-native';
import appStyles, { Theme } from '../styles';
import ImageButton from './buttons/ImageButton';
import iconSelected from './assets/icons/selected.png';
import iconUnselected from './assets/icons/unselected.png';

interface ProtocolProps {
  /** 提示语, 默认是 阅读并同意 */
  hint?: string;
  /** 协议名称 */
  name: string;
  /** 提示语样式 */
  hintStyle?: StyleProp<TextStyle>;
  /** 协议名称样式 */
  nameStyle?: StyleProp<TextStyle>;
  /** 协议名称是否带下划线, 默认false */
  isUnderline?: boolean;
  /** 是否显示勾选组件, 默认false */
  isShowCheck?: boolean;
  /** 默认勾选状态, 默认false */
  defaultCheckStatus?: boolean;
  /** 勾选的图片资源 */
  checkIcon?: ImageSourcePropType;
  /** 未勾选的图片资源 */
  uncheckIcon?: ImageSourcePropType;
  /** 勾选图片样式 */
  iconStyle?: StyleProp<ImageStyle>;
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;
  /** 点击勾选回调 */
  onCheck?: (e?: any) => void;
  /** 点击协议回调 */
  onPress?: (e?: any) => void;
}

interface ProtocolState {
  isCheck: boolean;
}

class Protocol extends Component<ProtocolProps, ProtocolState> {

  static defaultProps = {
    isUnderline: false,
    isShowCheck: false,
    defaultCheckStatus: false,
    hint: '阅读并同意',
  };

  constructor(props) {
    super(props);
    this.state = {
      isCheck: this.props.defaultCheckStatus,
    };
  }

  _onCheck = () => {
    const { onCheck } = this.props;
    this.setState({ isCheck: !this.state.isCheck }, () => {
      if (onCheck) onCheck(this.state.isCheck);
    });
  }

  _onPressHint = () => {
    const { isShowCheck, onPress } = this.props;
    if (isShowCheck) {
      this._onCheck();
    } else if (onPress) {
      onPress();
    }
  }

  render() {
    const {
      hint = '',
      name = '',
      hintStyle,
      nameStyle,
      isUnderline,
      isShowCheck,
      checkIcon = iconSelected,
      uncheckIcon = iconUnselected,
      iconStyle,
      style,
      onPress,
      children,
    } = this.props;
    const { isCheck } = this.state;
    return (
      <View style={[styles.container, style]} >
        {isShowCheck ? <ImageButton
          source={isCheck ? checkIcon : uncheckIcon}
          imgStyle={[styles.img, iconStyle]}
          style={{ backgroundColor: 'transparent' }}
          onPress={this._onCheck}
        /> : null}
        <Text style={[appStyles.font_24, styles.hint, hintStyle]} onPress={this._onPressHint}>{hint}</Text>
        <Text style={[appStyles.font_24, styles.name, { textDecorationLine: isUnderline ? 'underline' : 'none' }, nameStyle]} onPress={onPress}>{name}</Text>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: px2dp(60),
  },
  img: {
    width: px2dp(30),
    height: px2dp(30),
    marginRight: px2dp(15),
  },
  hint: {
    paddingVertical: px2dp(15),
  },
  name: {
    paddingVertical: px2dp(15),
    color: Theme.theme,
  },
});

export default Protocol;
