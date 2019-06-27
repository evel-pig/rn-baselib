package com.reactlibrary.utils;

import android.content.Context;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.View;
import android.view.WindowManager;

import com.reactlibrary.RNBaselibModule;

public class SizeUtil {
    /*
    （1）屏幕尺寸：单位inch，指的是屏幕对角线长度。
　　（2）屏幕密度：单位dpi，指的是每inch上可以显示多少像素点即px。
　　（3）屏幕分辨率：单位px * px，指的是一屏显示多少像素点。
　　（4）屏幕无关像素：单位dp/dip，指的是自适应屏幕密度的像素，用于指定控件宽高。
　　（5）刻度无关像素：单位sp，指的是自适应字体的像素，用于指定文字大小。

 　　 那么既然dpi是自适应屏幕密度的，与px之间又是如何换算呢：
    　　240dpi(hdpi高密度屏)　　   1dp = 1.5px
    　　320dpi(xhdpi极高密度屏)　  1dp = 2px
    　　480dpi(xxhdpi)           1dp = 3px
     */

    /**
     * 获取屏幕dpi
     *
     * @return
     */
    public static float getScreenDpi() {
        WindowManager wm = (WindowManager) RNBaselibModule.appContext.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics dm = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(dm);
        return dm.densityDpi;

    }

    /**
     * 屏幕密度比例因子
     *
     * @return
     */
    public static float getScreenDensity() {
        return RNBaselibModule.appContext.getResources().getDisplayMetrics().density;
    }

    /**
     * 获得屏幕高度
     *
     * @return
     */
    public static int getScreenHeight() {
        WindowManager wm = (WindowManager) RNBaselibModule.appContext.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics outMetrics = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(outMetrics);
        return outMetrics.heightPixels;
    }

    /**
     * 获得屏幕宽度
     *
     * @return
     */
    public static int getScreenWidth() {
        WindowManager wm = (WindowManager) RNBaselibModule.appContext.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics outMetrics = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(outMetrics);
        return outMetrics.widthPixels;
    }

    /**
     * 获得状态栏高度
     *
     * @return
     */
    public static int getStatusBarHeight() {
        int statusBarHeight = -1;
        //获取status_bar_height资源的ID
        int resourceId = RNBaselibModule.appContext.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            //根据资源ID获取响应的尺寸值
            statusBarHeight = RNBaselibModule.appContext.getResources().getDimensionPixelSize(resourceId);
        }
        return statusBarHeight;
    }

    /**
     * 获取控件在其父窗口中的绝对坐标位置 (location[0]横坐标(会包含状态栏高度), location[1]纵坐标)
     *
     * @param view
     * @return
     */
    public static int[] getLocationInWindow(View view) {
        int[] location = new int[2];
        view.getLocationInWindow(location);
        return location;
    }

    /**
     * 获取控件在其整个屏幕上的坐标位置
     *
     * @param view
     * @return
     */
    public static int[] getLocationOnScreen(View view) {
        int[] location = new int[2];
        view.getLocationOnScreen(location);
        return location;
    }

    /**
     * dp转px
     * 以dp为基准进行转化为px,按照不同的dpi,用来保证在不同分辨率的屏幕上显示的高度或宽度的一致
     *
     * @param dpVal
     * @return
     */
    public static int dp2px(float dpVal) {
        return (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dpVal, RNBaselibModule.appContext.getResources().getDisplayMetrics());
    }

    /**
     * sp转px
     *
     * @param spVal
     * @return
     */
    public static int sp2px(float spVal) {
        return (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, spVal, RNBaselibModule.appContext.getResources().getDisplayMetrics());
    }

    /**
     * px转dp
     *
     * @param pxVal
     * @return
     */
    public static float px2dp(float pxVal) {
        final float scale = RNBaselibModule.appContext.getResources().getDisplayMetrics().density;
        return (pxVal / scale);
    }

    /**
     * px转sp
     *
     * @param pxVal
     * @return
     */
    public static float px2sp(float pxVal) {
        return (pxVal / RNBaselibModule.appContext.getResources().getDisplayMetrics().scaledDensity);
    }

    /**
     * DIP转PX
     *
     * @param value
     * @return
     */
    public static int dip2px(float value) {
        float dipScale = RNBaselibModule.appContext.getResources().getDisplayMetrics().density;
        return (int) (value * dipScale + 0.5f);
    }
}
