import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import appStyles, { Theme } from '../styles';

export interface GridLayoutProps {
  /** 组件宽度, 默认是屏幕宽度 */
  width?: number;
  /** 格子总数量 */
  grids: number;
  /** 列数 */
  columns: number;
  /** 格子高度, 默认等于格子宽度 */
  gridHeight?: number;
  /** 渲染格子内子控件 */
  renderGrid?: any;
  /** 是否显示分隔线, 默认true */
  border?: boolean;
  /** 分隔线颜色, 默认Theme.borderColor */
  borderColor?: string;
  /** 分隔线宽度, 默认Theme.borderWidth */
  borderWidth?: number;
  /** 组件样式 */
  style?: StyleProp<ViewStyle>;
  /** 格子的样式 */
  gridsStyle?: StyleProp<ViewStyle>;
}

interface GridLayoutOwnState {
}

class GridLayout extends Component<GridLayoutProps, GridLayoutOwnState> {

  static defaultProps = {
    grids: 0,
    columns: 0,
    width: Theme.DeviceWidth,
    border: true,
    borderColor: Theme.borderColor,
    borderWidth: Theme.borderWidth,
  };

  render() {
    const {
      grids,
      style,
      columns,
      renderGrid,
      gridsStyle,
      width,
      border,
      borderColor,
      borderWidth,
    } = this.props;
    if (grids === 0 || columns === 0) return <View style={style} />;

    const w = width / this.props.columns;
    const { gridHeight = w } = this.props;
    const arr = new Array(grids).fill({});
    let row = (grids + 1) / columns;  // 总行数

    return (
      <View style={[styles.container, { width: width }, style]}>
        {arr.map((item, index) => {
          let rowIdx = Math.ceil((index + 1) / columns) - 1;
          let columnIdx = index % columns;
          let borderRight: ViewStyle = {};
          let borderBottom: ViewStyle = {};
          if (border && columnIdx !== columns - 1) {
            borderRight = { borderRightColor: borderColor, borderRightWidth: borderWidth };
          }
          if (border && rowIdx !== row - 1) {
            borderBottom = { borderBottomColor: borderColor, borderBottomWidth: borderWidth };
          }

          return (
            <View style={[{ width: w, height: gridHeight }, borderRight, borderBottom, gridsStyle]} key={index}>
              {renderGrid ? React.cloneElement(renderGrid({ index, rowIdx, columnIdx }), item) : null}
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.white,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

export default GridLayout;
