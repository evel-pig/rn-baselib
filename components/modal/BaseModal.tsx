import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
  Text,
} from 'react-native';
import appStyle, { Theme } from '../../styles';
import ImageButton from '../buttons/ImageButton';
import iconClose from '../assets/icons/close.png';
import * as Animatable from 'react-native-animatable';

export interface BaseModalProps {
  /** 显示后回调 */
  onShowed?: (e?: any) => void;
  /** 消失后回调 */
  onClosed?: (e?: any) => void;
  /** 点击背景回调 */
  onPressBg?: (e?: any) => void;
  /** 内容区域高度 */
  modalHeight?: number;
  /** 点击背景是否消失, 默认true */
  hideWithClickbg?: boolean;
  /** 标题, 如果为空, 则没有titleBar标题栏 */
  title?: string;
  /** titleBar标题栏样式 */
  titleBarStyle?: StyleProp<ViewStyle>;
  /** 标题文字样式 */
  titleTextStyle?: StyleProp<TextStyle>;
  /** 标题栏底部分隔线颜色, 默认borderColor */
  titleBarBorderColor?: string;
  /** 右上角关闭按钮大小, 默认px2dp(30) */
  closeIconSize?: number;
  /** 点击右上角关闭按钮 */
  onPressCloseIcon?: (e?: any) => void;
  /** 右上角关闭按钮样式 */
  closeIconStyle?: StyleProp<ViewStyle>;
  /** 内容区域样式 */
  style?: StyleProp<ViewStyle>;
  /** 背景样式 */
  bgStyle?: StyleProp<ViewStyle>;
}

interface BaseModalState {
  visible: boolean;
}

class BaseModal extends Component<BaseModalProps, BaseModalState> {
  timer: any;
  durationTime: number = 500;
  contentView = Animatable.View;

  static defaultProps = {
    modalHeight: px2dp(800),
    hideWithClickbg: true,
    titleBarBorderColor: Theme.borderColor,
    closeIconSize: px2dp(30),
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillUnmount() {
    this.close();
    if (this.timer) clearTimeout(this.timer);
  }

  show = () => {
    if (!this.state.visible) {
      this.setState({ visible: true }, () => {
        if (this.contentView) this.contentView.fadeInUpBig();
        if (this.props.onShowed) this.props.onShowed();
      });
    }
  }

  close = () => {
    if (this.state.visible) {
      if (this.contentView) this.contentView.fadeOutDownBig().then(() => {
        if (this.props.onClosed) this.props.onClosed();
      });
      this.timer = setTimeout(() => {
        this.setState({ visible: false });
      }, this.durationTime * 0.5);
    }
  }

  _onPressBg = () => {
    const { hideWithClickbg, onPressBg } = this.props;
    if (onPressBg) onPressBg();
    if (hideWithClickbg) this.close();
  }

  render() {
    const {
      titleBarBorderColor,
      title,
      titleBarStyle,
      titleTextStyle,
      closeIconSize,
      onPressCloseIcon,
      closeIconStyle,
      style,
      bgStyle,
      modalHeight,
    } = this.props;

    return (
      <Modal animationType={'fade'} transparent visible={this.state.visible} onRequestClose={() => { }}>
        <TouchableOpacity style={[styles.coverBg, bgStyle]} activeOpacity={1} onPress={this._onPressBg} />
        <Animatable.View duration={this.durationTime} ref={r => this.contentView = r} style={[styles.content, style, { height: modalHeight }]}>
          {
            title ?
              <View style={[styles.titleBar, { borderBottomColor: titleBarBorderColor }, titleBarStyle]}>
                <Text style={[appStyle.font_30, { alignSelf: 'center' }, titleTextStyle]}>{title}</Text>
                <ImageButton
                  source={iconClose}
                  style={[appStyle.centerFlex, styles.imgBtn, closeIconStyle]}
                  imgStyle={{ width: closeIconSize, height: closeIconSize }}
                  onPress={() => {
                    if (onPressCloseIcon) {
                      onPressCloseIcon();
                    } else {
                      this.close();
                    }
                  }}
                />
              </View> :
              null
          }
          {this.props.children}
        </Animatable.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  coverBg: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
  },
  content: {
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: Theme.DeviceWidth,
    backgroundColor: Theme.white,
  } as ViewStyle,
  titleBar: {
    width: Theme.DeviceWidth,
    height: px2dp(84),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: px2dp(84),
    borderBottomWidth: Theme.borderWidth,
  },
  imgBtn: {
    width: px2dp(84),
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
});

export default BaseModal;
