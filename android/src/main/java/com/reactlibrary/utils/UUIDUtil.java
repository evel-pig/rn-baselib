package com.reactlibrary.utils;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.SharedPreferences;
import android.provider.Settings;
import android.support.v4.content.ContextCompat;
import android.telephony.TelephonyManager;
import android.util.Log;
import java.io.UnsupportedEncodingException;
import java.util.UUID;

import static android.os.Build.VERSION_CODES.M;

public class UUIDUtil {
    public static String getDeviceUuid(Context context) {
        UUID uuid = null;

        synchronized (UUIDUtil.class) {
            String PREFS_FILE = "RNBaselibUUID.xml";
            String PREFS_DEVICE_ID = "RNBaselibUUID_uudid";
            final SharedPreferences prefs = context.getSharedPreferences(PREFS_FILE, 0);
            final String id = prefs.getString(PREFS_DEVICE_ID, null);
            if (id != null) {
                uuid = UUID.fromString(id);
            } else {
                try {
                    final String androidId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
                    if (!"9774d56d682e549c".equals(androidId)) {
                        uuid = UUID.nameUUIDFromBytes(androidId.getBytes("utf8"));
                    } else {
                        String deviceId = null;
                        if (DeviceUtil.checkPhonePermission(context)) {
                            TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
                            deviceId = tm.getDeviceId();
                        }
                        uuid = deviceId != null ? UUID.nameUUIDFromBytes(deviceId.getBytes("utf8")) : UUID.randomUUID();
                    }
                } catch (UnsupportedEncodingException e) {
                    Log.e("UUIDUtil", "getDeviceUuid: " + e.toString());
                    throw new RuntimeException(e);
                }
                if (null != uuid) prefs.edit().putString(PREFS_DEVICE_ID, uuid.toString()).commit();
            }
        }
        return null != uuid ? uuid.toString() : "";
    }
}
