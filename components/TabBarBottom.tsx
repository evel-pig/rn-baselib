import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ImageStyle,
  ViewStyle,
  ImageSourcePropType,
  StyleProp,
} from 'react-native';
import { TabBarBottomProps } from 'react-navigation';
import { Theme } from '../styles';

interface TabBarResourcesProps {
  /** 标题 */
  title: string[];
  /** 选中时的icon资源 */
  iconActive: ImageSourcePropType[];
  /** 没选中时的icon资源 */
  iconInActive: ImageSourcePropType[];
}

interface TabBarProps extends TabBarBottomProps {
  /** 数据资源数组 */
  resources: TabBarResourcesProps[];
  /** 底部分隔线颜色, 默认 borderColor */
  topLineColor?: string;
  /** 选中时的标题颜色, 默认 theme */
  activeTitleColor: string;
  /** 整体样式 */
  style?: ViewStyle;
  /** 标题样式 */
  titleStyle?: StyleProp<TextStyle>;
  /** icon样式 */
  iconStyle?: StyleProp<ImageStyle>;
  /** tab高度 */
  height?: number;
}

interface TabBarBottomOwnState {
}

class TabBarBottom extends Component<TabBarProps, TabBarBottomOwnState> {
  tabConfigs: any[] = new Array();

  static defaultProps = {
    topLineColor: Theme.borderColor,
    activeTitleColor: Theme.theme,
    height: px2dp(98),
  };

  constructor(props) {
    super(props);

    props.resources.forEach((item, idx) => {
      this.tabConfigs.push({
        name: item.title,
        activeIcon: item.iconActive || null,
        inActiveIcon: item.iconInActive || null,
      });
    });
  }

  _changeIndex = (routeName) => {
    // this.props.jumpTo(key);
    this.props.navigation.navigate({ routeName });
  }

  render() {
    const { navigation, titleStyle, iconStyle, style, topLineColor, activeTitleColor, height } = this.props;
    const tabRoutes = navigation.state.routes || [];
    const tabs = tabRoutes.map((item, index) => {
      return {
        ...item,
        ...this.tabConfigs[index],
      };
    });

    const currentIndex = navigation.state.index || 0;

    return (
      <View style={[styles.tab, style, { borderTopColor: topLineColor }]}>
        {tabs.map((item, index) => (
          <TouchableOpacity
            key={item.routeName}
            style={[styles.item, { height: height }]}
            onPress={() => { this._changeIndex(item.routeName); }}
            activeOpacity={0.6}
          >
            <Image source={currentIndex === index ? item.activeIcon : item.inActiveIcon} style={[styles.img, iconStyle]} />
            <Text style={[styles.text, titleStyle, { color: currentIndex === index ? activeTitleColor : Theme.fontColor }]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Theme.white,
    paddingBottom: Theme.iPhoneXBottom,
    borderTopWidth: Theme.borderWidth,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: px2dp(44),
    height: px2dp(44),
  },
  text: {
    marginTop: px2dp(8),
    fontSize: px2dp(20),
  },
});

export default TabBarBottom;
