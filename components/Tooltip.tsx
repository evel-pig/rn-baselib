import React, { Component, ReactElement, Fragment } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ViewStyle,
  StyleProp,
  StatusBar,
} from 'react-native';
import { Theme, Platform } from '../styles';

const ScreenWidth = Theme.DeviceWidth;
// const ScreenHeight = Theme.DeviceHeight;
const ScreenHeight = Platform.isIOS ? Theme.DeviceHeight : Theme.DeviceHeight - StatusBar.currentHeight;

const TriangleHeight = px2dp(20);

export interface PositionProps {
  frameOffsetX: number;
  frameOffsetY: number;
  height: number;
  pageOffsetX: number;
  pageOffsetY: number;
  width: number;
}

export interface TooltipProps {
  /** 气泡组件 */
  popover: ReactElement;
  /** 气泡高度 */
  height: number;
  /** 气泡宽度 */
  width: number;
  /** 覆盖层背景颜色 */
  overlayBackgroundColor?: string;
  /** 气泡本体(不包括三角指针)样式 */
  containerStyle?: ViewStyle;
  /** 气泡整体背景颜色 */
  backgroundColor?: string;
  onClose?: (e?: any) => void;
  onOpen?: (e?: any) => void;
}

interface TooltipState {
  isVisible: boolean;
  yOffset: number; // 需要弹气泡的item的 yOffset
  xOffset: number; // 需要弹气泡的item的 xOffset
  elementWidth: number;  // 需要弹气泡的item的宽度
  elementHeight: number; // 需要弹气泡的item的高度
}

class Tooltip extends Component<TooltipProps, TooltipState> {
  renderedElement: View;
  testView: View;

  static defaultProps = {
    height: px2dp(80),
    width: px2dp(300),
    containerStyle: {},
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    onClose: () => { },
    onOpen: () => { },
    overlayBackgroundColor: 'rgba(0, 0, 0, 0.1)',
  };

  state = {
    isVisible: false,
    yOffset: 0,
    xOffset: 0,
    elementWidth: 0,
    elementHeight: 0,
  };

  hide = () => {
    this._onPress();
  }

  show = (item: View) => {
    item.measure((frameOffsetX, frameOffsetY, width, height, pageOffsetX, pageOffsetY) => {
      this.setState({
        yOffset: Platform.isIOS ? pageOffsetY : pageOffsetY - StatusBar.currentHeight,
        xOffset: pageOffsetX,
        elementWidth: width,
        elementHeight: height,
      }, this._onPress);
    });
  }

  _onPress = () => {
    this.setState({ isVisible: !this.state.isVisible }, () => {
      const { onClose, onOpen } = this.props;
      if (this.state.isVisible) {
        if (onOpen) onOpen();
      } else {
        if (onClose) onClose();
      }
    });
  }

  _renderPointer = (isDown) => {
    const { yOffset, xOffset, elementHeight, elementWidth } = this.state;
    return (
      <View
        style={{
          position: 'absolute',
          top: isDown ? Platform.isIOS ? (yOffset) : (yOffset - TriangleHeight - px2dp(1)) : yOffset + elementHeight,
          left: xOffset + getElementVisibleWidth(elementWidth, xOffset, ScreenWidth) / 2 - px2dp(15),
        }}
      >
        <Triangle style={{ borderBottomColor: this.props.backgroundColor }} isDown={isDown} />
      </View>
    );
  }

  _renderContent = () => {
    const { popover, containerStyle, backgroundColor, height, width } = this.props;
    const { yOffset, xOffset, elementHeight, elementWidth } = this.state;
    const { x, y } = getTooltipCoordinate(xOffset, yOffset, elementWidth, elementHeight, ScreenWidth, ScreenHeight, width, height);

    return (
      <Fragment>
        {this._renderPointer(yOffset > y)}
        <View style={[styles.popoverContainer, { left: x, top: y, width: width, height: height, backgroundColor }, containerStyle]}>
          {popover}
        </View>
      </Fragment>
    );
  }

  render() {
    const { isVisible } = this.state;
    const { overlayBackgroundColor } = this.props;

    return (
      <Modal
        animationType="fade"
        visible={isVisible}
        transparent
        onRequestClose={() => { }}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: overlayBackgroundColor }}
          onPress={this._onPress}
          activeOpacity={1}
        >
          {this._renderContent()}
        </TouchableOpacity>
      </Modal>
    );
  }
}

// ---------------------------------------------- 三角形 ----------------------------------------------

const Triangle = ({ style, isDown }) => <View style={[styles.triangle, style, isDown ? styles.down : {}]} />;

const styles = StyleSheet.create({
  down: {
    transform: [{ rotate: '180deg' }],
  },
  triangle: {
    width: 0,
    height: 0,
    marginTop: Platform.isIOS ? -TriangleHeight : 0,
    borderStyle: 'solid',
    borderLeftWidth: TriangleHeight * 0.75,
    borderRightWidth: TriangleHeight * 0.75,
    borderBottomWidth: Platform.isIOS ? TriangleHeight * 2 : TriangleHeight - px2dp(1),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  } as ViewStyle,
  popoverContainer: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px2dp(20),
    padding: px2dp(20),
  },
});

// ---------------------------------------------- 计算坐标尺寸 ----------------------------------------------

const getArea = (a, b) => a * b;
const getPointDistance = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
const getElementVisibleWidth = (elementWidth, xOffset, ScreenWidth) => {
  // Element is fully visible OR scrolled right
  if (xOffset >= 0) {
    return xOffset + elementWidth <= ScreenWidth // is element fully visible?
      ? elementWidth // element is fully visible;
      : ScreenWidth - xOffset; // calculate visible width of scrolled element
  }
  // Element is scrolled LEFT
  return elementWidth - xOffset; // calculate visible width of scrolled element
};

const getTooltipCoordinate = (
  x,
  y,
  width,
  height,
  ScreenWidth,
  ScreenHeight,
  tooltipWidth,
  tooltipHeight,
) => {
  // The following are point coordinates: [x, y]
  const center = [
    x + getElementVisibleWidth(width, x, ScreenWidth) / 2,
    y + height / 2,
  ];
  const pOne = [center[0], 0];
  const pTwo = [ScreenWidth, center[1]];
  const pThree = [center[0], ScreenHeight];
  const pFour = [0, center[1]];

  // vertices
  const vOne = getPointDistance(center, pOne);
  const vTwo = getPointDistance(center, pTwo);
  const vThree = getPointDistance(center, pThree);
  const vFour = getPointDistance(center, pFour);

  // Quadrant areas.
  // type Areas = {
  //   area: number,
  //   id: number,
  // };
  const areas = [
    getArea(vOne, vFour),
    getArea(vOne, vTwo),
    getArea(vTwo, vThree),
    getArea(vThree, vFour),
  ].map((each, index) => ({ area: each, id: index }));

  const sortedArea = areas.sort((a, b) => b.area - a.area);

  // deslocated points
  const dX = 0.001;
  const dY = height / 2;

  // Deslocate the coordinates in the direction of the quadrant.
  const directionCorrection = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const deslocateReferencePoint = [
    [-tooltipWidth, -tooltipHeight],
    [0, -tooltipHeight],
    [0, 0],
    [-tooltipWidth, 0],
  ];

  // current quadrant index
  const qIndex = sortedArea[0].id;
  const getWithPointerOffsetY = () => TriangleHeight * directionCorrection[qIndex][1];
  const getWithPointerOffsetX = () => center[0] - px2dp(36) * directionCorrection[qIndex][0];
  const newX = getWithPointerOffsetX() + (dX * directionCorrection[qIndex][0] + deslocateReferencePoint[qIndex][0]);
  return {
    x: constraintX(newX, qIndex, center[0], ScreenWidth, tooltipWidth),
    y: center[1] + (dY * directionCorrection[qIndex][1] + deslocateReferencePoint[qIndex][1]) + getWithPointerOffsetY(),
  };
};

const constraintX = (newX, qIndex, x, ScreenWidth, tooltipWidth) => {
  switch (qIndex) {
    // 0 and 3 are the left side quadrants.
    case 0:
    case 3: {
      const maxWidth = newX > ScreenWidth ? ScreenWidth - px2dp(20) : newX;
      return newX < 1 ? px2dp(20) : maxWidth;
    }
    // 1 and 2 are the right side quadrants
    case 1:
    case 2: {
      const leftOverSpace = ScreenWidth - newX;
      return leftOverSpace >= tooltipWidth
        ? newX
        : newX - (tooltipWidth - leftOverSpace + px2dp(20));
    }
    default: {
      return 0;
    }
  }
};

export default Tooltip;
