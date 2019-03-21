import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  StyleProp,
  ViewStyle,
  Animated,
  Easing,
  TextStyle,
} from 'react-native';
import appStyles, { Theme } from '../styles';
import { Button } from './buttons';

const globalPadding = px2dp(40);

export interface ProgressBarProps {
  /** 当前进度 */
  progress: number;
  /** 进度条颜色, 默认theme */
  progressColor?: string;
  /** 进度条背景颜色, 默认fontColor_cc */
  progressBgColor?: string;
  /** 进度变化动画时长, 默认100毫秒 */
  progressAniDuration?: number;
  /** 进度条样式 */
  progressStyle?: StyleProp<ViewStyle>;
}

class ProgressBar extends Component<ProgressBarProps, any> {
  _progressAni: any = new Animated.Value(0);
  totalWidth: number = 0;

  static defaultProps = {
    progress: 0,
    progressColor: Theme.theme,
    progressBgColor: Theme.fontColor_cc,
    progressAniDuration: 100,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.progress !== this.props.progress) {
      this._startAniProgress();
    }
  }

  _startAniProgress() {
    const { progress, progressAniDuration } = this.props;
    // console.log(`动画进度: ${progress}`);
    if (progress >= 0 && this.totalWidth !== 0) {
      Animated.timing(this._progressAni, {
        toValue: progress * this.totalWidth,
        duration: progressAniDuration,
        easing: Easing.linear,
      }).start();
    }
  }

  _onLayout = ({ nativeEvent: { layout: { width } } }) => {
    if (width > 0 && this.totalWidth !== width) {
      this.totalWidth = width;
      this._startAniProgress();
    }
  }

  render() {
    const h = px2dp(20);
    const {
      progressStyle,
      progressBgColor,
      progressColor,
    } = this.props;

    return (
      <View
        style={[{ height: h, borderRadius: 0.5 * h, backgroundColor: progressBgColor }, progressStyle]}
        onLayout={(e) => this._onLayout(e)}
      >
        <Animated.View style={[styles.lineAni, { width: this._progressAni, borderRadius: 0.5 * h, backgroundColor: progressColor }]} />
      </View>
    );
  }
}

export interface CodePushModalProps extends ProgressBarProps {
  /** 组件样式 */
  style?: StyleProp<ViewStyle>;
  /** 弹窗样式 */
  alertStyle?: StyleProp<ViewStyle>;
  /** 弹窗标题样式 */
  alertTitleStyle?: StyleProp<TextStyle>;
  /** 弹窗标题, 默认是 更新提示 */
  alertTitle?: string;
  /** 弹窗内容样式 */
  alertDesStyle?: StyleProp<TextStyle>;
  /** 弹窗内容, 默认是 有重要内容需要立即更新! */
  alertDes?: string;
  /** 弹窗下载中提示文字样式 */
  downloadingDesStyle?: StyleProp<TextStyle>;
  /** 弹窗下载中提示文字, 默认是 极速更新中，请稍等... */
  downloadingDes?: string;
  /** 右边按钮样式 */
  okBtnStyle?: StyleProp<ViewStyle>;
  /** 左边按钮样式 */
  cancelBtnStyle?: StyleProp<ViewStyle>;
  /** 右边按钮文字样式 */
  okBtnTextStyle?: StyleProp<TextStyle>;
  /** 左边按钮文字样式 */
  cancelBtnTextStyle?: StyleProp<TextStyle>;
  /** 右边按钮文字, 默认 立即更新 */
  okBtnText?: string;
  /** 左边按钮文字, 默认 下次再说 */
  cancelBtnText?: string;
  /** 右边按钮点击回调 */
  okBtnOnPress?: (e?: any) => void;
  /** 左边边按钮点击回调 */
  cancelBtnOnPress?: (e?: any) => void;
  /** 是否强制更新, 默认false */
  isMandatory: boolean;
  /** 弹窗是否显示, 默认false */
  modalVisible: boolean;
}

interface CodePushModalState {
  immediateUpdate: boolean;
}

class CodePushModal extends Component<CodePushModalProps, CodePushModalState> {
  static defaultProps = {
    buttonColor: Theme.theme,
    buttonTextColor: Theme.white,
    alertTitle: '更新提示',
    alertDes: '',
    downloadingDes: '极速更新中，请稍等...',
    okBtnText: '立即更新',
    cancelBtnText: '下次再说',
    isMandatory: false,
    modalVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      immediateUpdate: false,  // 是否是更新中
    };
  }

  _renderButton = () => {
    const {
      cancelBtnStyle,
      cancelBtnTextStyle,
      cancelBtnText,
      okBtnStyle,
      okBtnTextStyle,
      okBtnText,
      isMandatory,
      okBtnOnPress,
      cancelBtnOnPress,
      // progress,
    } = this.props;

    // console.log(progress);

    return (
      <View style={{ flexDirection: 'row' }}>
        {
          isMandatory ?
            null :
            <Button
              onPress={cancelBtnOnPress}
              title={cancelBtnText}
              style={[styles.btn, { marginRight: globalPadding }, cancelBtnStyle]}
              titleStyle={cancelBtnTextStyle}
            />
        }
        <Button
          onPress={() => { this.setState({ immediateUpdate: true }); if (okBtnOnPress) okBtnOnPress(); }}
          title={okBtnText}
          style={[styles.btn, okBtnStyle]}
          titleStyle={okBtnTextStyle}
        />
      </View>
    );
  }

  _renderAlert = () => {
    const {
      alertStyle,
      alertTitleStyle,
      alertTitle,
      alertDesStyle,
      alertDes,
      downloadingDesStyle,
      downloadingDes,
      progress,
      progressColor,
      progressBgColor,
      progressAniDuration,
      progressStyle,
    } = this.props;
    return (
      <View style={[styles.alert, alertStyle]}>
        <Text style={[styles.title, alertTitleStyle]} numberOfLines={1}>{alertTitle}</Text>
        <Text style={[styles.des, alertDesStyle]}>{alertDes || '有重要内容需要立即在线更新!'}</Text>
        {
          this.state.immediateUpdate ?
            <View style={styles.downloadContainer}>
              <ProgressBar
                progress={progress}
                progressColor={progressColor}
                progressBgColor={progressBgColor}
                progressAniDuration={progressAniDuration}
                progressStyle={[{ width: Theme.DeviceWidth - (4 * globalPadding + px2dp(20)) }, progressStyle]}
              />
              <Text style={[styles.loadingStr, downloadingDesStyle]}>{downloadingDes}</Text>
            </View> :
            this._renderButton()
        }
      </View>
    );
  }

  render() {
    const { style, modalVisible } = this.props;
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={modalVisible}
        onRequestClose={() => { }}
      >
        <View style={[appStyles.centerFlex, styles.modal, style]}>
          {this._renderAlert()}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    paddingHorizontal: globalPadding,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  alert: {
    paddingHorizontal: globalPadding,
    paddingVertical: globalPadding,
    backgroundColor: Theme.white,
    alignItems: 'center',
    borderRadius: px2dp(20),
  },
  title: {
    fontWeight: 'bold',
    fontSize: px2dp(36),
    color: Theme.fontColor,
    marginBottom: globalPadding,
  },
  des: {
    lineHeight: px2dp(40),
    fontSize: px2dp(30),
    color: Theme.fontColor_66,
    marginBottom: globalPadding,
  },
  loadingStr: {
    fontSize: px2dp(24),
    marginTop: px2dp(20),
    color: Theme.fontColor_66,
  },
  downloadContainer: {
    minHeight: px2dp(90),
    alignItems: 'center',
    justifyContent: 'flex-end',
  } as ViewStyle,
  btn: {
    flex: 1,
    height: px2dp(90),
    borderRadius: px2dp(45),
  },
  lineAni: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
});

export default CodePushModal;
