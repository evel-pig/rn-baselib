package com.reactlibrary.webview;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.webview.ReactWebViewManager;
import com.reactlibrary.WebViewModule;
import com.reactlibrary.WebViewPackage;

import android.view.ViewGroup.LayoutParams;

@ReactModule(name = WebViewManager.REACT_CLASS)
public class WebViewManager extends ReactWebViewManager {
    protected static final String REACT_CLASS = "CustomWebView";
    private WebViewPackage aPackage;

    // 新加 <<<-------------------------------------------------
    private ValueCallback mUploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 0x000002;
    // 新加 ------------------------------------------------->>>

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected WebView createViewInstance(final ThemedReactContext reactContext) {
        ReactWebView webView = (ReactWebView) super.createViewInstance(reactContext);
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage message) {
                if (ReactBuildConfig.DEBUG) {
                    return super.onConsoleMessage(message);
                }
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            // 新加 <<<-------------------------------------------------
            public void openFileChooser(ValueCallback<Uri> uploadMsg) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                }
                mUploadMessage = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");
                reactContext.startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_RESULTCODE, Bundle.EMPTY);
            }
            // For Android 3.0+
            public void openFileChooser(ValueCallback uploadMsg, String acceptType) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                }
                mUploadMessage = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                String type = TextUtils.isEmpty(acceptType) ? "*/*" : acceptType;
                i.setType(type);
                reactContext.startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_RESULTCODE, Bundle.EMPTY);
            }
            // For Android 4.1
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                }
                mUploadMessage = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                String type = TextUtils.isEmpty(acceptType) ? "*/*" : acceptType;
                i.setType(type);
                reactContext.startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_RESULTCODE, Bundle.EMPTY);
            }
            //Android 5.0+
            @Override
            @SuppressLint("NewApi")
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                return getModule().startPhotoPickerIntent(filePathCallback, fileChooserParams);
            }
            // 新加 ------------------------------------------------->>>
        });

        reactContext.addLifecycleEventListener(webView);
        mWebViewConfig.configWebView(webView);
        webView.getSettings().setBuiltInZoomControls(true);
        webView.getSettings().setDisplayZoomControls(false);
        webView.getSettings().setDomStorageEnabled(true);

        // Fixes broken full-screen modals/galleries due to body height being 0.
        webView.setLayoutParams(
                new LayoutParams(LayoutParams.MATCH_PARENT,
                        LayoutParams.MATCH_PARENT));

        if (ReactBuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        return webView;
    }

    // 新加 <<<-------------------------------------------------
    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, WebView view) {
        view.setWebViewClient(new CustomWebViewClient());
    }

    public WebViewPackage getPackage() {
        return this.aPackage;
    }

    public void setPackage(WebViewPackage aPackage) {
        this.aPackage = aPackage;
    }

    public WebViewModule getModule() {
        return this.aPackage.getModule();
    }

    protected static class CustomWebViewClient extends ReactWebViewClient { }
    // 新加 ------------------------------------------------->>>
}
