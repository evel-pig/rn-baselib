import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  EmitterSubscription,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Spinkit from 'react-native-spinkit';
import appStyles, { Theme } from '../styles';

type SpinnerType = 'CircleFlip' | 'Bounce' | 'Wave' | 'WanderingCubes' | 'Pulse' | 'ChasingDots' | 'ThreeBounce' | 'Circle' | '9CubeGrid' | 'FadingCircle' | 'FadingCircleAlt';

export interface LoadingConfig {
  /** 是否显示 */
  visible?: boolean;
  /** 文字内容 */
  showText?: string;
  /** toast样式 */
  showStyle?: StyleProp<ViewStyle>;
  /** 背景样式 */
  showBackgroundStyle?: StyleProp<ViewStyle>;
  /** 展示的文字样式 */
  showTextStyle?: StyleProp<TextStyle>;
  /** 旋转控件颜色, 默认白色 */
  showSpinnerColor?: string;
  /** 旋转控件大小, 默认px2dp(70) */
  showSpinnerSize?: number;
  /** 动画类型, 默认 Circle */
  showSpinnerType?: SpinnerType;
  /** 显示的时长, 默认30秒 */
  showTime?: number;
}

interface LoadingProps extends LoadingConfig {
  /** 是否一直保持显示, 默认false */
  keepVisible?: boolean;
  /** 点击背景调用函数 */
  onPressBackground?: (e?: any) => void;
  /** toast样式 */
  style?: StyleProp<ViewStyle>;
  /** 背景样式 */
  backgroundStyle?: StyleProp<ViewStyle>;
  /** 展示的文字样式 */
  textStyle?: StyleProp<TextStyle>;
  /** 旋转控件颜色, 默认白色 */
  spinnerColor?: string;
  /** 旋转控件大小, 默认px2dp(70) */
  spinnerSize?: number;
  /** 动画类型, 默认 Circle */
  spinnerType?: SpinnerType;
  /** 显示了回调 */
  showCallback?: () => void;
  /** 隐藏了回调 */
  hideCallback?: () => void;
}

interface LoadingOwnState extends LoadingConfig, LoadingProps {

}

class Loading extends Component<LoadingProps, LoadingOwnState> {
  showEmitter: EmitterSubscription;
  hideEmitter: EmitterSubscription;
  timer: number;
  index: number;

  static defaultProps = {
    keepVisible: false,
    spinnerColor: Theme.white,
    spinnerSize: px2dp(70),
    spinnerType: 'Circle',
  };

  /**
   * show Loading alert
   *
   * @static
   * @param {ToastConfig} toastConfig
   * @memberof Toast
   */
  static show(toastConfig: LoadingConfig = {}) {
    DeviceEventEmitter.emit('LOADING_SHOW', {
      ...toastConfig,
      visible: true,
    });
  }

  /**
   *  hide Loading alert
   *
   * @static
   * @param {ToastConfig} toastConfig
   * @memberof Loading
   */
  static hide(toastConfig: LoadingConfig = {}) {
    DeviceEventEmitter.emit('LOADING_HIDE', {
      ...toastConfig,
      visible: false,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
    };
    this.index = 0;
  }

  componentDidMount() {
    this.showEmitter = DeviceEventEmitter.addListener('LOADING_SHOW', (data: LoadingConfig) => {
      if (!this.state.visible) {
        this.index++;
        this.setState(data);
        if (this.props.showCallback && typeof this.props.showCallback === 'function') {
          this.props.showCallback();
        }
        this.forceHide(data.showTime);
      }
    });

    this.hideEmitter = DeviceEventEmitter.addListener('LOADING_HIDE', (data: LoadingConfig) => {
      if (this.index > 0) {
        this.index--;
      }
      if (this.state.visible && this.index === 0) {
        this.hide();
        this.clearTimer();
      }
    });
  }

  componentWillUnmount() {
    if (this.showEmitter) this.showEmitter.remove();
    if (this.hideEmitter) this.hideEmitter.remove();
    if (this.timer) clearTimeout(this.timer);
  }

  forceHide = (t = 30000) => {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.index = 0;
      this.hide();
    }, t);
  }

  hide = () => {
    this.setState({
      visible: false,
      showText: null,
      showStyle: null,
      showBackgroundStyle: null,
      showTextStyle: null,
      showSpinnerColor: null,
      showSpinnerSize: null,
      showSpinnerType: null,
    });
    if (this.props.hideCallback && typeof this.props.hideCallback === 'function') {
      this.props.hideCallback();
    }
  }

  clearTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const {
      keepVisible,
      onPressBackground,
      style,
      backgroundStyle,
      textStyle,
      spinnerColor,
      spinnerSize,
      spinnerType,
      showText,
      showStyle,
      showBackgroundStyle,
      showTextStyle,
      showSpinnerColor,
      showSpinnerSize,
      showSpinnerType,
    } = this.state;

    if (!this.state.visible && !keepVisible) return <View />;

    return (
      <TouchableOpacity style={[styles.modal, backgroundStyle, backgroundStyle, showBackgroundStyle]} activeOpacity={1} onPress={onPressBackground}>
        <View style={[styles.loading, style, showStyle]}>
          <Spinkit type={showSpinnerType || spinnerType} color={showSpinnerColor || spinnerColor} size={showSpinnerSize || spinnerSize} />
          <Text style={[appStyles.font_30, styles.text, textStyle, showTextStyle]}>
            {showText || 'Loading...'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    zIndex: 999,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  } as ViewStyle,
  loading: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: px2dp(300),
    height: px2dp(200),
    borderRadius: px2dp(20),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  text: {
    marginTop: px2dp(30),
    color: Theme.white,
  } as TextStyle,
});

export default Loading;
