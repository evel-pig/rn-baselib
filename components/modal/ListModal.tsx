import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  View,
  Text,
  Image,
  StyleProp,
  FlatList,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import appStyle, { Theme } from '../../styles';
import BaseModal, { BaseModalProps } from './BaseModal';
import iconCheckbox from '../assets/icons/checkbox.png';

export interface ListModalProps extends BaseModalProps {
  /** 点击列表行回调, 传递列表行索引 */
  onPressListItem?: (index: number) => void;
  /** 列表控件样式 */
  listStyle?: StyleProp<ViewStyle>;
  /** 列表item样式 */
  listItemStyle?: StyleProp<ViewStyle>;
  /** 点击列表item是否消失, 默认false */
  hideWithClickListItem?: boolean;
  /** 列表item中文字样式 */
  listItemTextStyle?: StyleProp<ViewStyle>;
  /** 列表item点击时透明度, 默认0.6 */
  listItemActiveOpacity?: number;
  /** 列表item选中是否显示选中icon, 默认true */
  showSelectedIcon?: boolean;
  /** 选中的icon资源 */
  selectedIcon?: ImageSourcePropType;
  /** 选中的icon样式 */
  selectedIconStyle?: StyleProp<ImageStyle>;
  /** 列表数据, 如果是非字符串数组, 需要传哪个做标题的key值textKey */
  data: any[] | string[];
  /** 列表数据数组元素中标题的key值 */
  textKey?: string;
  /** 默认选中索引 */
  selectedIndex?: number;
  /** 是否要显示每行icon, 默认false */
  showIcon?: boolean;
  /** icon样式 */
  iconStyle?: StyleProp<ImageStyle>;
  /** 列表数据数组元素中icon的url的key值 */
  iconKey?: string;
  /** 自定义最后一行控件 */
  lastView?: React.ReactElement<any>;
}

interface ListModalState {
  showCheckboxes: boolean[];
}

class ListModal extends Component<ListModalProps, ListModalState> {
  baseModal: BaseModal;

  static defaultProps = {
    hideWithClickListItem: false,
    selectedIcon: iconCheckbox,
    listItemActiveOpacity: 0.6,
    showSelectedIcon: true,
    showIcon: false,
  };

  constructor(props) {
    super(props);

    if (!this.props.data) return;
    let arr = new Array(this.props.data.length).fill(false);
    if (props.selectedIndex !== undefined && props.selectedIndex !== null) {
      arr[props.selectedIndex] = true;
    }
    this.state = {
      showCheckboxes: arr,
    };
  }

  show = () => {
    if (this.baseModal) this.baseModal.show();
  }

  close = () => {
    if (this.baseModal) this.baseModal.close();
  }

  _onPressItem = (index) => {
    const {
      onPressListItem,
      hideWithClickListItem,
      showSelectedIcon,
    } = this.props;

    let tmpArr = [...this.state.showCheckboxes];
    if (showSelectedIcon && !tmpArr[index]) {
      tmpArr.forEach((item, idx) => {
        tmpArr[idx] = index === idx;
      });
      this.setState({ showCheckboxes: tmpArr });
      setTimeout(() => {
        if (onPressListItem) onPressListItem(index);
        if (hideWithClickListItem) this.close();
      }, 200);
    } else {
      if (onPressListItem) onPressListItem(index);
      if (hideWithClickListItem) this.close();
    }
  }

  _renderItem = (obj) => {
    const {
      listItemStyle,
      listItemTextStyle,
      listItemActiveOpacity,
      selectedIcon,
      selectedIconStyle,
      textKey,
      showIcon,
      iconStyle,
      iconKey,
      lastView,
      data,
    } = this.props;
    const { item, index } = obj;

    if (lastView && index === data.length) {
      return lastView;
    }

    let text = '';
    let iconUrl = '';
    if (Object.prototype.toString.call(item) === '[object String]') {
      text = item;
    } else if (Object.prototype.toString.call(item) === '[object Object]') {
      if (textKey) text = item[textKey];
      if (iconKey) iconUrl = item[iconKey];
    }

    return (
      <TouchableOpacity
        style={[appStyle.borderBottom, styles.item, listItemStyle]}
        onPress={() => this._onPressItem(index)}
        activeOpacity={listItemActiveOpacity}
      >
        {showIcon && iconUrl ? <Image source={{ uri: iconUrl }} style={[styles.logo, iconStyle]} resizeMode={'contain'} /> : null}
        {text ? <Text style={[appStyle.font_30, listItemTextStyle]}>{text}</Text> : null}
        {this.state.showCheckboxes[index] ? <View style={{ flex: 1 }} /> : null}
        {this.state.showCheckboxes[index] ? <Image source={selectedIcon} style={[styles.selectedImg, selectedIconStyle]} /> : null}
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.props.data) return <View />;

    const {
      listStyle,
      data = [],
      lastView,
    } = this.props;

    return (
      <BaseModal ref={(ref) => { this.baseModal = ref; }} {...this.props} >
        <FlatList
          style={[{ flex: 1, marginBottom: Theme.iPhoneXBottom }, listStyle]}
          bounces={false}
          data={lastView ? [...data, {}] : data}
          renderItem={this._renderItem}
          keyExtractor={(ItemT, indexT) => indexT.toString()}
        />
        {this.props.children}
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  titleBar: {
    width: Theme.DeviceWidth,
    height: px2dp(84),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: px2dp(84),
    borderBottomWidth: Theme.borderWidth,
  },
  imgBtn: {
    width: px2dp(84),
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    height: px2dp(100),
    alignItems: 'center',
    paddingHorizontal: px2dp(25),
  },
  logo: {
    width: px2dp(30),
    height: px2dp(30),
    marginRight: px2dp(20),
  },
  selectedImg: {
    width: px2dp(30),
    height: px2dp(30),
  },
});

export default ListModal;
