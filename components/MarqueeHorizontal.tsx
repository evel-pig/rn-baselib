import React, { Component } from 'react';
import { View, Animated, Easing, Text, TouchableOpacity, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import appStyles, { Theme } from '../styles';

export interface MarqueeHorizontalProps {
  /** 执行完整个动画的时间, 单位毫秒，默认 10000 */
  duration?: number;
  /** 滚动速度, 一秒钟执行多少像素的动画, 默认 40 */
  speed?: number;
  /** 滚动文本数组, 数组的item必须包含key为text的键值对, 例: [{ text : '这是滚动文本'},...] */
  textList: any[];
  /** 组件宽度, 默认 DeviceWidth */
  width: number;
  /** 组件高度, 默认 px2dp(50) */
  height: number;
  /** 滚动方向, 默认 left */
  direction?: 'left' | 'right';
  /** 是否倒叙整个字符串, 默认 false */
  reverse?: boolean;
  /** 两个item之间的间隙，默认 px2dp(20) */
  separator?: number;
  /** 组件样式 */
  style?: ViewStyle;
  /** 文字样式 */
  textStyle?: TextStyle;
  /** 点击回调函数, 带当前文字对应的数组item */
  onPress?: (e?) => void;
}

interface MarqueeHorizontalOwnState {
  animation: any;
  textList: any[];
  textWidth: number;
  viewWidth: number;
}

export default class MarqueeHorizontal extends Component<MarqueeHorizontalProps, MarqueeHorizontalOwnState> {
  animatedTransformX: any = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      animation: null,
      textList: this.props.textList || [],
      textWidth: 0,
      viewWidth: 0,
    }
  }

  static defaultProps = {
    duration: 10000,
    speed: 40,
    textList: [],
    width: Theme.DeviceWidth,
    height: px2dp(50),
    direction: 'left',
    reverse: false,
    separator: px2dp(20),
  }

  componentDidUpdate() {
    const { textWidth, viewWidth } = this.state;
    const { duration, speed, width, direction } = this.props;
    let mDuration = duration;
    if (speed && speed > 0) {
      mDuration = (width + textWidth) / speed * 1000;
    }
    if (!this.state.animation && textWidth && viewWidth) {
      this.animatedTransformX.setValue(direction == 'left' ? width : (direction == 'right' ? -textWidth : width));
      this.setState({
        animation: Animated.timing(this.animatedTransformX, {
          toValue: direction == 'left' ? -textWidth : (direction == 'right' ? width : -textWidth),
          duration: mDuration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      }, () => {
        this.state.animation && this.state.animation.start(() => {
          this.setState({
            animation: null,
          });
        });
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    let newText = nextProps.textList || [];
    let oldText = this.props.textList || [];
    if (newText !== oldText) {
      this.state.animation && this.state.animation.stop();
      this.setState({
        textList: newText,
        animation: null,
      });
    }
  }

  componentWillUnmount() {
    this.state.animation && this.state.animation.stop();
  }

  _textOnLayout = (e) => {
    const { textList, separator } = this.props;
    this.setState({
      textWidth: e.nativeEvent.layout.width + ((textList.length - 1) * separator),
    })
  }

  _viewOnLayout = (e) => {
    this.setState({
      viewWidth: e.nativeEvent.layout.width,
    })
  }

  _renderTextView(list) {
    const { textStyle, onPress, reverse, separator } = this.props;
    let itemView = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      if (reverse) {
        item.text = item.text.split("").reverse().join("");
      }
      itemView.push(
        <TouchableOpacity
          key={i}
          activeOpacity={0.9}
          onPress={() => { if (onPress) onPress(item); }}
        >
          <View style={{ flexDirection: 'row', marginRight: i < list.length - 1 ? separator : 0 }}>
            <Text style={[appStyles.font_24, textStyle]} numberOfLines={1}>{item.text}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Animated.View
        style={{ flexDirection: 'row', width: this.state.textWidth, transform: [{ translateX: this.animatedTransformX }] }}
        onLayout={(event) => this._viewOnLayout(event)}
      >
        {itemView}
      </Animated.View>
    )
  }

  _renderTextLengthView(list) {
    let { textStyle } = this.props;
    let text = '';
    for (let i = 0; i < list.length; i++) {
      text += list[i].text;
    }
    return (
      <View style={[styles.textMeasuringViewStyle, { width: list.length * 1024 }]}>
        <Text
          style={[appStyles.font_24, textStyle]}
          onLayout={(event) => this._textOnLayout(event)}
          numberOfLines={1}
        >{text}</Text>
      </View>
    )
  }

  render() {
    let { width, height, style } = this.props;
    let { textList, animation } = this.state;
    return (
      <View style={[styles.containerStyle, { width: width, height: height, opacity: (animation === undefined || animation === null) ? 0 : 1 }, style]}>
        {this._renderTextView(textList)}
        {this._renderTextLengthView(textList)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden'
  } as ViewStyle,
  textMeasuringViewStyle: {
    flexDirection: 'row',
    opacity: 1,
  } as ViewStyle,
});
