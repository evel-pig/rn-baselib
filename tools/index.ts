import DeviceStorage from './deviceStorage';
import navigation from './navigation';

/**
 * 转换颜色为RGBA格式
 * @param {string} color 颜色值
 * @param {number} opacity 透明度
 * @returns {string}
 */
function convertToRGBA(color: string, opacity: number): string {
  let result = '';
  if (color.indexOf('#') === 0) {
    let _color = color.replace('#', '');
    const r = parseInt(_color.substring(0, 2), 16);
    const g = parseInt(_color.substring(2, 4), 16);
    const b = parseInt(_color.substring(4, 6), 16);
    result = `rgba(${r},${g},${b},${opacity})`;
  } else if (color.indexOf('rgb') === 0 && color.indexOf('rgba') === -1) {
    result = `rgba${color.slice(3, -1)},${opacity})`;
  } else if (color.indexOf('rgba') === 0) {
    const index = color.lastIndexOf(',');
    result = `${color.slice(0, index)},${opacity})`;
  }
  return result;
}

export {
  navigation,
  convertToRGBA,
  DeviceStorage,
};

export * from './helper';
export * from './connect';
export * from './NavTransitionHelp';
