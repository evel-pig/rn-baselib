package com.reactlibrary.utils;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Build;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;

import com.reactlibrary.RNBaselibModule;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

public class EmulatorUtils {
    /**
     * 是否是在模拟器运行
     * @return 是否是模拟器
     */
    public static boolean isEmulator() {
        if (isEmulatorHandle1()) return true;
//        if (isEmulatorHandle2()) return true;
//        if (isEmulatorHandle3()) return true;
        if (isEmulatorHandle4()) return true;
        if (isEmulatorHandle5()) return true;
        if (isEmulatorHandle6()) return true;
        if (isEmulatorHandle7()) return true;
        if (isEmulatorHandle8()) return true;
        return false;
    }

    // Device ID 方式 / Default Number 方式
    private static boolean isEmulatorHandle1() {
        try {
            String[] known_device_ids = {
                    "000000", "00000000", "0000000000", "00000000000", "000000000000", "0000000000000",
                    "00000000000000", "000000000000000", "e21833235b6eef10", "012345678912345"
            };
            String[] known_numbers = {
                    "15555215554",
                    "15555215556", "15555215558", "15555215560", "15555215562", "15555215564", "15555215566",
                    "15555215568", "15555215570", "15555215572", "15555215574", "15555215576", "15555215578",
                    "15555215580", "15555215582", "15555215584"
            };
            String[] known_imsi_ids = {"310260000000000"};

            TelephonyManager tm = (TelephonyManager) RNBaselibModule.appContext.getSystemService(Context.TELEPHONY_SERVICE);
            String imei = tm.getDeviceId();
            for (String known_deviceId : known_device_ids) {
                if (known_deviceId.equalsIgnoreCase(imei)) {
                    return true;
                }
            }

            String phoneNumber = tm.getLine1Number();
            for (String number : known_numbers) {
                if (number.equalsIgnoreCase(phoneNumber)) {
                    return true;
                }
            }

            String imsi = tm.getSubscriberId();
            for (String known_imsi : known_imsi_ids) {
                if (known_imsi.equalsIgnoreCase(imsi)) {
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("EmulatorUtils", "isEmulatorHandle1错误: " + e.toString());
        }
        return (Build.MODEL.equals("sdk")) || (Build.MODEL.equals("google_sdk")) || Build.MODEL.contains("Emulator") || Build.MODEL.contains
                ("Android SDK built for x86") || Build.MANUFACTURER.contains("Genymotion") || "google_sdk".equals(Build.PRODUCT) || "vbox86p"
                .equals(Build.PRODUCT);
    }

    // Build类 (误报较多)
    private static boolean isEmulatorHandle2() {
        String BOARD = android.os.Build.BOARD;
        String BRAND = android.os.Build.BRAND;
        String DEVICE = android.os.Build.DEVICE;
        String HARDWARE = android.os.Build.HARDWARE;
        String MODEL = android.os.Build.MODEL;
        String PRODUCT = android.os.Build.PRODUCT;
        if ((BOARD.compareTo("unknown") == 0)
                || (BRAND.compareTo("generic") == 0) || (DEVICE.compareTo("generic") == 0)
                || (MODEL.compareTo("sdk") == 0) || (PRODUCT.compareTo("sdk") == 0)
                || (HARDWARE.compareTo("goldfish") == 0)) {
            return true;
        }
        return false;
    }

    // CPU架构 (误报较多)
    private static boolean isEmulatorHandle3() {
        String result = "";
        try {
            String[] args = {"/system/bin/cat", "/proc/cpuinfo"};
            ProcessBuilder cmd = new ProcessBuilder(args);
            Process process = cmd.start();
            StringBuffer sb = new StringBuffer();
            String readLine = "";
            BufferedReader responseReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "utf-8"));
            while ((readLine = responseReader.readLine()) != null) {
                sb.append(readLine);
            }
            responseReader.close();
            result = sb.toString().toLowerCase();
        } catch (IOException e) {
            e.printStackTrace();
            Log.e("EmulatorUtils", "isEmulatorHandle3错误: " + e.toString());
        }
        return (!result.contains("arm")) || (result.contains("intel")) || (result.contains("amd"));
    }

    // 运营商名
    private static boolean isEmulatorHandle4() {
        String szOperatorName = ((TelephonyManager) RNBaselibModule.appContext.getSystemService(Context.TELEPHONY_SERVICE)).getNetworkOperatorName();
        return szOperatorName.equalsIgnoreCase("android");
    }

    // 检查是否存在已知的Genemytion环境文件
    private static boolean isEmulatorHandle5() {
        String[] known_geny_files = {
                "/dev/socket/genyd",
                "/dev/socket/baseband_genyd"
        };
        for (String file : known_geny_files) {
            File geny_file = new File(file);
            if (geny_file.exists()) {
                return true;
            }
        }
        return false;
    }

    // eth0
    private static boolean isEmulatorHandle6() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                if (intf.getName().equals("eth0")) {
                    return true;
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
            Log.e("EmulatorUtils", "isEmulatorHandle6错误: " + e.toString());
        }
        return false;
    }

    // 检查是否存在已知的QEMU使用的管道
    private static boolean isEmulatorHandle7() {
        String[] known_pipes = {"/dev/socket/qemud", "/dev/qemu_pipe"};
        for (String pipe : known_pipes) {
            File qemu_socket = new File(pipe);
            if (qemu_socket.exists()) {
                return true;
            }
        }
        return false;
    }

    // 特殊的模拟器特征文件, 186项文件，查到一个文件就是百分百模拟器
    private static boolean isEmulatorHandle8() {
        String[] known_bluestacks = {
                // vbox模拟器文件
                "/data/youwave_id",
                "/dev/vboxguest",
                "/dev/vboxuser",
                "/mnt/prebundledapps/bluestacks.prop.orig",
                "/mnt/prebundledapps/propfiles/ics.bluestacks.prop.note",
                "/mnt/prebundledapps/propfiles/ics.bluestacks.prop.s2",
                "/mnt/prebundledapps/propfiles/ics.bluestacks.prop.s3",
                "/mnt/sdcard/bstfolder/InputMapper/com.bluestacks.appmart.cfg",
                "/mnt/sdcard/buildroid-gapps-ics-20120317-signed.tgz",
                "/mnt/sdcard/windows/InputMapper/com.bluestacks.appmart.cfg",
                "/proc/irq/9/vboxguest",
                "/sys/bus/pci/drivers/vboxguest",
                "/sys/bus/pci/drivers/vboxguest/0000:00:04.0",
                "/sys/bus/pci/drivers/vboxguest/bind",
                "/sys/bus/pci/drivers/vboxguest/module",
                "/sys/bus/pci/drivers/vboxguest/new_id",
                "/sys/bus/pci/drivers/vboxguest/remove_id",
                "/sys/bus/pci/drivers/vboxguest/uevent",
                "/sys/bus/pci/drivers/vboxguest/unbind",
                "/sys/bus/platform/drivers/qemu_pipe",
                "/sys/bus/platform/drivers/qemu_trace",
                "/sys/class/bdi/vboxsf-c",
                "/sys/class/misc/vboxguest",
                "/sys/class/misc/vboxuser",
                "/sys/devices/virtual/bdi/vboxsf-c",
                "/sys/devices/virtual/misc/vboxguest",
                "/sys/devices/virtual/misc/vboxguest/dev",
                "/sys/devices/virtual/misc/vboxguest/power",
                "/sys/devices/virtual/misc/vboxguest/subsystem",
                "/sys/devices/virtual/misc/vboxguest/uevent",
                "/sys/devices/virtual/misc/vboxuser",
                "/sys/devices/virtual/misc/vboxuser/dev",
                "/sys/devices/virtual/misc/vboxuser/power",
                "/sys/devices/virtual/misc/vboxuser/subsystem",
                "/sys/devices/virtual/misc/vboxuser/uevent",
                "/sys/module/vboxguest",
                "/sys/module/vboxguest/coresize",
                "/sys/module/vboxguest/drivers",
                "/sys/module/vboxguest/drivers/pci:vboxguest",
                "/sys/module/vboxguest/holders",
                "/sys/module/vboxguest/holders/vboxsf",
                "/sys/module/vboxguest/initsize",
                "/sys/module/vboxguest/initstate",
                "/sys/module/vboxguest/notes",
                "/sys/module/vboxguest/notes/.note.gnu.build-id",
                "/sys/module/vboxguest/parameters",
                "/sys/module/vboxguest/parameters/log",
                "/sys/module/vboxguest/parameters/log_dest",
                "/sys/module/vboxguest/parameters/log_flags",
                "/sys/module/vboxguest/refcnt",
                "/sys/module/vboxguest/sections",
                "/sys/module/vboxguest/sections/.altinstructions",
                "/sys/module/vboxguest/sections/.altinstr_replacement",
                "/sys/module/vboxguest/sections/.bss",
                "/sys/module/vboxguest/sections/.data",
                "/sys/module/vboxguest/sections/.devinit.data",
                "/sys/module/vboxguest/sections/.exit.text",
                "/sys/module/vboxguest/sections/.fixup",
                "/sys/module/vboxguest/sections/.gnu.linkonce.this_module",
                "/sys/module/vboxguest/sections/.init.text",
                "/sys/module/vboxguest/sections/.note.gnu.build-id",
                "/sys/module/vboxguest/sections/.rodata",
                "/sys/module/vboxguest/sections/.rodata.str1.1",
                "/sys/module/vboxguest/sections/.smp_locks",
                "/sys/module/vboxguest/sections/.strtab",
                "/sys/module/vboxguest/sections/.symtab",
                "/sys/module/vboxguest/sections/.text",
                "/sys/module/vboxguest/sections/__ex_table",
                "/sys/module/vboxguest/sections/__ksymtab",
                "/sys/module/vboxguest/sections/__ksymtab_strings",
                "/sys/module/vboxguest/sections/__param",
                "/sys/module/vboxguest/srcversion",
                "/sys/module/vboxguest/taint",
                "/sys/module/vboxguest/uevent",
                "/sys/module/vboxguest/version",
                "/sys/module/vboxsf",
                "/sys/module/vboxsf/coresize",
                "/sys/module/vboxsf/holders",
                "/sys/module/vboxsf/initsize",
                "/sys/module/vboxsf/initstate",
                "/sys/module/vboxsf/notes",
                "/sys/module/vboxsf/notes/.note.gnu.build-id",
                "/sys/module/vboxsf/refcnt",
                "/sys/module/vboxsf/sections",
                "/sys/module/vboxsf/sections/.bss",
                "/sys/module/vboxsf/sections/.data",
                "/sys/module/vboxsf/sections/.exit.text",
                "/sys/module/vboxsf/sections/.gnu.linkonce.this_module",
                "/sys/module/vboxsf/sections/.init.text",
                "/sys/module/vboxsf/sections/.note.gnu.build-id",
                "/sys/module/vboxsf/sections/.rodata",
                "/sys/module/vboxsf/sections/.rodata.str1.1",
                "/sys/module/vboxsf/sections/.smp_locks",
                "/sys/module/vboxsf/sections/.strtab",
                "/sys/module/vboxsf/sections/.symtab",
                "/sys/module/vboxsf/sections/.text",
                "/sys/module/vboxsf/sections/__bug_table",
                "/sys/module/vboxsf/sections/__param",
                "/sys/module/vboxsf/srcversion",
                "/sys/module/vboxsf/taint",
                "/sys/module/vboxsf/uevent",
                "/sys/module/vboxsf/version",
                "/sys/module/vboxvideo",
                "/sys/module/vboxvideo/coresize",
                "/sys/module/vboxvideo/holders",
                "/sys/module/vboxvideo/initsize",
                "/sys/module/vboxvideo/initstate",
                "/sys/module/vboxvideo/notes",
                "/sys/module/vboxvideo/notes/.note.gnu.build-id",
                "/sys/module/vboxvideo/refcnt",
                "/sys/module/vboxvideo/sections",
                "/sys/module/vboxvideo/sections/.data",
                "/sys/module/vboxvideo/sections/.exit.text",
                "/sys/module/vboxvideo/sections/.gnu.linkonce.this_module",
                "/sys/module/vboxvideo/sections/.init.text",
                "/sys/module/vboxvideo/sections/.note.gnu.build-id",
                "/sys/module/vboxvideo/sections/.rodata.str1.1",
                "/sys/module/vboxvideo/sections/.strtab",
                "/sys/module/vboxvideo/sections/.symtab",
                "/sys/module/vboxvideo/sections/.text",
                "/sys/module/vboxvideo/srcversion",
                "/sys/module/vboxvideo/taint",
                "/sys/module/vboxvideo/uevent",
                "/sys/module/vboxvideo/version",
                "/system/app/bluestacksHome.apk",
                "/system/bin/androVM-prop",
                "/system/bin/androVM-vbox-sf",
                "/system/bin/androVM_setprop",
                "/system/bin/get_androVM_host",
                "/system/bin/mount.vboxsf",
                "/system/etc/init.androVM.sh",
                "/system/etc/init.buildroid.sh",
                "/system/lib/hw/audio.primary.vbox86.so",
                "/system/lib/hw/camera.vbox86.so",
                "/system/lib/hw/gps.vbox86.so",
                "/system/lib/hw/gralloc.vbox86.so",
                "/system/lib/hw/sensors.vbox86.so",
                "/system/lib/modules/3.0.8-android-x86+/extra/vboxguest",
                "/system/lib/modules/3.0.8-android-x86+/extra/vboxguest/vboxguest.ko",
                "/system/lib/modules/3.0.8-android-x86+/extra/vboxsf",
                "/system/lib/modules/3.0.8-android-x86+/extra/vboxsf/vboxsf.ko",
                "/system/lib/vboxguest.ko",
                "/system/lib/vboxsf.ko",
                "/system/lib/vboxvideo.ko",
                "/system/usr/idc/androVM_Virtual_Input.idc",
                "/system/usr/keylayout/androVM_Virtual_Input.kl",
                "/system/xbin/mount.vboxsf",
                "/ueventd.android_x86.rc",
                "/ueventd.vbox86.rc",
                "/ueventd.goldfish.rc",
                "/fstab.vbox86",
                "/init.vbox86.rc",
                "/init.goldfish.rc",
                // ========针对原生Android模拟器 内核：goldfish===========
                "/sys/module/goldfish_audio",
                "/sys/module/goldfish_sync",
                // ========针对蓝叠模拟器===========
                "/data/app/com.bluestacks.appmart-1.apk",
                "/data/app/com.bluestacks.BstCommandProcessor-1.apk",
                "/data/app/com.bluestacks.help-1.apk",
                "/data/app/com.bluestacks.home-1.apk",
                "/data/app/com.bluestacks.s2p-1.apk",
                "/data/app/com.bluestacks.searchapp-1.apk",
                "/data/bluestacks.prop",
                "/data/data/com.androVM.vmconfig",
                "/data/data/com.bluestacks.accelerometerui",
                "/data/data/com.bluestacks.appfinder",
                "/data/data/com.bluestacks.appmart",
                "/data/data/com.bluestacks.appsettings",
                "/data/data/com.bluestacks.BstCommandProcessor",
                "/data/data/com.bluestacks.bstfolder",
                "/data/data/com.bluestacks.help",
                "/data/data/com.bluestacks.home",
                "/data/data/com.bluestacks.s2p",
                "/data/data/com.bluestacks.searchapp",
                "/data/data/com.bluestacks.settings",
                "/data/data/com.bluestacks.setup",
                "/data/data/com.bluestacks.spotlight",
                // ========针对逍遥安卓模拟器===========
                "/data/data/com.microvirt.download",
                "/data/data/com.microvirt.guide",
                "/data/data/com.microvirt.installer",
                "/data/data/com.microvirt.launcher",
                "/data/data/com.microvirt.market",
                "/data/data/com.microvirt.memuime",
                "/data/data/com.microvirt.tools",
                // ========针对Mumu模拟器===========
                "/data/data/com.mumu.launcher",
                "/data/data/com.mumu.store",
                "/data/data/com.netease.mumu.cloner"
        };
        try {
            for (int i = 0; i < known_bluestacks.length; i++) {
                String file_name = known_bluestacks[i];
                File qemu_file = new File(file_name);
                if (qemu_file.exists()) {
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("EmulatorUtils", "isEmulatorHandle8错误: " + e.toString());
        }
        return false;
    }

    private static boolean isEmulatorHandle9() {
        int suspectCount = 0;
        try {
            String baseBandVersion = getProperty("gsm.version.baseband");
            if (null == baseBandVersion || baseBandVersion.contains("1.0.0.0"))
                ++suspectCount;

            String buildFlavor = getProperty("ro.build.flavor");
            if (null == buildFlavor || buildFlavor.contains("vbox") || buildFlavor.contains("sdk_gphone"))
                ++suspectCount;

            String productBoard = getProperty("ro.product.board");
            if (null == productBoard || productBoard.contains("android") | productBoard.contains("goldfish"))
                ++suspectCount;

            String boardPlatform = getProperty("ro.board.platform");
            if (null == boardPlatform || boardPlatform.contains("android"))
                ++suspectCount;

            String hardWare = getProperty("ro.hardware");
            if (null == hardWare) ++suspectCount;
            else if (hardWare.toLowerCase().contains("ttvm")) suspectCount += 10;
            else if (hardWare.toLowerCase().contains("nox")) suspectCount += 10;

            String cameraFlash = "";
            String sensorNum = "sensorNum";
            boolean isSupportCameraFlash = RNBaselibModule.appContext.getPackageManager().hasSystemFeature("android.hardware.camera.flash");
            if (!isSupportCameraFlash) ++suspectCount;
            cameraFlash = isSupportCameraFlash ? "support CameraFlash" : "unsupport CameraFlash";

            SensorManager sm = (SensorManager) RNBaselibModule.appContext.getSystemService(Context.SENSOR_SERVICE);
            int sensorSize = sm.getSensorList(Sensor.TYPE_ALL).size();
            if (sensorSize < 7) ++suspectCount;
            sensorNum = sensorNum + sensorSize;

            String userApps = exec("pm list package -3");
            String userAppNum = "userAppNum";
            int userAppSize = getUserAppNums(userApps);
            if (userAppSize < 5) ++suspectCount;
            userAppNum = userAppNum + userAppSize;

            String filter = exec("cat /proc/self/cgroup");
            if (null == filter) ++suspectCount;
        } catch (Exception e) {
            Log.e("EmulatorUtils", "isEmulatorHandle9错误: " + e.toString());
        }

        return suspectCount > 3;
    }

    private static int getUserAppNums(String userApps) {
        String[] result = userApps.split("package:");
        return result.length;
    }

    private static String getProperty(String propName) {
        String property = RootUtil.getProperty(propName);
        return TextUtils.isEmpty(property) ? null : property;
    }

    /**
     * exec 命令
     * @param command
     * @return
     */
    public static String exec(String command) {
        BufferedOutputStream bufferedOutputStream = null;
        BufferedInputStream bufferedInputStream = null;
        Process process = null;
        try {
            process = Runtime.getRuntime().exec("sh");
            bufferedOutputStream = new BufferedOutputStream(process.getOutputStream());

            bufferedInputStream = new BufferedInputStream(process.getInputStream());
            bufferedOutputStream.write(command.getBytes());
            bufferedOutputStream.write('\n');
            bufferedOutputStream.flush();
            bufferedOutputStream.close();
            process.waitFor();
            String outputStr = getStrFromBufferInputSteam(bufferedInputStream);
            return outputStr;
        } catch (Exception e) {
            return null;
        } finally {
            if (bufferedOutputStream != null) {
                try {
                    bufferedOutputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bufferedInputStream != null) {
                try {
                    bufferedInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (process != null) {
                process.destroy();
            }
        }
    }

    private static String getStrFromBufferInputSteam(BufferedInputStream bufferedInputStream) {
        if (null == bufferedInputStream) {
            return "";
        }
        int BUFFER_SIZE = 512;
        byte[] buffer = new byte[BUFFER_SIZE];
        StringBuilder result = new StringBuilder();
        try {
            while (true) {
                int read = bufferedInputStream.read(buffer);
                if (read > 0) {
                    result.append(new String(buffer, 0, read));
                }
                if (read < BUFFER_SIZE) {
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result.toString();
    }
}
