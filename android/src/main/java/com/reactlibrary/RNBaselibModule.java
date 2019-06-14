
package com.reactlibrary;

import android.hardware.Camera;
import android.support.v4.app.NotificationManagerCompat;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.reactlibrary.permisson.PermissionConstants;
import com.reactlibrary.permisson.PermissionUtils;

public class RNBaselibModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNBaselibModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
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