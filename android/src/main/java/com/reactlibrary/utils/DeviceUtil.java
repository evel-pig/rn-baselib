package com.reactlibrary.utils;

import android.Manifest;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.util.Locale;

import static android.os.Build.VERSION_CODES.M;

public class DeviceUtil {

    // 获取自定义的手机名称
    public static String getDeviceName() {
        String deviceName = "";
        try{
            Class<?> cls = Class.forName("android.os.SystemProperties");
            Object object = (Object) cls.newInstance();
            Method getName = cls.getDeclaredMethod("get", String.class);
            deviceName = (String) getName.invoke(object, "persist.sys.device_name");
        } catch (Exception e){
            Log.e(TAG, "getDeviceName: " + e.toString());
            e.printStackTrace();
        }
        return deviceName;
    }

    public static int getVersionCode(Context context) {
        int versionCode = 0;
        PackageManager packageManager = context.getPackageManager();
        PackageInfo packInfo = null;
        try {
            packInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "getVersionCode: " + e.toString());
            e.printStackTrace();
        }
        if (packInfo != null) {
            versionCode = packInfo.versionCode;
        }
        return versionCode;
    }

    public static String getVersionName(Context context) {
        String versionName = null;
        if (versionName == null) {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packInfo = null;
            try {
                packInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            } catch (PackageManager.NameNotFoundException e) {
                Log.e(TAG, "getVersionName: " + e.toString());
                e.printStackTrace();
            }
            if (packInfo != null) {
                versionName = packInfo.versionName;
            }
        }
        return versionName;
    }

    // 获取渠道标识
    public static String getChannelString(Context ctx) {
        if (ctx == null) return null;
        String channelName = null;
        try {
            PackageManager packageManager = ctx.getPackageManager();
            if (packageManager != null) {
                ApplicationInfo applicationInfo = packageManager.getApplicationInfo(ctx.getPackageName(), PackageManager.GET_META_DATA);
                if (applicationInfo != null) {
                    if (applicationInfo.metaData != null) {
                        channelName = applicationInfo.metaData.getString("UMENG_CHANNEL");
                    }
                }
            }
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "getChannelString: " + e.toString());
            e.printStackTrace();
        }
        return channelName;
    }

    // 手机本地语言
    public static String getDeviceLocale(Context ctx) {
        Locale current;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            current = ctx.getResources().getConfiguration().getLocales().get(0);
        } else {
            current = ctx.getResources().getConfiguration().locale;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            return current.toLanguageTag();
        } else {
            StringBuilder builder = new StringBuilder();
            builder.append(current.getLanguage());
            if (current.getCountry() != null) {
                builder.append("-");
                builder.append(current.getCountry());
            }
            return builder.toString();
        }
    }

    // 中文URL转码
    public static String getValueEncoded(String value) {
        if (value.isEmpty()) return "";
        String newValue = value.replace("\n", "");
        for (int i = 0, length = newValue.length(); i < length; i++) {
            char c = newValue.charAt(i);
            if (c <= '\u001f' || c >= '\u007f') {
                try {
                    return URLEncoder.encode(newValue, "UTF-8");
                } catch (Exception e) {
                    e.printStackTrace();
                    return "";
                }
            }
        }
        return newValue;
    }

    public static boolean checkPhonePermission(Context mContext) {
        if (android.os.Build.VERSION.SDK_INT >= M) { // >6.0版本
            // 检查权限
            if (ContextCompat.checkSelfPermission(mContext, Manifest.permission.READ_PHONE_STATE) == PackageManager
                    .PERMISSION_GRANTED) {  // 已拥有权限
                return true;
            } else {  // 未获取权限
                return false;
            }
        } else {
            return true;
        }
    }

    private static final String TAG = "DeviceUtil";
}
