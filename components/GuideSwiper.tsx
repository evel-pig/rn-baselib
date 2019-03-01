import React, { Component } from 'react';
import {
  View,
  Image,
  StyleProp,
  ImageStyle,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  Animated,
  Easing,
  ImageResizeMode,
  TextStyle,
} from 'react-native';
import Swiper, { SwiperProps } from 'react-native-swiper';
import GradientButton from './buttons/GradientButton';
import { Theme } from '../styles';

export interface GuideSwiperProps extends SwiperProps {
  /** 图片资源数组 */
  imageSources: ImageSourcePropType[];
  /** 点击函数 */
  onPress?: (e?: any) => void;
  /** 图片父控件样式 */
  imageContainerStyle?: StyleProp<ViewStyle>;
  /** 图片样式 */
  imageStyle?: StyleProp<ImageStyle>;
  /** 图片拉伸模式, 默认contain */
  imageResizeMode?: ImageResizeMode;
  /** 图片原图宽高比例, 默认为 750/1334 */
  imageScale?: number;
  /** 指示点父控件样式 */
  dotContainerStyle?: StyleProp<ViewStyle>;
  /** 按钮父控件样式 */
  buttonContainerStyle?: StyleProp<ViewStyle>;
  /** 按钮样式, 默认 400*90 */
  buttonStyle?: StyleProp<ViewStyle>;
  /** 按钮title样式 */
  buttonTitleStyle?: StyleProp<TextStyle>;
  /** 按钮标题, 默认是 立即体验 */
  buttonTitle?: string;
}

interface GuideSwiperOwnState {
  index: number;
  fadeAnim: Animated.Value;
}

class GuideSwiper extends Component<GuideSwiperProps, GuideSwiperOwnState> {

  static defaultProps = {
    imageScale: 750 / 1334,
    imageResizeMode : 'contain',
    height : Theme.DeviceHeight,
    width : Theme.DeviceWidth,
    imageSources: [],
    dotColor: Theme.theme,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      fadeAnim: new Animated.Value(0),
    };
  }

  _onIndexChanged = (index) => {
    this.setState({ index: index });
    Animated.timing(
      this.state.fadeAnim, {
        toValue: index === this.props.imageSources.length - 1 ? 1 : 0,
        easing: Easing.linear,
        duration: 500,
        useNativeDriver: true,
      },
    ).start();
  }

  renderSwiper = () => {
    const {
      imageSources,
      height,
      width,
      style,
      imageContainerStyle,
      imageStyle,
      imageResizeMode,
    } = this.props;

    if (imageSources.length === 0) return <View style={style} />;

    return (
      <Swiper
        style={style}
        height={height}
        width={width}
        showsPagination={false}
        loop={false}
        onIndexChanged={this._onIndexChanged}
        autoplay={false}
        {...this.props}
      >
        {imageSources.map((image, index) => (
          <View key={index} style={[styles.imgContainer, imageContainerStyle]}>
            <Image source={image} style={[styles.img, imageStyle]} resizeMode={imageResizeMode} key={index} />
          </View>
        ))}
      </Swiper>
    );
  }

  paginationView = () => {
    const {
      imageSources,
      onPress,
      imageScale,
      buttonContainerStyle,
      dotContainerStyle,
      dotStyle,
      buttonStyle,
      buttonTitleStyle,
      buttonTitle,
      dotColor,
    } = this.props;

    if (imageSources.length === 0) return <View />;

    const marginH = (Theme.DeviceHeight - Theme.DeviceWidth / imageScale) * 0.5;
    if (this.state.index === imageSources.length - 1) {
      return (
        <Animated.View style={[styles.btnContainer, { opacity: this.state.fadeAnim, bottom: px2dp(80) + marginH }, buttonContainerStyle]}>
          <GradientButton
            style={[{ width: px2dp(400) }, buttonStyle]}
            titleStyle={buttonTitleStyle}
            onPress={onPress}
            title={buttonTitle || '立即体验'}
          />
        </Animated.View>
      );
    } else {
      return (
        <View style={[styles.dotContainer, { bottom: px2dp(134) + marginH }, dotContainerStyle]}>
          {imageSources.map((image, index) => (
            <Dot key={index} style={dotStyle} color={index === this.state.index ? dotColor : Theme.fontColor_cc} />
          ))}
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderSwiper()}
        {this.paginationView()}
        {this.props.children}
      </View>
    );
  }
}

const Dot = ({ style, color }) => {
  return <View style={[styles.dot, { backgroundColor: color }, style]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Theme.white,
  },
  img: {
    width: Theme.DeviceWidth,
    height: px2dp(1334),
    backgroundColor: Theme.white,
  },
  btnContainer: {
    position: 'absolute',
  },
  dotContainer: {
    position: 'absolute',
    flexDirection: 'row',
  },
  dot: {
    width: px2dp(40),
    height: px2dp(6),
    borderRadius: px2dp(3),
    marginHorizontal: px2dp(10),
  },
});

export default GuideSwiper;
