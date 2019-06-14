declare module '@epig/rn-baselib' {

  export default class Baselib {
    /**
     * 相册权限检查
     * @param callback 权限检查结果回调
     */
    static checkPhotoPermission(
      callback: (isAuthorized: boolean) => void,
    );

    /**
     * 相机权限检查
     * @param callback 权限检查结果回调
     */
    static checkCameraPermission(
      callback: (isAuthorized: boolean) => void,
    );

    /**
     * 定位权限检查
     * @param callback 权限检查结果回调
     * @type 'always' | 'whenInUse', onlyIos, 使用中定位还是一直定位
     */
    static checkLocationPermission(
      callback: (isAuthorized: boolean) => void,
      type?: 'always' | 'whenInUse',
    );

    /**
     * 通讯录权限检查
     * @param callback 权限检查结果回调
     */
    static checkContactsPermission(
      callback: (isAuthorized: boolean) => void,
    );

    /**
     * 消息推送权限检查
     * @param callback 权限检查结果回调
     */
    static checkNotificationPermission(
      callback: (isAuthorized: boolean) => void,
    );

    /**
     * 短信权限检查, onlyAndroid
     * @param callback 权限检查结果回调
     */
    static checkSMSPermission(
      callback: (isAuthorized: boolean) => void,
    );

    /**
     * 通讯录/手机状态权限检查, onlyAndroid
     * @param callback 权限检查结果回调
     */
    static checkPhonePermission(
      callback: (isAuthorized: boolean) => void,
    );
  }
}