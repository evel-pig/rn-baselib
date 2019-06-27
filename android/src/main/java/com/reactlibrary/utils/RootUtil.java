package com.reactlibrary.utils;

import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;

public class RootUtil {
    /**
     * 检查设备是否已经 root
     *
     * @return 是否已 root
     */
    public static boolean isDeviceRooted() {
        if (checkRooted1()) return true;
        if (checkRooted2()) return true;
        if (checkRooted7()) return true;
        if (checkRooted3()) return true;
        if (checkRooted4()) return true;
        if (checkRooted5()) return true;
//        if (checkRooted6()) return true;
        return false;
    }

    private static boolean checkRooted1() {
        try {
            File file = new File("/system/app/Superuser.apk");
            if (file.exists()) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("RootUtil", "checkRooted1错误: " + e.toString());
        }
        return false;
    }

    private static synchronized boolean checkRooted2() {
        try {
            String fileContent = "test_ok";
            Boolean writeFlag = writeFile("/data/su_test", fileContent);
            String strRead = readFile("/data/su_test");
            if (fileContent.equals(strRead)) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("RootUtil", "checkRooted2错误: " + e.toString());
            return false;
        }
    }

    private static synchronized boolean checkRooted3() {
        Process process = null;
        DataOutputStream os = null;
        try {
            process = Runtime.getRuntime().exec("su");
            os = new DataOutputStream(process.getOutputStream());
            os.writeBytes("exit\n");
            os.flush();
            int exitValue = process.waitFor();
            if (exitValue == 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            Log.e("OSUtils++", "检查root出异常: ");
            return false;
        } finally {
            try {
                if (os != null) {
                    os.close();
                }
                process.destroy();
            } catch (Exception e) {
                e.printStackTrace();
                Log.e("RootUtil", "checkRooted3错误: " + e.toString());
            }
        }
    }

    private static boolean checkRooted4() {
        String[] paths = {
                "/system/app/Superuser.apk",
                "/sbin/su",
                "/system/bin/su",
                "/system/xbin/su",
                "/data/local/xbin/su",
                "/data/local/bin/su",
                "/system/sd/xbin/su",
                "/system/bin/failsafe/su",
                "/data/local/su", "/su/bin/su"
        };
        for (String path : paths) {
            if (new File(path).exists()) return true;
        }
        return false;
    }

    private static synchronized boolean checkRooted5() {
        try {
            String[] strCmd = new String[]{"busybox", "df"};
            ArrayList<String> execResult = executeCommand(strCmd);
            if (execResult != null) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("RootUtil", "checkRooted5错误: " + e.toString());
            return false;
        }
    }

    private static boolean checkRooted6() {
        String buildTags = android.os.Build.TAGS;
        if (buildTags != null && buildTags.contains("test-keys")) {
            return true;
        }
        return false;
    }

    private static boolean checkRooted7() {
        int secureProp;
        String roSecureObj = getProperty("ro.secure");
        if (roSecureObj == null) secureProp = 1;
        else {
            if ("0".equals(roSecureObj)) secureProp = 0;
            else secureProp = 1;
        }
        return secureProp == 0;
    }

    private static ArrayList<String> executeCommand(String[] shellCmd) {
        String line = null;
        ArrayList<String> fullResponse = new ArrayList<String>();
        Process localProcess = null;
        try {
            localProcess = Runtime.getRuntime().exec(shellCmd);
        } catch (Exception e) {
            return null;
        }
        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(localProcess.getOutputStream()));
        BufferedReader in = new BufferedReader(new InputStreamReader(localProcess.getInputStream()));
        try {
            while ((line = in.readLine()) != null) {
                fullResponse.add(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("RootUtil", "checkRooted5错误: " + e.toString());
        }
        return fullResponse;
    }

    private static Boolean writeFile(String fileName, String message) {
        try {
            FileOutputStream fout = new FileOutputStream(fileName);
            byte[] bytes = message.getBytes();
            fout.write(bytes);
            fout.close();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("RootUtil", "writeFile错误: " + e.toString());
            return false;
        }
    }

    private static String readFile(String fileName) {
        File file = new File(fileName);
        try {
            FileInputStream fis = new FileInputStream(file);
            byte[] bytes = new byte[1024];
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            int len;
            while ((len = fis.read(bytes)) > 0) {
                bos.write(bytes, 0, len);
            }
            String result = new String(bos.toByteArray());
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("RootUtil", "readFile错误: " + e.toString());
            return null;
        }
    }

    public static String getProperty(String propName) {
        String value = null;
        Object roSecureObj;
        try {
            roSecureObj = Class.forName("android.os.SystemProperties")
                    .getMethod("get", String.class)
                    .invoke(null, propName);
            if (roSecureObj != null) value = (String) roSecureObj;
        } catch (Exception e) {
            value = null;
        } finally {
            return value;
        }
    }
}
