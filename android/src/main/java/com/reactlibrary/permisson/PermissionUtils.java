package com.reactlibrary.permisson;

import android.app.Activity;
import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.v4.content.PermissionChecker;
import android.util.Log;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import static android.os.Build.VERSION_CODES.KITKAT;

/**
 * Created by laowen on 2018/7/13.
 */

public final class PermissionUtils {
//    private static final List<String> PERMISSIONS = getPermissions();
    private static List<String> PERMISSIONS = new ArrayList();
    private static PermissionUtils sInstance;
    private OnRationaleListener mOnRationaleListener;
    private SimpleCallback      mSimpleCallback;
    private FullCallback        mFullCallback;
    private ThemeCallback       mThemeCallback;
    private Set<String> mPermissions;
    private List<String>        mPermissionsRequest;
    private List<String>        mPermissionsGranted;
    private List<String>        mPermissionsDenied;
    private List<String>        mPermissionsDeniedForever;

    private static final String CHECK_OP_NO_THROW = "checkOpNoThrow";
    private static final String OP_POST_NOTIFICATION = "OP_POST_NOTIFICATION";

    private static Context mContext;

    public static void setMainContext(Context context) {
        mContext = context;
        PERMISSIONS = getPermissions();
    }

    /**
     * 获取本app的所有permissions
     */
    public static List<String> getPermissions() {
        return getPermissionsWithApp(mContext.getPackageName());
    }

    /**
     * 获取输入包名app的所有permissions
     */
    private static List<String> getPermissionsWithApp(final String packageName) {
        PackageManager pm = mContext.getPackageManager();
        try {
            return Arrays.asList(pm.getPackageInfo(packageName, PackageManager.GET_PERMISSIONS).requestedPermissions);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * 是否拥有某个权限
     */
    public static boolean isGranted(final String... permissions) {
        for (String permission : permissions) {
            if (!isGranted(permission)) {
                return false;
            }
        }
        return true;
    }

    private static boolean isGranted(final String permission) {
        boolean result = true;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            int targetSdkVersionMy = 0;
            try {
                final PackageInfo info = mContext.getPackageManager().getPackageInfo(
                        mContext.getPackageName(), 0);
                targetSdkVersionMy = info.applicationInfo.targetSdkVersion;
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
            }

            if (targetSdkVersionMy >= Build.VERSION_CODES.M) {
                result = mContext.checkSelfPermission(permission)
                        == PackageManager.PERMISSION_GRANTED;
            } else {
                result = PermissionChecker.checkSelfPermission(mContext, permission)
                        == PermissionChecker.PERMISSION_GRANTED;
            }
        }

        return result;
    }

    /**
     * 设置permissions.
     */
    public static PermissionUtils permission(@PermissionConstants.Permission final String... permissions) {
        return new PermissionUtils(permissions);
    }

    private PermissionUtils(final String... permissions) {
        mPermissions = new LinkedHashSet<>();
        for (String permission : permissions) {
            for (String aPermission : PermissionConstants.getBelongPermissions(permission)) {
                if (PERMISSIONS.contains(aPermission)) {
                    mPermissions.add(aPermission);
                }
            }
        }
        sInstance = this;
    }

    /**
     * 设置拒绝权限后再次请求的回调接口
     */
    public PermissionUtils rationale(final OnRationaleListener listener) {
        mOnRationaleListener = listener;
        return this;
    }

    /**
     * 设置简单回调
     */
    public PermissionUtils callback(final SimpleCallback callback) {
        mSimpleCallback = callback;
        return this;
    }

    /**
     * 设置复杂回调(带拒绝信息)
     */
    public PermissionUtils callback(final FullCallback callback) {
        mFullCallback = callback;
        return this;
    }

    /**
     * 设置主题回调(只有结果)
     */
    public PermissionUtils theme(final ThemeCallback callback) {
        mThemeCallback = callback;
        return this;
    }

    /**
     * 请求权限
     */
    public void request() {
        mPermissionsGranted = new ArrayList<>();
        mPermissionsRequest = new ArrayList<>();
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            mPermissionsGranted.addAll(mPermissions);
            requestCallback();
        } else {
            for (String permission : mPermissions) {
                if (isGranted(permission)) {
                    mPermissionsGranted.add(permission);
                } else {
                    mPermissionsRequest.add(permission);
                }
            }
            if (mPermissionsRequest.isEmpty()) {
                requestCallback();
            } else {
                startPermissionActivity();
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void startPermissionActivity() {
        mPermissionsDenied = new ArrayList<>();
        mPermissionsDeniedForever = new ArrayList<>();
        PermissionActivity.start(mContext);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private boolean rationale(final Activity activity) {
        boolean isRationale = false;
        if (mOnRationaleListener != null) {
            for (String permission : mPermissionsRequest) {
                if (activity.shouldShowRequestPermissionRationale(permission)) {
                    getPermissionsStatus(activity);
                    mOnRationaleListener.rationale(new OnRationaleListener.ShouldRequest() {
                        @Override
                        public void again(boolean again) {
                            if (again) {
                                startPermissionActivity();
                            } else {
                                requestCallback();
                            }
                        }
                    });
                    isRationale = true;
                    break;
                }
            }
            mOnRationaleListener = null;
        }
        return isRationale;
    }

    private void getPermissionsStatus(final Activity activity) {
        for (String permission : mPermissionsRequest) {
            if (isGranted(permission)) {
                mPermissionsGranted.add(permission);
            } else {
                mPermissionsDenied.add(permission);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (!activity.shouldShowRequestPermissionRationale(permission)) mPermissionsDeniedForever.add(permission);  // 被永远拒绝
                }
            }
        }
    }

    private void requestCallback() {
        if (mSimpleCallback != null) {
            if (mPermissionsRequest.size() == 0
                    || mPermissions.size() == mPermissionsGranted.size()) {
                mSimpleCallback.onGranted();
            } else {
                if (!mPermissionsDenied.isEmpty()) {
                    mSimpleCallback.onDenied();
                }
            }
            mSimpleCallback = null;
        }
        if (mFullCallback != null) {
            if (mPermissionsRequest.size() == 0
                    || mPermissions.size() == mPermissionsGranted.size()) {
                mFullCallback.onGranted(mPermissionsGranted);
            } else {
                if (!mPermissionsDenied.isEmpty()) {
                    mFullCallback.onDenied(mPermissionsDeniedForever, mPermissionsDenied);
                }
            }
            mFullCallback = null;
        }
        mOnRationaleListener = null;
        mThemeCallback = null;
    }

    private void onRequestPermissionsResult(final Activity activity) {
        getPermissionsStatus(activity);
        requestCallback();
    }


    public interface OnRationaleListener {

        void rationale(ShouldRequest shouldRequest);

        interface ShouldRequest {
            void again(boolean again);
        }
    }

    public interface SimpleCallback {
        void onGranted();
        void onDenied();
    }

    public interface FullCallback {
        void onGranted(List<String> permissionsGranted);
        void onDenied(List<String> permissionsDeniedForever, List<String> permissionsDenied);
    }

    public interface ThemeCallback {
        void onActivityCreate(Activity activity);
    }


    @RequiresApi(api = Build.VERSION_CODES.M)
    public static class PermissionActivity extends Activity {
        public static void start(final Context context) {
            Intent starter = new Intent(context, PermissionActivity.class);
            starter.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(starter);
        }

        @Override
        protected void onCreate(@Nullable Bundle savedInstanceState) {
            if (sInstance.mThemeCallback != null) { sInstance.mThemeCallback.onActivityCreate(this); }
            super.onCreate(savedInstanceState);

            if (sInstance.rationale(this)) {
                finish();
                return;
            }
            if (sInstance.mPermissionsRequest != null) {
                int size = sInstance.mPermissionsRequest.size();
                if (size <= 0) {
                    finish();
                    return;
                }
                requestPermissions(sInstance.mPermissionsRequest.toArray(new String[size]), 1);
            }
        }

        @Override
        public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
            sInstance.onRequestPermissionsResult(this);
            finish();
        }
    }

    public static boolean checkNotiPermission(Activity activity) {
        Boolean isAllow = false;
        if (android.os.Build.VERSION.SDK_INT < KITKAT) { // 4.4以下
            isAllow = true;
        } else {
            AppOpsManager mAppOps = (AppOpsManager) activity.getSystemService(Context.APP_OPS_SERVICE);
            ApplicationInfo appInfo = activity.getApplicationInfo();
            String pkg = activity.getApplicationContext().getPackageName();
            int uid = appInfo.uid;
            Class appOpsClass = null; /* Context.APP_OPS_MANAGER */

            try {
                appOpsClass = Class.forName(AppOpsManager.class.getName());
                Method checkOpNoThrowMethod = appOpsClass.getMethod(CHECK_OP_NO_THROW, Integer.TYPE, Integer.TYPE, String.class);
                Field opPostNotificationValue = appOpsClass.getDeclaredField(OP_POST_NOTIFICATION);
                int value = (int)opPostNotificationValue.get(Integer.class);
                isAllow = ((int)checkOpNoThrowMethod.invoke(mAppOps,value, uid, pkg) == AppOpsManager.MODE_ALLOWED);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (NoSuchFieldException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return isAllow;
    }
}
