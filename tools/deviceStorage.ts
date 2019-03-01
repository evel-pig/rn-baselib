import { AsyncStorage } from 'react-native';

class DeviceStorage {
  /**
   * 保存
   * @param {string} key
   * @param {*} value
   * @returns
   * @memberof DeviceStorage
   */
  save(key: string, value: any) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取
   * @param {string} key
   * @returns
   * @memberof DeviceStorage
   */
  get(key: string) {
    return AsyncStorage.getItem(key).then((value) => {
      const jsonValue = JSON.parse(value);
      return jsonValue;
    });
  }

  /**
   * 更新
   * @param {string} key
   * @param {(string | number)} value
   * @returns
   * @memberof DeviceStorage
   */
  update(key: string, value: string | number) {
    this.save(key, value);
    return this.get(key);
  }

  /**
   * 删除
   * @param {string} key
   * @returns
   * @memberof DeviceStorage
   */
  del(key: string) {
    return AsyncStorage.removeItem(key);
  }
}

const deviceStorage = new DeviceStorage();

export default deviceStorage;
