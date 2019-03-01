import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  FlatListProperties,
} from 'react-native';
import appStyles, { Theme } from '../styles';

export const RefreshState = {
  /** 普通状态 */
  Idle: 0,
  /** 头部菊花转圈圈中 */
  HeaderRefreshing: 1,
  /** 底部菊花转圈圈中 */
  FooterRefreshing: 2,
  /** 已加载全部数据 */
  NoMoreData: 3,
  /** 加载失败 */
  Failure: 4,
  /** 数据为空 */
  EmptyData: 5,
};

export interface RefreshFlatListtProps extends FlatListProperties<any> {
  /** 状态 */
  refreshState: number;
  /** 列表数据 */
  data: any[];
  /** 列表item */
  renderItem: (data: any) => React.ReactElement<any>;
  /** ref */
  listRef?: any;
  /** 下拉刷新函数 */
  onHeaderRefresh: (e: any) => void;
  /** 上拉加载函数 */
  onFooterRefresh?: (e: any) => void;
  /** 底部刷新时中文字 */
  footerRefreshingText?: string;
  /** 底部失败时文字 */
  footerFailureText?: string;
  /** 底部已加载全部数据时文字 */
  footerNoMoreDataText?: string;
  /** 空数据时文字 */
  footerEmptyDataText?: string;
  /** 底部刷新控件 */
  footerRefreshingComponent?: React.ReactNode;
  /** 底部失败控件 */
  footerFailureComponent?: React.ReactNode;
  /** 底部已加载全部数据控件 */
  footerNoMoreDataComponent?: React.ReactNode;
  /** 空数据控件 */
  footerEmptyDataComponent?: React.ReactNode;
}

interface RefreshFlatListOwnState {
}

class RefreshFlatList extends Component<RefreshFlatListtProps, RefreshFlatListOwnState> {
  onEndReachedCalledDuringMomentum: any = null;

  static defaultProps = {
    footerRefreshingText: '数据加载中...',
    footerFailureText: '点击重新加载',
    footerNoMoreDataText: '已加载全部数据',
    footerEmptyDataText: '暂时没有相关数据',
  };

  constructor(props) {
    super(props);
  }

  onHeaderRefresh = () => {
    if (this.props.refreshState !== RefreshState.HeaderRefreshing && this.props.refreshState !== RefreshState.FooterRefreshing) {
      this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
    }
  }

  onEndReached = () => {
    let { refreshState, data } = this.props;
    if (data && data.length > 0 && refreshState === RefreshState.Idle && !this.onEndReachedCalledDuringMomentum) {
      this.onEndReachedCalledDuringMomentum = true;
      if (this.props.onFooterRefresh) this.props.onFooterRefresh(RefreshState.FooterRefreshing);
    }
  }

  _onPressFooterFailure() {
    if (!this.props.data || this.props.data.length === 0) {
      this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
    } else if (this.props.onFooterRefresh) {
      this.props.onFooterRefresh(RefreshState.FooterRefreshing);
    }
  }

  _renderFooter = () => {
    let footer = null;
    const {
      footerRefreshingText,
      footerFailureText,
      footerNoMoreDataText,
      footerEmptyDataText,
      footerRefreshingComponent,
      footerFailureComponent,
      footerNoMoreDataComponent,
      footerEmptyDataComponent,
      refreshState,
    } = this.props;

    if (refreshState === RefreshState.Failure) {
      footer = (
        <TouchableOpacity onPress={() => { this._onPressFooterFailure(); }}>
          {footerFailureComponent ||
            <View style={styles.footerContainer}>
              <Text style={[appStyles.font_24, { color: Theme.fontColor_66 }]}>{footerFailureText}</Text>
            </View>}
        </TouchableOpacity>
      );
    } else if (refreshState === RefreshState.EmptyData) {
      footer = (
        <TouchableOpacity onPress={() => { if (this.props.onHeaderRefresh) this.props.onHeaderRefresh(RefreshState.HeaderRefreshing); }}>
          {footerEmptyDataComponent ||
            <View style={styles.footerContainer}>
              <Text style={[appStyles.font_24, { color: Theme.fontColor_66 }]}>{footerEmptyDataText}</Text>
            </View>
          }
        </TouchableOpacity>
      );
    } else if (refreshState === RefreshState.NoMoreData) {
      footer = footerNoMoreDataComponent || (
        <View style={styles.footerContainer} >
          <Text style={[appStyles.font_24, { color: Theme.fontColor_66 }]}>{footerNoMoreDataText}</Text>
        </View>);
    } else if (refreshState === RefreshState.FooterRefreshing) {
      footer = footerRefreshingComponent || (
        <View style={styles.footerContainer} >
          <ActivityIndicator size="small" color={Theme.fontColor_66} />
          <Text style={[appStyles.font_24, { color: Theme.fontColor_66 }, { marginLeft: px2dp(7) }]}>{footerRefreshingText}</Text>
        </View>);
    }

    return footer;
  }

  render() {
    let { data, renderItem, ...other } = this.props;
    if (!data || Object.prototype.toString.call(data) !== '[object Array]') return <View {...other} />;

    return (
      <FlatList
        ref={this.props.listRef}
        data={data}
        onEndReached={this.onEndReached}
        onRefresh={this.onHeaderRefresh}
        refreshing={this.props.refreshState === RefreshState.HeaderRefreshing}
        ListFooterComponent={this._renderFooter}
        renderItem={renderItem}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        {...other}
      />
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: px2dp(10),
    height: px2dp(80),
  },
});

export default RefreshFlatList;
