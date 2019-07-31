import React, { Component, ReactNode } from 'react';
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
  DeviceEventEmitter,
  EmitterSubscription,
  Animated,
  Easing,
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
  /** 非选中时的标题颜色, 默认 fontColor */
  inactiveTitleColor: string;
  /** 整体样式 */
  style?: ViewStyle;
  /** 标题样式 */
  titleStyle?: StyleProp<TextStyle>;
  /** icon样式 */
  iconStyle?: StyleProp<ImageStyle>;
  /** tab高度 */
  height?: number;
  /** 背景组件 */
  backgroundComponent?: ReactNode;
  /** tab点击回调函数 */
  onPress: (index: number, routeName: string, navigation) => void;
}

interface TabBarBottomOwnState {
  visible: boolean;
  scaleAnim: any;
}

const showNoti = 'TABBARBOTTOM_SHOW';
const hideNoti = 'TABBARBOTTOM_HIDE';
const H = px2dp(100) + Theme.iPhoneXBottom;

class TabBarBottom extends Component<TabBarProps, TabBarBottomOwnState> {
  tabConfigs: any[] = new Array();
  showEmitter: EmitterSubscription;
  hideEmitter: EmitterSubscription;
  hideAnim: any = new Animated.Value(0);

  static defaultProps = {
    topLineColor: Theme.borderColor,
    activeTitleColor: Theme.theme,
    inactiveTitleColor: Theme.fontColor,
    height: px2dp(100),
  };

  /**
   * show TabBar
   */
  static show() {
    DeviceEventEmitter.emit(showNoti);
  }

  /**
   * hide TabBar
   */
  static hide() {
    DeviceEventEmitter.emit(hideNoti);
  }

  constructor(props) {
    super(props);

    props.resources.forEach((item, idx) => {
      this.tabConfigs.push({
        name: item.title,
        activeIcon: item.iconActive || null,
        inActiveIcon: item.iconInActive || null,
      });
    });

    this.state = {
      visible: true,
      scaleAnim: new Animated.Value(1),
    };
  }

  componentDidMount() {
    this.showEmitter = DeviceEventEmitter.addListener(showNoti, () => {
      if (!this.state.visible) {
        this.setState({ visible: true }, () => {
          this._hideAnima(0);
        });
      }
    });
    this.hideEmitter = DeviceEventEmitter.addListener(hideNoti, () => {
      if (this.state.visible) {
        this.setState({ visible: false }, () => {
          this._hideAnima(-H);
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.showEmitter) this.showEmitter.remove();
    if (this.hideEmitter) this.hideEmitter.remove();
  }

  _hideAnima = (height) => {
    Animated.timing(
      this.hideAnim, {
        toValue: height,
        duration: 200,
        easing: Easing.ease,
      },
    ).start();
  }

  _bounceAnima = () => {
    this.setState({ scaleAnim: new Animated.Value(0.9) }, () => {
      Animated.spring(
        this.state.scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 5,
          speed: 5,
        },
      ).start(() => {
        this.setState({ scaleAnim: new Animated.Value(1) });
      });
    });
  }

  _changeIndex = (index, routeName) => {
    this._bounceAnima();

    if (this.props.onPress) {
      this.props.onPress(index, routeName, this.props.navigation);
    } else {
      this.props.navigation.navigate({ routeName });
    }
  }

  render() {
    const { navigation, titleStyle, iconStyle, style, topLineColor, activeTitleColor, inactiveTitleColor, height, backgroundComponent } = this.props;
    const tabRoutes = navigation.state.routes || [];
    const tabs = tabRoutes.map((item, index) => {
      return {
        ...item,
        ...this.tabConfigs[index],
      };
    });

    const currentIndex = navigation.state.index || 0;
    return (
      <Animated.View style={[styles.tab, style, { borderTopColor: topLineColor, bottom: this.hideAnim }]}>
        {backgroundComponent}
        {tabs.map((item, index) => {
          let isSelected = currentIndex === index;
          return (
            <TouchableOpacity
              key={item.routeName}
              style={[styles.item, { height: height }]}
              onPress={() => { this._changeIndex(index, item.routeName); }}
              activeOpacity={0.8}
            >
              <Animated.Image source={isSelected ? item.activeIcon : item.inActiveIcon} style={[styles.img, { transform: [{ scale: isSelected ? this.state.scaleAnim : 1 }] }, iconStyle]} />
              <Text style={[styles.text, titleStyle, { color: isSelected ? activeTitleColor : inactiveTitleColor }]} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: H,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: Theme.white,
    borderTopWidth: Theme.borderWidth,
  } as ViewStyle,
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
