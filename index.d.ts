declare module '@epig/rn-baselib' {

  export default class Baselib {
    // ---------------------------------- permission ----------------------------------
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

    /**
     * 跳转权限设置中心
     */
    static toPermissionSettingCenter();

    // ---------------------------------- device info ----------------------------------
    /** 设置制造商 */
    static manufacturer: string;
    /** 设备类型 */
    static model: string;
    /** imei码 */
    static imei: string;
    /** 系统版本号 */
    static systemVersion: string;
    /** 手机号 */
    static number: string;
    /** sim卡序列号 */
    static serial: string;
    /** mcc码 */
    static mcc: string;
    /** mnc码 */
    static mnc: string;
    /** 渠道标识 */
    static source: string;
    /** 设备名称 */
    static deviceName: string;
    /** app名称 */
    // static appName: string;
    /** applicationId或bundle id */
    static bundleId: string;
    /** app版本 */
    static versionName: string;
    /** app构建号 */
    static versionCode: string;
    /** 设备是否已root, only android */
    static isDeviceRooted: boolean;
    /** 设备是否是模拟器 */
    static isSimulator: boolean;
    /** uuid码 */
    static uuid: string;
    /** idfa码, only iOS */
    static idfa: string;
    /** wifi的mac地址 */
    static macAddress: string;
    /** ip地址 */
    static ipAddress: string;
    /** 设备型号 */
    static deviceModel: string;
    /** 手机本地语言 */
    deviceLocale: string;

    /**
     * 跳转消息推送设置界面
     */
    static toNotificationSetting();

    /**
     * 检查设备root状态
     * @param callback root状态结果回调
     */
    static checkDeviceRooted(
      callback: (isRooted: boolean) => void,
    );

    /**
     * 检查设备是否是模拟器
     * @param callback 结果回调
     */
    static checkDeviceType(
      callback: (isEmulator: boolean) => void,
    );

    /**
     * 获取手机键盘状态
     * @param callback 结果回调
     */
    static getKeyboardStatus(
      callback: (isShowing: boolean) => void,
    );

    /**
     * 获取 app 在 app store上信息, onlyIOS
     * @param id app的app id
     * @param callback 结果回调
     */
    static getAppStoreInfoWithId(
      id: string,
      callback: (obj: any) => void,
    );

    /**
     * 获取uuid
     * @param callback 结果回调
     */
    static getUUID(
      callback: (uuid: string) => void,
    );

    /**
     * 获取idfa
     * @param callback 结果回调
     */
    static getIDFA(
      callback: (idfa: string) => void,
    );

    /**
     * 获取wifi的mac地址
     * @param callback 结果回调
     */
    static getWifiMac(
      callback: (mac: string) => void,
    );

    /**
     * 获取网络的ip地址
     * @param callback 结果回调
     */
    static getWifiIP(
      callback: (ip: string) => void,
    );

    /**
     * 获取设备型号
     * @param callback 结果回调
     */
    static getDeviceModel(
      callback: (model: string) => void,
    );

    /**
     * 获取手机的本地语言
     * @param callback 结果回调
     */
    static getDeviceLocale(
      callback: (deviceLocale: string) => void,
    );
  }
}