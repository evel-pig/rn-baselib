import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
  Text,
} from 'react-native';
import appStyle, { Theme } from '../../styles';
import ImageButton from '../buttons/ImageButton';
import iconClose from '../assets/icons/close.png';

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
  contentH: any = new Animated.Value(0);
  durationTime: number = 250;

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
      this.setState({ visible: true });
      this.timer = setTimeout(() => {
        this._createAnimation(this.props.modalHeight).start(() => {
          if (this.props.onShowed) this.props.onShowed();
        });
      }, this.durationTime);
    }
  }

  close = () => {
    if (this.state.visible) {
      this.contentH.setValue(0);
      this._createAnimation(0).start();
      this.timer = setTimeout(() => {
        this.setState({ visible: false });
        if (this.props.onClosed) this.props.onClosed();
      }, 0);
    }
  }

  _createAnimation = (h) => {
    return Animated.timing(
      this.contentH, {
        toValue: h,
        duration: this.durationTime,
        easing: Easing.linear,
      },
    );
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
    } = this.props;

    return (
      <Modal animationType={'fade'} transparent visible={this.state.visible} onRequestClose={() => { }}>
        <TouchableOpacity style={[styles.coverBg, bgStyle]} activeOpacity={1} onPress={this._onPressBg} />
        <Animated.View style={[styles.content, style, { height: this.contentH }]}>
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
        </Animated.View>
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
