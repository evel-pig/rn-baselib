import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  EmitterSubscription,
  StyleSheet,
  ViewStyle,
  View,
  StyleProp,
  TextStyle,
  Insets,
} from 'react-native';
import appStyles, { Theme } from '../../styles';
import Input, { InputProps } from './Input';

interface CaptchaButtonProps {
  /** 点击回调函数 */
  captahaOnPress: (e?: any) => void;
  /** 监听接口 */
  listenerApis?: string[];
  /** 按钮是否不能能点击, 默认false */
  buttonDisabled?: boolean;
  /** 按钮整体样式 */
  captchaButtonStyle?: StyleProp<ViewStyle>;
  /** 按钮文字样式 */
  captchaButtonTextStyle?: StyleProp<TextStyle>;
  /** 倒计时时文字颜色, 默认 fontColor_99 */
  activityTextColor?: string;
  /** 非倒计时时文字颜色, 默认 theme */
  unactivityTextColor?: string;
  /** 倒计时时倒计数字的文字前缀, 默认是 重新获取 */
  activityText?: string;
  /** 非倒计时时文字, 默认是 获取验证码 */
  unactivityText?: string;
  /** 倒计时共倒计多少秒, 默认是60 */
  countDownTime?: number;
  /** 按钮点击外延范围, 默认{ top: px2dp(20), bottom: px2dp(20), left: 0, right: px2dp(20) } */
  hitSlop?: Insets;
  /** 点击时透明度, 默认 0.6 */
  activeOpacity?: number;
  [key: string]: any;
}

interface CaptchaButtonState {
  disabled: boolean;
  time: number;
  text: string;
}

class CaptchaButton extends Component<CaptchaButtonProps, CaptchaButtonState> {
  timer: any = null;
  events: EmitterSubscription[] = [];

  static defaultProps = {
    activityTextColor: Theme.fontColor_99,
    unactivityTextColor: Theme.theme,
    unactivityText: '获取验证码',
    activityText: '重新获取',
    listenerApis: [],
    countDownTime: 60,
    hitSlop: { top: px2dp(20), bottom: px2dp(20), left: 0, right: px2dp(20) },
    activeOpacity: 0.6,
  };

  constructor(props) {
    super(props);

    const {
      countDownTime,
      unactivityText,
    } = this.props;

    this.state = {
      disabled: false,
      time: countDownTime,
      text: unactivityText,
    };
  }

  componentDidMount() {
    const {
      listenerApis,
      countDownTime,
    } = this.props;

    this.events = listenerApis.map(name => {
      return DeviceEventEmitter.addListener(name, () => {
        if (this.state.time === countDownTime) {
          this.countdown();
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    if (this.events) {
      this.events.forEach(event => {
        event.remove();
      });
    }
  }

  _onPress = () => {
    const { captahaOnPress } = this.props;
    if (!this.state.disabled && captahaOnPress) {
      captahaOnPress();
    }
  }

  countdown = () => {
    let time = this.state.time;
    const {
      activityText,
      unactivityText,
    } = this.props;
    let timerFun = () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (time > 1) {
        time--;
        console.log(`验证码倒计时: ${time}`);
        this.setState({ time: time, text: `${activityText}(${time})`, disabled: true });
        this.timer = setTimeout(timerFun, 1000);
      } else {
        console.log(new Date());
        this.setState({ time: 60, text: unactivityText, disabled: false });
      }
    };
    timerFun();
  }

  render() {
    const {
      buttonDisabled,
      hitSlop,
      activeOpacity,
      captchaButtonStyle,
      captchaButtonTextStyle,
      activityTextColor,
      unactivityTextColor,
    } = this.props;
    const tmpDisabled = buttonDisabled || this.state.disabled;
    return (
      <TouchableOpacity
        onPress={this._onPress}
        disabled={tmpDisabled}
        activeOpacity={activeOpacity}
        style={[appStyles.center, styles.button, captchaButtonStyle]}
        hitSlop={hitSlop}
      >
        <Text style={[appStyles.font_30, { color: tmpDisabled ? activityTextColor : unactivityTextColor }, captchaButtonTextStyle]}>
          {this.state.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

interface CaptchaInputProps extends CaptchaButtonProps, InputProps {
  getInputRef?: (ref) => void;
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;
  /** 左边input组件样式 */
  inputStyle?: StyleProp<ViewStyle>;
  /** 右边button组件样式 */
  buttonStyle?: StyleProp<ViewStyle>;
  /** 中间分隔线样式 */
  separationLineStyle?: StyleProp<ViewStyle>;
}

const CaptchaInput = (props: CaptchaInputProps) => {
  const {
    getInputRef = () => { },
    style,
    inputStyle,
    separationLineStyle,
    captahaOnPress = () => { },
    listenerApis,
    buttonDisabled,
    captchaButtonStyle,
    captchaButtonTextStyle,
    activityTextColor,
    unactivityTextColor,
    activityText,
    unactivityText,
    countDownTime,
    hitSlop,
    activeOpacity,
    children,
    ...rest
  } = props;
  return (
    <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.white, height: px2dp(100) }, style]}>
      <Input
        ref={ref => getInputRef(ref)}
        style={[{ backgroundColor: 'transparent' }, inputStyle]}
        border={false}
        textAlign={'left'}
        {...rest}
      />
      <View style={[{ width: Theme.borderWidth, height: px2dp(50), backgroundColor: Theme.borderColor }, separationLineStyle]} />
      <CaptchaButton
        captahaOnPress={captahaOnPress}
        listenerApis={listenerApis}
        buttonDisabled={buttonDisabled}
        captchaButtonStyle={captchaButtonStyle}
        captchaButtonTextStyle={captchaButtonTextStyle}
        activityTextColor={activityTextColor}
        unactivityTextColor={unactivityTextColor}
        activityText={activityText}
        unactivityText={unactivityText}
        countDownTime={countDownTime}
        hitSlop={hitSlop}
        activeOpacity={activeOpacity}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: px2dp(100),
    width: px2dp(220),
  } as ViewStyle,
});

export default CaptchaInput;
