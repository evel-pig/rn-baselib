package com.reactlibrary.utils;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.text.format.Formatter;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;
import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;

public class WifiUtil {
    private static WifiManager mWifiManager = null;

    public static String getIpAddress(Context context) {
        String ip = "";
        WifiInfo info = getWifiInfo(context);
        if (null != info) {
            ip = Formatter.formatIpAddress(info.getIpAddress());
        }
        return ip;
    }

    public static String getMacAddress(Context context) {
        String mac = "";
        WifiInfo info = getWifiInfo(context);
        if (null != info) {
            try {
                mac = info.getMacAddress();
                if (checkInternetPermission(context)) {
                    if (mac.equals("02:00:00:00:00:00")) {
                        mac = getAdressMacByInterface();
                    }
                    if (TextUtils.isEmpty(mac) && null != mWifiManager) {
                        mac = getAddressMacByFile(mWifiManager);
                    }
                }
            } catch (Exception e) {
                Log.e("WifiUtil", "getMacAddress: " + e.toString());
                e.printStackTrace();
            }
        }

        return mac;
    }

    private static WifiInfo getWifiInfo(Context context) {
        WifiInfo info = null;
        if (checkWifiPermission(context)) {
            WifiManager manager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            info = manager.getConnectionInfo();
            mWifiManager = manager;
        }
        return info;
    }

    private static String getAdressMacByInterface() {
        try {
            List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface nif : all) {
                if (!nif.getName().equalsIgnoreCase("wlan0")) continue;
                byte[] macBytes = nif.getHardwareAddress();
                if (macBytes == null) return null;

                StringBuilder res1 = new StringBuilder();
                for (byte b : macBytes) {
                    res1.append(String.format("%02X:",b));
                }
                if (res1.length() > 0) res1.deleteCharAt(res1.length() - 1);
                return res1.toString();
            }
        } catch (Exception e) {
            Log.e("WifiUtil", "getAdressMacByInterface: " + e.toString());
            e.printStackTrace();
        }
        return null;
    }


    private static String getAddressMacByFile(WifiManager wifiMan) throws Exception {
        String ret = "";
        try {
            File fl = new File("/sys/class/net/wlan0/address");
            if (fl.exists()) {
                int wifiState = wifiMan.getWifiState();
                wifiMan.setWifiEnabled(true);
                FileInputStream fin = new FileInputStream(fl);
                ret = crunchifyGetStringFromStream(fin);
                fin.close();
                boolean enabled = WifiManager.WIFI_STATE_ENABLED == wifiState;
                wifiMan.setWifiEnabled(enabled);
            }
        } catch (FileNotFoundException e) {
            Log.e("WifiUtil", "getAddressMacByFile: " + e.toString());
            e.printStackTrace();
        } catch (Exception e) {
            Log.e("WifiUtil", "getAddressMacByFile: " + e.toString());
            e.printStackTrace();
        }
        return ret;
    }

    private static String crunchifyGetStringFromStream(InputStream crunchifyStream) throws IOException {
        if (crunchifyStream != null) {
            Writer crunchifyWriter = new StringWriter();
            char[] crunchifyBuffer = new char[2048];
            try {
                Reader crunchifyReader = new BufferedReader(new InputStreamReader(crunchifyStream, "UTF-8"));
                int counter;
                while ((counter = crunchifyReader.read(crunchifyBuffer)) != -1) {
                    crunchifyWriter.write(crunchifyBuffer, 0, counter);
                }
            } finally {
                crunchifyStream.close();
            }
            return crunchifyWriter.toString();
        } else {
            return "";
        }
    }

    private static boolean checkWifiPermission(Context mContext) {
        if (ContextCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_WIFI_STATE) == PackageManager
                .PERMISSION_GRANTED) {  // 已拥有权限
            return true;
        } else {  // 未获取权限
            return false;
        }
    }

    private static boolean checkInternetPermission(Context mContext) {
        if (ContextCompat.checkSelfPermission(mContext, Manifest.permission.INTERNET) == PackageManager
                .PERMISSION_GRANTED) {  // 已拥有权限
            return true;
        } else {  // 未获取权限
            return false;
        }
    }
}
