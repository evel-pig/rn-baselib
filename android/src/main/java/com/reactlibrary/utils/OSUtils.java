package com.reactlibrary.utils;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.reactlibrary.RNBaselibModule;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Deprecated
public class OSUtils {

    /**
     * ROM 类型
     */
    private static final ROM ROM_TYPE = initRomType();

    private static final String KEY_DISPLAY_ID      = "ro.build.display.id";
    private static final String KEY_BASE_OS_VERSION = "ro.build.version.base_os";
    private static final String KEY_CLIENT_ID_BASE  = "ro.com.google.clientidbase";

    // 小米 : MIUI
    private static final String KEY_MIUI_VERSION      = "ro.build.version.incremental"; // "7.6.15"
    private static final String KEY_MIUI_VERSION_NANE = "ro.miui.ui.version.name"; // "V8"
    private static final String KEY_MIUI_VERSION_CODE = "ro.miui.ui.version.code"; // "6"
    private static final String KEY_MIUI_VERSION_STORAGE = "ro.miui.internal.storage";
    private static final String VALUE_MIUI_CLIENT_ID_BASE = "android-xiaomi";
    // 华为 : EMUI
    private static final String KEY_EMUI_VERSION          = "ro.build.version.emui"; // "EmotionUI_3.0"
    private static final String KEY_EMUI_API_LEVEL        = "ro.build.hw_emui_api_level"; //
    private static final String KEY_EMUI_SYSTEM_VERSION   = "ro.confg.hw_systemversion"; // "T1-A21wV100R001C233B008_SYSIMG"
    // 魅族 : Flyme
    private static final String KEY_FLYME_PUBLISHED       = "ro.flyme.published"; // "true"
    private static final String KEY_FLYME_SETUP           = "ro.meizu.setupwizard.flyme"; // "true"
    private static final String VALUE_FLYME_DISPLAY_ID_CONTAIN = "Flyme"; // "Flyme OS 4.5.4.2U"
    // OPPO : ColorOS
    private static final String KEY_COLOROS_VERSION            = "ro.oppo.theme.version"; // "703"
    private static final String KEY_COLOROS_THEME_VERSION      = "ro.oppo.version"; // ""
    private static final String KEY_COLOROS_ROM_VERSION        = "ro.rom.different.version"; // "ColorOS2.1"

    private static final String VALUE_COLOROS_BASE_OS_VERSION_CONTAIN = "OPPO"; // "OPPO/R7sm/R7sm:5.1.1/LMY47V/1440928800:user/release-keys"
    private static final String VALUE_COLOROS_CLIENT_ID_BASE          = "android-oppo";
    // vivo : FuntouchOS
    private static final String KEY_FUNTOUCHOS_BOARD_VERSION          = "ro.vivo.board.version"; // "MD"
    private static final String KEY_FUNTOUCHOS_OS_NAME                = "ro.vivo.os.name"; // "Funtouch"
    private static final String KEY_FUNTOUCHOS_OS_VERSION             = "ro.vivo.os.version"; // "3.0"
    private static final String KEY_FUNTOUCHOS_DISPLAY_ID             = "ro.vivo.os.build.display.id"; // "FuntouchOS_3.0"
    private static final String KEY_FUNTOUCHOS_ROM_VERSION            = "ro.vivo.rom.version"; // "rom_3.1"
    private static final String VALUE_FUNTOUCHOS_CLIENT_ID_BASE       = "android-vivo";
    // Samsung
    private static final String VALUE_SAMSUNG_BASE_OS_VERSION_CONTAIN = "samsung"; //
    // "samsung/zeroltezc/zeroltechn:6.0.1/MMB29K/G9250ZCU2DQD1:user/release-keys"
    private static final String VALUE_SAMSUNG_CLIENT_ID_BASE          = "android-samsung";
    // Sony
    private static final String KEY_SONY_PROTOCOL_TYPE                = "ro.sony.irremote.protocol_type"; // "2"
    private static final String KEY_SONY_ENCRYPTED_DATA               = "ro.sony.fota.encrypteddata"; // "supported"
    private static final String VALUE_SONY_CLIENT_ID_BASE   = "android-sonyericsson";
    // 乐视 : eui
    private static final String KEY_EUI_VERSION             = "ro.letv.release.version"; // "5.9.023S"
    private static final String KEY_EUI_VERSION_DATE        = "ro.letv.release.version_date"; // "5.9.023S_03111"
    private static final String KEY_EUI_NAME                = "ro.product.letv_name"; // "乐1s"
    private static final String KEY_EUI_MODEL               = "ro.product.letv_model"; // "Letv X500"
    // 金立 : amigo
    private static final String KEY_AMIGO_ROM_VERSION       = "ro.gn.gnromvernumber"; // "GIONEE ROM5.0.16"
    private static final String KEY_AMIGO_SYSTEM_UI_SUPPORT = "ro.gn.amigo.systemui.support"; // "yes"
    private static final String VALUE_AMIGO_DISPLAY_ID_CONTAIN = "amigo"; // "amigo3.5.1"
    private static final String VALUE_AMIGO_CLIENT_ID_BASE     = "android-gionee";
    // 酷派 : yulong
    private static final String KEY_YULONG_VERSION_RELEASE     = "ro.yulong.version.release"; // "5.1.046.P1.150921.8676_M01"
    private static final String KEY_YULONG_VERSION_TAG         = "ro.yulong.version.tag"; // "LC"
    private static final String VALUE_YULONG_CLIENT_ID_BASE = "android-coolpad";
    // HTC : Sense
    private static final String KEY_SENSE_BUILD_STAGE       = "htc.build.stage"; // "2"
    private static final String KEY_SENSE_BLUETOOTH_SAP     = "ro.htc.bluetooth.sap"; // "true"
    private static final String VALUE_SENSE_CLIENT_ID_BASE = "android-htc-rev";
    // LG : LG
    private static final String KEY_LG_SW_VERSION          = "ro.lge.swversion"; // "D85720b"
    private static final String KEY_LG_SW_VERSION_SHORT    = "ro.lge.swversion_short"; // "V20b"
    private static final String KEY_LG_FACTORY_VERSION     = "ro.lge.factoryversion"; // "LGD857AT-00-V20b-CUO-CN-FEB-17-2015+0"
    // 联想
    private static final String KEY_LENOVO_DEVICE          = "ro.lenovo.device"; // "phone"
    private static final String KEY_LENOVO_PLATFORM        = "ro.lenovo.platform"; // "qualcomm"
    private static final String KEY_LENOVO_ADB             = "ro.lenovo.adb"; // "apkctl,speedup"
    private static final String VALUE_LENOVO_CLIENT_ID_BASE = "android-lenovo";

    private OSUtils() {}

    /**
     * 获取 ROM 类型
     *
     * @return ROM
     */
    public static ROM getRomType() {
        return ROM_TYPE;
    }

    /**
     * 初始化 ROM 类型
     */
    private static ROM initRomType() {
        ROM rom = ROM.Other;
        FileInputStream is = null;
        try {
            Properties buildProperties = new Properties();
            is = new FileInputStream(new File(Environment.getRootDirectory(), "build.prop"));
            buildProperties.load(is);

            if (buildProperties.containsKey(KEY_MIUI_VERSION_NANE) ||
                    buildProperties.containsKey(KEY_MIUI_VERSION_CODE) ||
                    buildProperties.containsKey(KEY_MIUI_VERSION_STORAGE)) {
                // MIUI
                rom = ROM.MIUI;
                if (buildProperties.containsKey(KEY_MIUI_VERSION_NANE)) {
                    String versionName = buildProperties.getProperty(KEY_MIUI_VERSION_NANE);
                    if (!TextUtils.isEmpty(versionName) && versionName.matches("[Vv]\\d+")) { // V8
                        try {
                            rom.setBaseVersion(Integer.parseInt(versionName.split("[Vv]")[1]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
                if (buildProperties.containsKey(KEY_MIUI_VERSION)) {
                    String versionStr = buildProperties.getProperty(KEY_MIUI_VERSION);
                    if (!TextUtils.isEmpty(versionStr) && versionStr.matches("[\\d.]+")) {
                        rom.setVersion(versionStr);
                    }
                }
            } else if (buildProperties.containsKey(KEY_EMUI_VERSION) || buildProperties.containsKey(KEY_EMUI_API_LEVEL) || buildProperties
                    .containsKey(KEY_EMUI_SYSTEM_VERSION)) {
                // EMUI
                rom = ROM.EMUI;
                if (buildProperties.containsKey(KEY_EMUI_VERSION)) {
                    String versionStr = buildProperties.getProperty(KEY_EMUI_VERSION);
                    Matcher matcher = Pattern.compile("EmotionUI_([\\d.]+)").matcher(versionStr); // EmotionUI_3.0
                    if (!TextUtils.isEmpty(versionStr) && matcher.find()) {
                        try {
                            String version = matcher.group(1);
                            rom.setVersion(version);
                            rom.setBaseVersion(Integer.parseInt(version.split("\\.")[0]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else if (buildProperties.containsKey(KEY_FLYME_SETUP) || buildProperties.containsKey(KEY_FLYME_PUBLISHED)) {
                // Flyme
                rom = ROM.Flyme;
                if (buildProperties.containsKey(KEY_DISPLAY_ID)) {
                    String versionStr = buildProperties.getProperty(KEY_DISPLAY_ID);
                    Matcher matcher = Pattern.compile("Flyme[^\\d]*([\\d.]+)[^\\d]*").matcher(versionStr); // Flyme OS 4.5.4.2U
                    if (!TextUtils.isEmpty(versionStr) && matcher.find()) {
                        try {
                            String version = matcher.group(1);
                            rom.setVersion(version);
                            rom.setBaseVersion(Integer.parseInt(version.split("\\.")[0]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else if (buildProperties.containsKey(KEY_COLOROS_VERSION) || buildProperties.containsKey(KEY_COLOROS_THEME_VERSION) ||
                    buildProperties.containsKey(KEY_COLOROS_ROM_VERSION)) {
                // ColorOS
                rom = ROM.ColorOS;
                if (buildProperties.containsKey(KEY_COLOROS_ROM_VERSION)) {
                    String versionStr = buildProperties.getProperty(KEY_COLOROS_ROM_VERSION);
                    Matcher matcher = Pattern.compile("ColorOS([\\d.]+)").matcher(versionStr); // ColorOS2.1
                    if (!TextUtils.isEmpty(versionStr) && matcher.find()) {
                        try {
                            String version = matcher.group(1);
                            rom.setVersion(version);
                            rom.setBaseVersion(Integer.parseInt(version.split("\\.")[0]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else if (buildProperties.containsKey(KEY_FUNTOUCHOS_OS_NAME) || buildProperties.containsKey(KEY_FUNTOUCHOS_OS_VERSION) ||
                    buildProperties.containsKey(KEY_FUNTOUCHOS_DISPLAY_ID)) {
                // FuntouchOS
                rom = ROM.FuntouchOS;
                if (buildProperties.containsKey(KEY_FUNTOUCHOS_OS_VERSION)) {
                    String versionStr = buildProperties.getProperty(KEY_FUNTOUCHOS_OS_VERSION);
                    if (!TextUtils.isEmpty(versionStr) && versionStr.matches("[\\d.]+")) { // 3.0
                        try {
                            rom.setVersion(versionStr);
                            rom.setBaseVersion(Integer.parseInt(versionStr.split("\\.")[0]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else if (buildProperties.containsKey(KEY_EUI_VERSION) || buildProperties.containsKey(KEY_EUI_NAME) || buildProperties.containsKey
                    (KEY_EUI_MODEL)) {
                // EUI
                rom = ROM.EUI;
                if (buildProperties.containsKey(KEY_EUI_VERSION)) {
                    String versionStr = buildProperties.getProperty(KEY_EUI_VERSION);
                    Matcher matcher = Pattern.compile("([\\d.]+)[^\\d]*").matcher(versionStr); // 5.9.023S
                    if (!TextUtils.isEmpty(versionStr) && matcher.find()) {
                        try {
                            String version = matcher.group(1);
                            rom.setVersion(version);
                            rom.setBaseVersion(Integer.parseInt(version.split("\\.")[0]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else if (buildProperties.containsKey(KEY_AMIGO_ROM_VERSION) || buildProperties.containsKey(KEY_AMIGO_SYSTEM_UI_SUPPORT)) {
                // amigo
                rom = ROM.AmigoOS;
                if (buildProperties.containsKey(KEY_DISPLAY_ID)) {
                    String versionStr = buildProperties.getProperty(KEY_DISPLAY_ID);
                    Matcher matcher = Pattern.compile("amigo([\\d.]+)[a-zA-Z]*").matcher(versionStr); // "amigo3.5.1"
                    if (!TextUtils.isEmpty(versionStr) && matcher.find()) {
                        try {
                            String version = matcher.group(1);
                            rom.setVersion(version);
                            rom.setBaseVersion(Integer.parseInt(version.split("\\.")[0]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else if (buildProperties.containsKey(KEY_SONY_PROTOCOL_TYPE) || buildProperties.containsKey(KEY_SONY_ENCRYPTED_DATA)) {
                // Sony
                rom = ROM.Sony;
            } else if (buildProperties.containsKey(KEY_YULONG_VERSION_RELEASE) || buildProperties.containsKey(KEY_YULONG_VERSION_TAG)) {
                // YuLong
                rom = ROM.YuLong;
            } else if (buildProperties.containsKey(KEY_SENSE_BUILD_STAGE) || buildProperties.containsKey(KEY_SENSE_BLUETOOTH_SAP)) {
                // Sense
                rom = ROM.Sense;
            } else if (buildProperties.containsKey(KEY_LG_SW_VERSION) || buildProperties.containsKey(KEY_LG_SW_VERSION_SHORT) || buildProperties
                    .containsKey(KEY_LG_FACTORY_VERSION)) {
                // LG
                rom = ROM.LG;
            } else if (buildProperties.containsKey(KEY_LENOVO_DEVICE) || buildProperties.containsKey(KEY_LENOVO_PLATFORM) || buildProperties
                    .containsKey(KEY_LENOVO_ADB)) {
                // Lenovo
                rom = ROM.Lenovo;
            } else if (buildProperties.containsKey(KEY_DISPLAY_ID)) {
                String displayId = buildProperties.getProperty(KEY_DISPLAY_ID);
                if (!TextUtils.isEmpty(displayId)) {
                    if (displayId.contains(VALUE_FLYME_DISPLAY_ID_CONTAIN)) {
                        return ROM.Flyme;
                    } else if (displayId.contains(VALUE_AMIGO_DISPLAY_ID_CONTAIN)) {
                        return ROM.AmigoOS;
                    }
                }
            } else if (buildProperties.containsKey(KEY_BASE_OS_VERSION)) {
                String baseOsVersion = buildProperties.getProperty(KEY_BASE_OS_VERSION);
                if (!TextUtils.isEmpty(baseOsVersion)) {
                    if (baseOsVersion.contains(VALUE_COLOROS_BASE_OS_VERSION_CONTAIN)) {
                        return ROM.ColorOS;
                    } else if (baseOsVersion.contains(VALUE_SAMSUNG_BASE_OS_VERSION_CONTAIN)) {
                        return ROM.SamSung;
                    }
                }
            } else if (buildProperties.containsKey(KEY_CLIENT_ID_BASE)) {
                String clientIdBase = buildProperties.getProperty(KEY_CLIENT_ID_BASE);
                switch (clientIdBase) {
                    case VALUE_MIUI_CLIENT_ID_BASE:
                        return ROM.MIUI;
                    case VALUE_COLOROS_CLIENT_ID_BASE:
                        return ROM.ColorOS;
                    case VALUE_FUNTOUCHOS_CLIENT_ID_BASE:
                        return ROM.FuntouchOS;
                    case VALUE_SAMSUNG_CLIENT_ID_BASE:
                        return ROM.SamSung;
                    case VALUE_SONY_CLIENT_ID_BASE:
                        return ROM.Sony;
                    case VALUE_YULONG_CLIENT_ID_BASE:
                        return ROM.YuLong;
                    case VALUE_SENSE_CLIENT_ID_BASE:
                        return ROM.Sense;
                    case VALUE_LENOVO_CLIENT_ID_BASE:
                        return ROM.Lenovo;
                    case VALUE_AMIGO_CLIENT_ID_BASE:
                        return ROM.AmigoOS;
                    default:
                        break;
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return rom;
    }

    public enum ROM {
        MIUI, // 小米
        Flyme, // 魅族
        EMUI, // 华为
        ColorOS, // OPPO
        FuntouchOS, // vivo
        SmartisanOS, // 锤子
        EUI, // 乐视
        Sense, // HTC
        AmigoOS, // 金立
        _360OS, // 奇酷360
        NubiaUI, // 努比亚
        H2OS, // 一加
        YunOS, // 阿里巴巴
        YuLong, // 酷派
        SamSung, // 三星
        Sony, // 索尼
        Lenovo, // 联想
        LG, // LG
        Google, // 原生
        Other; // CyanogenMod, Lewa OS, 百度云OS, Tencent OS, 深度OS, IUNI OS, Tapas OS, Mokee

        private int    baseVersion = -1;
        private String version;

        void setVersion(String version) {
            this.version = version;
        }

        void setBaseVersion(int baseVersion) {
            this.baseVersion = baseVersion;
        }

        public int getBaseVersion() {
            return baseVersion;
        }

        public String getVersion() {
            return version;
        }
    }

    /**
     * 跳转系统权限设置页面
     * @return
     */
    public static boolean toPermissionSettingCenter() {
        boolean success = true;
        OSUtils.ROM romType = OSUtils.getRomType();
        String packageName = RNBaselibModule.appContext.getPackageName();
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.setData(Uri.parse("package:" + packageName));

        // Log.e("romType+++++====", romType.toString());

        switch (romType) {
            case EMUI: // 华为
                intent.putExtra("packageName", packageName);
                intent.setComponent(new ComponentName("com.huawei.systemmanager", "com.huawei.permissionmanager.ui.MainActivity"));
                break;
            case Flyme: // 魅族
                intent.setAction("com.meizu.safe.security.SHOW_APPSEC");
                intent.addCategory(Intent.CATEGORY_DEFAULT);
                intent.putExtra("packageName", packageName);
                break;
            case MIUI: // 小米
                String rom = getMiuiVersion();
                if ("V6".equals(rom) || "V7".equals(rom)) {
                    intent.setAction("miui.intent.action.APP_PERM_EDITOR");
                    intent.setClassName("com.miui.securitycenter", "com.miui.permcenter.permissions.AppPermissionsEditorActivity");
                    intent.putExtra("extra_pkgname", packageName);
                } else if ("V8".equals(rom) || "V9".equals(rom) || "V10".equals(rom)) {
                    intent.setAction("miui.intent.action.APP_PERM_EDITOR");
                    intent.setClassName("com.miui.securitycenter", "com.miui.permcenter.permissions.PermissionsEditorActivity");
                    intent.putExtra("extra_pkgname", packageName);
                }
                break;
            case Sony: // 索尼
                intent.putExtra("packageName", packageName);
                intent.setComponent(new ComponentName("com.sonymobile.cta", "com.sonymobile.cta.SomcCTAMainActivity"));
                break;
            case ColorOS: // OPPO
                intent.putExtra("packageName", packageName);
                intent.setComponent(new ComponentName("com.coloros.safecenter", "com.coloros.safecenter.permission.PermissionManagerActivity"));
                break;
            case EUI: // 乐视
                intent.putExtra("packageName", packageName);
                intent.setComponent(new ComponentName("com.letv.android.letvsafe", "com.letv.android.letvsafe.PermissionAndApps"));
                break;
            case LG: // LG
                intent.setAction("android.intent.action.MAIN");
                intent.putExtra("packageName", packageName);
                ComponentName comp = new ComponentName("com.android.settings", "com.android.settings.Settings$AccessLockSummaryActivity");
                intent.setComponent(comp);
                break;
            case SmartisanOS: // 锤子
                intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).setData(Uri.parse("package:" + packageName)).addFlags(Intent
                        .FLAG_ACTIVITY_NEW_TASK);
                break;
            case SamSung: // 三星
            default:
                Log.e("CustomBridgeManager: ", "没有识别该机romType, 跳转应用信息页面");
                success = false;
                break;
        }
        try {
            RNBaselibModule.appContext.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
            RNBaselibModule.appContext.startActivity(new Intent(Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            success = false;
            Log.e("CustomBridgeManager: ", "无法跳转权限界面, 开始跳转普通设置界面");
        }
        return success;
    }

    // 获取 MIUI 版本号
    private static String getMiuiVersion() {
        String propName = "ro.miui.ui.version.name";
        String line;
        BufferedReader input = null;
        try {
            Process p = Runtime.getRuntime().exec("getprop " + propName);
            input = new BufferedReader(new InputStreamReader(p.getInputStream()), 1024);
            line = input.readLine();
            input.close();
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return line;
    }

    /**
     * 跳转系统权限设置页面
     * @return
     */
    public static boolean toNotificationSetting() {
        boolean success = true;
        try {
            Intent localIntent = new Intent();
            String packageName = RNBaselibModule.appContext.getPackageName();
            if (android.os.Build.VERSION.SDK_INT >= 26) {
                localIntent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                localIntent.putExtra(Settings.EXTRA_APP_PACKAGE, packageName);
            }
            else if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP &&
                    android.os.Build.VERSION.SDK_INT < 26) {
                localIntent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
                localIntent.putExtra("app_package", packageName);
                localIntent.putExtra("app_uid", RNBaselibModule.appContext.getApplicationInfo().uid);
            } else if (android.os.Build.VERSION.SDK_INT == Build.VERSION_CODES.KITKAT) {
                localIntent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                localIntent.addCategory(Intent.CATEGORY_DEFAULT);
                localIntent.setData(Uri.parse("package:" + packageName));
            } else {
                ///< 4.4以下没有从app跳转到应用通知设置页面的Action，可考虑跳转到应用详情页面,
                localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                if (Build.VERSION.SDK_INT >= 9) {
                    localIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
                    localIntent.setData(Uri.fromParts("package", packageName, null));
                } else if (Build.VERSION.SDK_INT <= 8) {
                    localIntent.setAction(Intent.ACTION_VIEW);
                    localIntent.setClassName("com.android.settings", "com.android.setting.InstalledAppDetails");
                    localIntent.putExtra("com.android.settings.ApplicationPkgName", packageName);
                }
            }
            RNBaselibModule.appContext.startActivity(localIntent);
        } catch (Exception e) {
            e.printStackTrace();
            success = false;
            Log.e("CustomBridgeManager: ", "无法跳转权限消息推送界面, 开始跳转普通设置界面");
            RNBaselibModule.appContext.startActivity(new Intent(Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        }
        return success;
    }

}
