import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ImageStyle,
  StyleSheet,
  ImageSourcePropType,
  ImageResizeMode,
  ViewStyle,
} from 'react-native';
import Swiper, { SwiperProps } from 'react-native-swiper';
import { Theme } from '../styles';

export interface AdProps {
  /** 图片资源 */
  imageSource?: ImageSourcePropType;
  /** 网络图片链接 */
  imageUrl?: string;
  [key: string]: any;
}

export interface AdSwiperProps extends SwiperProps {
  /** 图片数据数组 */
  adList: AdProps[];
  /** item样式 */
  itemStyle?: StyleProp<ImageStyle>;
  /** 点击回调, 返回数组索引 */
  onPress?: (index: number) => void;
  /** 图片控件拉伸模式, 默认stretch */
  resizeMode?: ImageResizeMode;
  /** 点击透明度, 默认0.6 */
  activeOpacity?: number;
}

const AdSwiper = (props: AdSwiperProps) => {
  const {
    height = px2dp(280),
    adList = [],
    itemStyle,
    onPress,
    style,
    autoplayTimeout = 5,
    autoplay = true,
    removeClippedSubviews = false,
    resizeMode = 'stretch',
    activeOpacity = 0.6,
    paginationStyle,
    dotStyle,
    activeDotStyle,
    width = Theme.DeviceWidth,
  } = props;

  if (adList.length === 0) return <View style={style} />;

  const tmpStyles = {
    paginationStyle: {
      justifyContent: 'flex-end',
      marginBottom: px2dp(-30),
      marginRight: px2dp(24),
      ...(paginationStyle || {}),
    } as ViewStyle,
    dotStyle: {
      backgroundColor: Theme.fontColor_e5,
      width: px2dp(12),
      height: px2dp(12),
      borderRadius: px2dp(8),
      ...(dotStyle || {}),
    } as ViewStyle,
    activeDotStyle: {
      backgroundColor: Theme.yellow,
      width: px2dp(12),
      height: px2dp(12),
      borderRadius: px2dp(8),
      ...(activeDotStyle || {}),
    } as ViewStyle,
  };

  return (
    <Swiper
      style={style}
      key={'adSwiper'}
      height={height}
      width={width}
      paginationStyle={tmpStyles.paginationStyle}
      dotStyle={tmpStyles.dotStyle}
      activeDotStyle={tmpStyles.activeDotStyle}
      autoplayTimeout={autoplayTimeout}
      autoplay={autoplay}
      removeClippedSubviews={removeClippedSubviews}
      {...this.props}
    >
      {adList.map((item, index) => (
        <AdListItem
          key={index}
          source={item.imageSource || { uri: item.imageUrl }}
          imgHeight={height}
          imgWidth={width}
          style={itemStyle}
          resizeMode={resizeMode}
          activeOpacity={activeOpacity}
          onPress={() => onPress(index)}
        />
      ))}
    </Swiper>
  );
};

const AdListItem = ({ onPress, source, imgHeight, imgWidth, style, resizeMode, activeOpacity }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity} style={[styles.item, style]}>
      <Image
        source={source}
        style={{ width: imgWidth, height: imgHeight }}
        resizeMode={resizeMode}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.white,
  },
});

export default AdSwiper;
