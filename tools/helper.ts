import {
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native';

interface EmitterOptions {
  [key: string]: (data) => void;
}

/**
 * DeviceEventEmitter辅助class(遍历去除listener)
 * @class EmitterHelper
 */
class EmitterHelper {
  events: { [key: string]: EmitterSubscription };

  constructor(options: EmitterOptions) {
    this.events = {};
    Object.keys(options).map(key => {
      if (typeof options[key] === 'function') {
        this.events[key] = DeviceEventEmitter.addListener(key, options[key]);
      } else {
        console.error(`请检查${options[key]}类型是否为Funtion`);
      }
    });
  }

  remove() {
    Object.keys(this.events).map(key => {
      this.events[key].remove();
    });
  }
}

export {
  EmitterHelper,
};
