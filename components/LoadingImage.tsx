import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  ImageProps,
  Easing,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import appStyles, { Theme } from '../styles';

const UIAnimatedImage = Animated.createAnimatedComponent(Image);

export interface LoadingImageProps extends ImageProps {
  /** 指示器的尺寸型号, 默认是 small */
  indicatorSize?: 'small' | 'large';
  /** 渐变显示时间, 默认是 500 毫秒 */
  duration?: number;
  /** 整体样式 */
  containerStyle?: StyleProp<ViewStyle>;
}

interface LoadingImageState {
  loaded: boolean;
  fadeAnim: Animated.Value;
}

class LoadingImage extends Component<LoadingImageProps, LoadingImageState> {
  static defaultProps = {
    indicatorSize: 'small',
    duration: 500,
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      fadeAnim: new Animated.Value(0),
    };
  }

  _showImg = () => {
    const { fadeAnim } = this.state;
    const { duration } = this.props;
    fadeAnim.setValue(0);
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        easing: Easing.ease,
        duration: duration,
      },
    ).start();
  }

  render() {
    const { onLoad, source, style, indicatorSize, containerStyle, ...rest } = this.props;
    return (
      <View style={[appStyles.center, styles.container, containerStyle]}>
        <UIAnimatedImage
          style={[style, { opacity: this.state.fadeAnim }]}
          source={source}
          onLoad={(e) => {
            if (!this.state.loaded) this.setState({ loaded: true });
            this._showImg();
            if (onLoad) onLoad(e);
          }}
          {...rest}
        />
        {
          !this.state.loaded &&
          <ActivityIndicator
            animating
            style={styles.indicator}
            color={Theme.theme}
            size={indicatorSize}
          />
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.fontColor_e5,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default LoadingImage;
