import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DeviceEventEmitter,
  EmitterSubscription,
  StyleProp,
} from 'react-native';
import { Theme } from '../styles';
import * as Animatable from 'react-native-animatable';

export interface ToastConfig {
  /* 提示文案 */
  des: string;
  /* 显示时长(默认2000毫秒) */
  time?: number;
  /** toast消失后的回调 */
  callback?: () => void;
  /** 自定义这一次toast样式 */
  showStyle?: StyleProp<ViewStyle>;
  /** 自定义这一次展示的文字样式 */
  showTextStyle?: StyleProp<TextStyle>;
}

export interface ToastProps {
  /** 显示时长, 默认2000毫秒 */
  showTime?: number;
  /** 文字最多行数, 默认4行 */
  numberOfLines?: number;
  /** toast样式 */
  style?: StyleProp<ViewStyle>;
  /** 展示的文字样式 */
  textStyle?: StyleProp<TextStyle>;
  /** 渐变动画时长, 默认250 */
  fadeAnimTime?: number;
}

interface ToastState {
  visible: boolean;
  text: string;
}

const customFadeInDown = {
  from: {
    opacity: 0,
    ['translateY']: px2dp(-100),
  },
  to: {
    opacity: 1,
    ['translateY']: 0,
  },
};

class Toast extends Component<ToastProps, ToastState> {
  emitter: EmitterSubscription;
  timer: NodeJS.Timer;
  showConfig: ToastConfig;
  view: Animatable.View;

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
    this.view.animate(customFadeInDown).then(() => {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.view.fadeOut().then(() => {
          this.setState({ visible: false, text: '' }, callback);
          this.showConfig = null;
        });
      }, time);
    });
  }

  render() {
    if (!this.state.visible) return <View />;
    const {
      style = {},
      textStyle,
      numberOfLines,
      fadeAnimTime,
    } = this.props;

    const {
      showStyle = {},
      showTextStyle = {},
    } = this.showConfig || {};

    const { width = px2dp(600) } = style;
    return (
      <Animatable.View
        ref={r => this.view = r}
        duration={fadeAnimTime}
        style={[styles.toast, style, showStyle, { width: width, left: (Theme.DeviceWidth - width) * 0.5 }]}
        useNativeDriver
      >
        <Text style={[styles.text, textStyle, showTextStyle]} numberOfLines={numberOfLines}>{this.state.text}</Text>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: px2dp(30),
    paddingHorizontal: px2dp(60),
    paddingVertical: px2dp(26),
    minHeight: px2dp(80),
    top: Theme.DeviceHeight * 0.3,
  } as ViewStyle,
  text: {
    fontSize: px2dp(28),
    lineHeight: px2dp(40),
    textAlign: 'center',
    color: Theme.white,
  } as TextStyle,
});

export default Toast;
