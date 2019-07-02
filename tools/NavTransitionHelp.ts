import { I18nManager } from 'react-native';
import { Platform } from '@epig/rn-baselib/styles';

/**
 * 页面切换效果
 */
enum NavTransitionType {
  /** 渐变 */
  fade = 'fade',
  /** 水平 */
  horizontal = 'horizontal',
  /** 垂直 */
  vertical = 'vertical',
}

/**
 * 左右切换
 */
function forHorizontal(props) {
  const { layout, position, scene } = props;
  if (!layout.isMeasured) { return forInitial(props); }

  const interpolate = getSceneIndicesForInterpolationInputRange(props);
  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, first + 0.01, index, last - 0.01, last],
    outputRange: [0, 1, 1, 0.85, 0],
  });

  const width = layout.initWidth;
  const translateX = position.interpolate({
    inputRange: [first, index, last],
    outputRange: I18nManager.isRTL
      ? [-width, 0, width * 0.3]
      : [width, 0, width * -0.3],
  });
  const translateY = 0;

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 * 垂直切换
 */
function forVertical(props) {
  const { layout, position, scene } = props;
  if (!layout.isMeasured) { return forInitial(props); }

  const interpolate = getSceneIndicesForInterpolationInputRange(props);
  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, first + 0.01, index, last - 0.01, last],
    outputRange: [0, 1, 1, 0.85, 0],
  });

  const height = layout.initHeight;
  const translateY = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [height, 0, 0],
  });
  const translateX = 0;

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 * 渐变切换
 */
function forFade(props) {
  const { layout, position, scene } = props;
  if (!layout.isMeasured) { return forInitial(props); }

  const interpolate = getSceneIndicesForInterpolationInputRange(props);
  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [0, 1, 1],
  });

  return {
    opacity,
  };
}

function forInitial(props) {
  const { navigation, scene } = props;
  const focused = navigation.state.index === scene.index;
  const opacity = focused ? 1 : 0;
  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    opacity,
    transform: [{ translateX: translate }, { translateY: translate }],
  };
}

function getSceneIndicesForInterpolationInputRange(props) {
  const { scene, scenes } = props;
  const index = scene.index;
  const lastSceneIndexInScenes = scenes.length - 1;
  const isBack = !scenes[lastSceneIndexInScenes].isActive;

  if (isBack) {
    const currentSceneIndexInScenes = scenes.findIndex(item => item === scene);
    const targetSceneIndexInScenes = scenes.findIndex(item => item.isActive);
    const targetSceneIndex = scenes[targetSceneIndexInScenes].index;
    const lastSceneIndex = scenes[lastSceneIndexInScenes].index;

    if (
      index !== targetSceneIndex &&
      currentSceneIndexInScenes === lastSceneIndexInScenes
    ) {
      return {
        first: Math.min(targetSceneIndex, index - 1),
        last: index + 1,
      };
    } else if (
      index === targetSceneIndex &&
      currentSceneIndexInScenes === targetSceneIndexInScenes
    ) {
      return {
        first: index - 1,
        last: Math.max(lastSceneIndex, index + 1),
      };
    } else if (
      index === targetSceneIndex ||
      currentSceneIndexInScenes > targetSceneIndexInScenes
    ) {
      return null;
    } else {
      return { first: index - 1, last: index + 1 };
    }
  } else {
    return { first: index - 1, last: index + 1 };
  }
}

// 左右切换效果
const horizontalTransition = Platform.isIOS ? {} : {
  screenInterpolator: (sceneProps) => {
    return forHorizontal(sceneProps);
  },
};

// 上下切换效果
const verticalTransition = Platform.isAndroid ? {} : {
  screenInterpolator: (sceneProps) => {
    return forVertical(sceneProps);
  },
};

// 渐变切换效果
const fadeTransition = {
  screenInterpolator: (sceneProps) => {
    return forFade(sceneProps);
  },
};

const transitionConfig = (props, preProps) => {
  let isPop = false;
  let popModal = false;
  let popFade = false;
  if (preProps) {
    isPop = props.scenes.length === preProps.scenes.length && props.scenes.length > 1;
  } else {
    isPop = false;
  }

  if (isPop) {
    const { transtionType = null } = preProps.scene.route.params || {};
    popModal = transtionType === NavTransitionType.vertical;
    popFade = transtionType === NavTransitionType.fade;
  }

  if (isPop) {
    if (popModal) {
      return verticalTransition;
    } else if (popFade) {
      return fadeTransition;
    } else {
      return horizontalTransition;
    }
  } else {
    const { transtionType = null } = props.scene.route.params || {};
    if (transtionType === NavTransitionType.vertical) {
      return verticalTransition;
    } else if (transtionType === NavTransitionType.fade) {
      return fadeTransition;
    } else {
      return horizontalTransition;
    }
  }
};

export {
  NavTransitionType,
  transitionConfig,
};
