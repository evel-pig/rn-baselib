package com.reactlibrary;

import android.app.Activity;
import android.content.Context;
import android.hardware.Camera;
import android.os.Build;
import android.support.v4.app.NotificationManagerCompat;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.reactlibrary.permisson.PermissionConstants;
import com.reactlibrary.permisson.PermissionUtils;
import com.reactlibrary.utils.DeviceUtil;
import com.reactlibrary.utils.EmulatorUtils;
import com.reactlibrary.utils.OSUtils;
import com.reactlibrary.utils.RootUtil;
import com.reactlibrary.utils.SoftKeyBoardListener;
import com.reactlibrary.utils.UUIDUtil;
import com.reactlibrary.utils.WifiUtil;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class RNBaselibModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    public static Context appContext;
    private static boolean isKeyboardShowing = false;

    public RNBaselibModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    public static void setMainContext(Context c) {
        appContext = c;
    }

    public static void setKeyboardListner(Activity activity) {
        SoftKeyBoardListener.setListener(activity, new SoftKeyBoardListener.OnSoftKeyBoardChangeListener() {
            @Override
            public void keyBoardShow(int height) {
                isKeyboardShowing = true;
            }
            @Override
            public void keyBoardHide(int height) {
                isKeyboardShowing = false;
            }
        });
    }

    @Override
    public String getName() {
        return "RNBaselib";
    }

    @ReactMethod
    public void testWithcallback(final Callback callback) {
        if (callback != null)
            callback.invoke("哈哈哈");
    }

    // 相册/存储权限
    @ReactMethod
    public void checkPhotoPermission(final Callback callback) {
        this.checkPermission(callback, new String[]{PermissionConstants.STORAGE});
    }

    // 相机权限
    @ReactMethod
    public void checkCameraPermission(final Callback callback) {
        PermissionUtils.permission(new String[]{PermissionConstants.CAMERA})
                .callback(new PermissionUtils.SimpleCallback() {
                    @Override
                    public void onGranted() {
                        checkCamera(callback);
                    }
                    @Override
                    public void onDenied() {
                        checkCamera(callback);
                    }
                })
                .rationale(new PermissionUtils.OnRationaleListener() {
                    @Override
                    public void rationale(final ShouldRequest shouldRequest) {
                        checkCamera(callback);
                    }
                })
                .request();
    }

    // 定位权限
    @ReactMethod
    public void checkLocationPermission(final Callback callback) {
        this.checkPermission(callback, new String[]{PermissionConstants.LOCATION});
    }

    // 联系人权限
    @ReactMethod
    public void checkContactsPermission(final Callback callback) {
        this.checkPermission(callback, new String[]{PermissionConstants.CONTACTS});
    }

    // 消息推送权限
    @ReactMethod
    public void checkNotificationPermission(final Callback callback) {
        NotificationManagerCompat manager = NotificationManagerCompat.from(getReactApplicationContext());
        boolean isAllow = manager.areNotificationsEnabled();
        if (callback != null) callback.invoke(isAllow);
    }

    // 短信权限
    @ReactMethod
    public void checkSMSPermission(final Callback callback) {
        this.checkPermission(callback, new String[] { PermissionConstants.SMS });
    }

    // 电话/通话记录权限
    @ReactMethod
    public void checkPhonePermission(final Callback callback) {
        this.checkPermission(callback, new String[] { PermissionConstants.PHONE });
    }

    // 跳转系统权限设置页面
    @ReactMethod
    public void toPermissionSettingCenter() {
        OSUtils.toPermissionSettingCenter();
    }

    // 跳转系统权限设置页面
    @ReactMethod
    public void toNotificationSetting() {
        OSUtils.toNotificationSetting();
    }

    // 检查设备root状态
    @ReactMethod
    public void checkDeviceRooted(final Callback callback) {
        if (callback != null) callback.invoke(RootUtil.isDeviceRooted());
    }

    // 检查设备是否是模拟器
    @ReactMethod
    public void checkDeviceType(final Callback callback) {
        if (callback != null) callback.invoke(EmulatorUtils.isEmulator());
    }

    // 获取手机键盘状态
    @ReactMethod
    public void getKeyboardStatus(final Callback callback) {
        if (callback != null) callback.invoke(isKeyboardShowing);
    }

    @ReactMethod
    public void getUUID(final Callback callback) {
        if (callback != null) callback.invoke(UUIDUtil.getDeviceUuid(this.reactContext));
    }

    @ReactMethod
    public void getWifiMac(final Callback callback) {
        if (callback != null) callback.invoke(WifiUtil.getMacAddress(this.reactContext));
    }

    @ReactMethod
    public void getWifiIP(final Callback callback) {
        if (callback != null) callback.invoke(WifiUtil.getIpAddress(this.reactContext));
    }

    @ReactMethod
    public void getDeviceLocale(final Callback callback) {
        if (callback != null) callback.invoke(DeviceUtil.getDeviceLocale(this.reactContext));
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        if (null == this.reactContext) this.reactContext = getReactApplicationContext();
        HashMap<String, Object> constants = new HashMap<String, Object>();
        try {
            String IMEI = "";
            String simSerialNumber = "";   // 手机sim序列号
            String mcc = "";
            String mnc = "";
            String phonnumber = "";    // 手机号码

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (DeviceUtil.checkPhonePermission(this.reactContext)) {
                    try {
                        TelephonyManager tm = (TelephonyManager) this.reactContext.getSystemService(Context.TELEPHONY_SERVICE);
                        IMEI = tm.getDeviceId() + "";
                        simSerialNumber = tm.getSimSerialNumber();
                        if (!tm.getNetworkOperator().isEmpty() && tm.getNetworkOperator().length() >= 5) {
                            mcc = tm.getNetworkOperator().substring(0, 3);
                            mnc = tm.getNetworkOperator().substring(3, 5);
                        }
                        phonnumber = tm.getLine1Number();
                    } catch (Exception e) {
                        Log.e(TAG, "getConstants: " + e.toString());
                        e.printStackTrace();
                    }
                }
            }

            constants.put("manufacturer", DeviceUtil.getValueEncoded(Build.MANUFACTURER.toLowerCase()));
            constants.put("deviceModel", DeviceUtil.getValueEncoded(Build.MODEL.toLowerCase()));
            constants.put("imei", DeviceUtil.getValueEncoded(IMEI));
            constants.put("systemVersion", Build.VERSION.RELEASE);
            constants.put("number", phonnumber);
            constants.put("serial", simSerialNumber);
            constants.put("mcc", mcc);
            constants.put("mnc", mnc);
            constants.put("source", DeviceUtil.getChannelString(this.reactContext));
            constants.put("deviceName", DeviceUtil.getDeviceName());
            constants.put("bundleId", BuildConfig.APPLICATION_ID);
            constants.put("versionName", DeviceUtil.getVersionName(this.reactContext));
            constants.put("versionCode", DeviceUtil.getVersionCode(this.reactContext));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return constants;
    }

    private void checkCamera(final Callback callback) {
        Camera mCamera = null;
        boolean canOpen = false;
        try {
            mCamera = Camera.open();
            if (mCamera != null) {
                mCamera.stopPreview();
                mCamera.release();
                mCamera = null;
            }
            canOpen = true;
        } catch (Exception e) {
            if (mCamera != null) {
                mCamera.release();
                mCamera = null;
            }
            canOpen = false;
        } finally {
            if (callback != null) callback.invoke(canOpen);
        }
    }

    private void checkPermission(final Callback callback, @PermissionConstants.Permission final String... permissions) {
        PermissionUtils.permission(permissions)
                .callback(new PermissionUtils.SimpleCallback() {
                    @Override
                    public void onGranted() {  // 同意回调
                        if (callback != null)
                            callback.invoke(true);
                    }

                    @Override
                    public void onDenied() {  // 拒绝回调
                        if (callback != null)
                            callback.invoke(false);
                    }
                })
                .rationale(new PermissionUtils.OnRationaleListener() {
                    @Override
                    public void rationale(final ShouldRequest shouldRequest) {  // 设置拒绝权限后再次请求的回调接口
                        if (callback != null)
                            callback.invoke(false);
                    }
                })
                .request();
    }

    private static final String TAG = "RNBaselibModule======";
}