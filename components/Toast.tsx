import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  DeviceEventEmitter,
  EmitterSubscription,
  StyleProp,
  Animated,
  Easing,
} from 'react-native';
import appStyles, { Theme } from '../styles';

export interface ToastConfig {
  /* 提示文案 */
  des: string;
  /* 显示时长(默认2000毫秒) */
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
  /** 显示时长, 默认2000毫秒 */
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
  /** 渐变显示小时时长, 默认250 */
  fadeAnimTime?: number;
}

interface ToastState {
  visible: boolean;
  text: string;
  fadeAnim: any;
}

class Toast extends Component<ToastProps, ToastState> {
  emitter: EmitterSubscription;
  timer: number;
  showConfig: ToastConfig;
  scaleAnim: any = new Animated.Value(1);

  static defaultProps = {
    showTime: 2000,
    numberOfLines: 4,
    fadeAnimTime: 250,
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
      fadeAnim: new Animated.Value(0),
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

  componentWillUnmount() {
    if (this.emitter) this.emitter.remove();
    if (this.timer) clearTimeout(this.timer);
  }

  show = (time = this.props.showTime, callback = () => { }) => {
    this._showAnimat();
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this._hideAnimat();
      setTimeout(() => {
        this.setState({ visible: false, text: '' }, callback);
        this.showConfig = null;
      }, this.props.fadeAnimTime + 50);
    }, time);
  }

  _showAnimat = () => {
    this.scaleAnim.setValue(0.8);
    Animated.parallel([
      Animated.timing(
        this.state.fadeAnim, {
          toValue: 1,
          easing: Easing.linear,
          duration: this.props.fadeAnimTime,
        },
      ),
      Animated.spring(
        this.scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 30,
        },
      ),
    ]).start();
  }

  _hideAnimat = () => {
    Animated.timing(
      this.state.fadeAnim, {
        toValue: 0,
        easing: Easing.linear,
        duration: this.props.fadeAnimTime,
      },
    ).start();
  }

  render() {
    if (!this.state.visible) return <View />;
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
      <TouchableOpacity style={[styles.bg, backgroundStyle, showBackgroundStyle]} activeOpacity={1} onPress={onPressBackground}>
        <Animated.View style={[styles.toast, { opacity: this.state.fadeAnim, transform: [{ scale: this.scaleAnim }] }, style, showStyle] as StyleProp<ViewStyle>}>
          <Text style={[styles.text, textStyle, showTextStyle]} numberOfLines={numberOfLines}>{this.state.text}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  } as ViewStyle,
  toast: {
    width: px2dp(600),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: px2dp(30),
    paddingHorizontal: px2dp(60),
    paddingVertical: px2dp(26),
    minHeight: px2dp(80),
    marginTop: Theme.DeviceHeight * 0.25,
  } as ViewStyle,
  text: {
    fontSize: px2dp(28),
    lineHeight: px2dp(40),
    textAlign: 'center',
    color: Theme.white,
  } as TextStyle,
});

export default Toast;
