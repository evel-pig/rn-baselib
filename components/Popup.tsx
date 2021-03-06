import React, { Component, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native';
import appStyles, { Theme } from '../styles';
import * as Animatable from 'react-native-animatable';

export interface PopupBtnProps {
  /** 按钮点击回调 */
  onPress?: () => void;
  /** 按钮文字 */
  title?: string;
  /** 按钮父控件样式 */
  titleViewStyle?: StyleProp<ViewStyle>;
  /** 按钮文字样式 */
  titleStyle?: StyleProp<TextStyle>;
}

export interface PopupProps {
  /** 标题 */
  title?: string;
  /** 标题父控件样式 */
  titleViewStyle?: StyleProp<ViewStyle>;
  /** 标题文字样式 */
  titleStyle?: StyleProp<TextStyle>;
  /** 内容, 字符串文字或者字符串数组 */
  content?: string | string[];
  /** 内容父控件样式 */
  contentViewStyle?: StyleProp<ViewStyle>;
  /** 内容文字样式 */
  contentStyle?: StyleProp<TextStyle>;
  /** 传入自定义内容区域控件 */
  childView?: ReactNode;
  /** 右边确定按钮 */
  okBtn?: PopupBtnProps;
  /** 左边取消按钮 */
  cancelBtn?: PopupBtnProps;
  /** 是否一直保持显示不消失, 默认false */
  keepShow?: boolean;
  /** alert窗体样式 */
  style?: StyleProp<ViewStyle>;
  /** 背景样式 */
  bgStyle?: StyleProp<ViewStyle>;
  /** 右边按钮默认样式 */
  defaultOkBtnStyle?: StyleProp<ViewStyle>;
  /** 左边按钮默认样式 */
  defaultCancelBtnStyle?: StyleProp<ViewStyle>;
  /** 右边按钮文字默认样式 */
  defaultOkBtnTextStyle?: StyleProp<TextStyle>;
  /** 左边按钮文字默认样式 */
  defaultCancelBtnTextStyle?: StyleProp<TextStyle>;
  /** 渐变显示小时时长, 默认250 */
  fadeAnimTime?: number;
}

interface PopupState extends PopupProps {
  visible: boolean;
  [key: string]: any;
}

class Popup extends Component<PopupProps, PopupState> {
  showEmitter: EmitterSubscription;
  bgView: Animatable.View;

  static defaultProps = {
    keepShow: false,
    fadeAnimTime: 250,
  };

  static show(popupConfig: PopupProps = {}) {
    DeviceEventEmitter.emit('POPUP_SHOW', popupConfig);
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: null,
      titleViewStyle: null,
      titleStyle: null,
      content: null,
      contentViewStyle: null,
      contentStyle: null,
      childView: null,
      okBtn: null,
      cancelBtn: null,
      keepShow: false,
      style: null,
      bgStyle: null,
      defaultOkBtnStyle: null,
      defaultCancelBtnStyle: null,
      defaultOkBtnTextStyle: null,
      defaultCancelBtnTextStyle: null,
      ...props,
    };
  }

  componentDidMount() {
    this.showEmitter = DeviceEventEmitter.addListener('POPUP_SHOW', (data: PopupProps = {}) => {
      this.setState({ ...data, visible: true }, () => {
        this.bgView.fadeIn();
      });
    });
  }

  componentWillUnmount() {
    if (this.showEmitter) this.showEmitter.remove();
  }

  _close = () => {
    this.bgView.fadeOut();
    setTimeout(() => {
      this.setState({
        visible: false,
        title: null,
        titleViewStyle: null,
        titleStyle: null,
        content: null,
        contentViewStyle: null,
        contentStyle: null,
        childView: null,
        okBtn: null,
        cancelBtn: null,
        keepShow: null,
        style: null,
        bgStyle: null,
        defaultOkBtnStyle: null,
        defaultCancelBtnStyle: null,
        defaultOkBtnTextStyle: null,
        defaultCancelBtnTextStyle: null,
        ...this.props,
      });
    }, this.props.fadeAnimTime + 50);
  }

  _okOnPress = () => {
    const { okBtn, keepShow } = this.state;
    if (!keepShow) this._close();
    if (okBtn && okBtn.onPress && okBtn.onPress instanceof Function) {
      okBtn.onPress();
    }
  }

  _cancelOnPress = () => {
    const { cancelBtn, keepShow } = this.state;
    if (!keepShow) this._close();
    if (cancelBtn && cancelBtn.onPress && cancelBtn.onPress instanceof Function) {
      cancelBtn.onPress();
    }
  }

  _renderTitle = () => {
    const { title, content, titleViewStyle, titleStyle } = this.state;
    if (!title) return null;
    return (
      <View style={[{ marginBottom: content ? px2dp(30) : 0 }, titleViewStyle]}>
        <Text style={[appStyles.font_36, styles.title, titleStyle]} numberOfLines={1}>{title}</Text>
      </View>
    );
  }

  _renderContent = () => {
    const { content, contentStyle, childView } = this.state;
    if (childView) {
      return childView;
    } else if (content) {
      return (
        <View>
          {
            Array.isArray(content) ?
              content.map((str, index) => (
                <Text key={index} style={[appStyles.font_30, { lineHeight: px2dp(40) }, contentStyle]}>{str}</Text>
              )) :
              <Text style={[appStyles.font_30, { lineHeight: px2dp(40) }, contentStyle]}>{content}</Text>
          }
        </View >
      );
    }
    return null;
  }

  _renderButtons = () => {
    const {
      okBtn,
      cancelBtn,
      defaultOkBtnStyle,
      defaultCancelBtnStyle,
      defaultOkBtnTextStyle,
      defaultCancelBtnTextStyle,
    } = this.state;

    if (okBtn || cancelBtn) {
      return (
        <View style={styles.buttonsContainer}>
          {cancelBtn ? <ButtonView
            onPress={this._cancelOnPress}
            title={cancelBtn.title || '取消'}
            style={[okBtn ? appStyles.borderRight : {}, defaultCancelBtnStyle, cancelBtn.titleViewStyle]}
            textStyle={[{ color: Theme.fontColor_99 }, defaultCancelBtnTextStyle, cancelBtn.titleStyle]}
          /> : null}
          {okBtn ? <ButtonView
            onPress={this._okOnPress}
            title={okBtn.title || '确定'}
            style={[defaultOkBtnStyle, okBtn.titleViewStyle]}
            textStyle={[defaultOkBtnTextStyle, okBtn.titleStyle]}
          /> : null}
        </View >
      );
    } else {
      return null;
    }
  }

  render() {
    if (!this.state.visible) return <View />;
    const {
      bgStyle,
      style,
      contentViewStyle,
    } = this.state;
    const { fadeAnimTime } = this.props;
    return (
      <Animatable.View duration={fadeAnimTime} ref={r => this.bgView = r} easing={'ease-in-out'} style={[styles.container, bgStyle]} useNativeDriver>
        <Animatable.View animation={'bounceIn'} duration={fadeAnimTime} delay={fadeAnimTime * 0.2} style={[styles.alert, style]} useNativeDriver>
          <View style={[appStyles.borderBottom, appStyles.center, styles.topView, contentViewStyle]}>
            {this._renderTitle()}
            {this._renderContent()}
          </View>
          {this._renderButtons()}
        </Animatable.View>
      </Animatable.View>
    );
  }
}

const ButtonView = ({ onPress, title = '', style, textStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[appStyles.centerFlex, style]}
    >
      <Text style={[{ color: Theme.theme, fontSize: px2dp(30) }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  } as ViewStyle,
  alert: {
    overflow: 'hidden',
    backgroundColor: Theme.white,
    width: px2dp(540),
    borderRadius: px2dp(20),
  } as ViewStyle,
  topView: {
    padding: px2dp(30),
    minHeight: px2dp(150),
  } as ViewStyle,
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  } as TextStyle,
  buttonsContainer: {
    flexDirection: 'row',
    minHeight: px2dp(90),
  } as ViewStyle,
});

export default Popup;
