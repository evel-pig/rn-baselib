import React, { Component } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  DeviceEventEmitter,
  EmitterSubscription,
  StyleProp,
} from 'react-native';
import appStyles, { Theme } from '../styles';

export interface ToastConfig {
  /* 提示文案 */
  des: string;
  /* 显示时长(默认3s) */
  time?: number;
  /** toast消失后的回调 */
  callback?: () => void;
  /** 自定义这一次toast样式 */
  showStyle?: StyleProp<ViewStyle>;
  /** 自定义这一次背景样式 */
  showBackgroundStyle?: StyleProp<ViewStyle>;
  /** 自定义这一次展示的文字样式 */
  showTextStyle?: StyleProp<TextStyle>;
}

export interface ToastProps {
  /** 显示时长, 默认2500毫秒 */
  showTime?: number;
  /** 文字最多行数, 默认4行 */
  numberOfLines?: number;
  /** 点击背景调用函数 */
  onPressBackground?: (e?: any) => void;
  /** toast样式 */
  style?: StyleProp<ViewStyle>;
  /** 背景样式 */
  backgroundStyle?: StyleProp<ViewStyle>;
  /** 展示的文字样式 */
  textStyle?: StyleProp<TextStyle>;
}

interface ToastState {
  visible: boolean;
  text: string;
}

class Toast extends Component<ToastProps, ToastState> {
  emitter: EmitterSubscription;
  timer: number;
  showConfig: ToastConfig;

  static defaultProps = {
    showTime: 2500,
    numberOfLines: 4,
  };

  /**
   * show Toast alert
   *
   * @static
   * @param {ToastConfig} toastConfig
   * @memberof Toast
   */
  static show(toastConfig: ToastConfig) {
    DeviceEventEmitter.emit('TOAST_SHOW', toastConfig);
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      text: '',
    };
  }

  componentDidMount() {
    this.emitter = DeviceEventEmitter.addListener('TOAST_SHOW', (data) => {
      this.showConfig = data;
      this.setState({ visible: true, text: data.des }, () => {
        const { time = this.props.showTime, callback = () => { } } = data;
        this.show(time, callback);
      });
    });
  }

  show = (time = this.props.showTime, callback = () => { }) => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ visible: false, text: '' }, callback);
      this.showConfig = null;
    }, time);
  }

  componentWillUnmount() {
    if (this.emitter) this.emitter.remove();
    if (this.timer) clearTimeout(this.timer);
  }

  render() {
    const {
      style,
      backgroundStyle,
      onPressBackground,
      textStyle,
      numberOfLines,
    } = this.props;

    const {
      showStyle = {},
      showBackgroundStyle = {},
      showTextStyle = {},
    } = this.showConfig || {};

    return (
      <Modal visible={this.state.visible} animationType={'fade'} transparent onRequestClose={() => { }}>
        <TouchableOpacity style={[appStyles.centerFlex, styles.bg, backgroundStyle, showBackgroundStyle]} activeOpacity={1} onPress={onPressBackground}>
          <View style={[styles.toast, style, showStyle]}>
            <Text style={[styles.text, textStyle, showTextStyle]} numberOfLines={numberOfLines}>{this.state.text}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  toast: {
    width: px2dp(600),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: px2dp(30),
    paddingHorizontal: px2dp(60),
    paddingVertical: px2dp(26),
    minHeight: px2dp(80),
    position: 'relative',
  },
  text: {
    fontSize: px2dp(28),
    lineHeight: px2dp(40),
    textAlign: 'center',
    color: Theme.white,
  },
});

export default Toast;
