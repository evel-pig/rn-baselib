package com.reactlibrary;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.FileProvider;
import android.util.Log;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import static android.app.Activity.RESULT_OK;

public class WebViewModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    public static final String REACT_CLASS = "CustomWebViewModule";
    private static final int REQUEST_CAMERA = 1;
    private static final int SELECT_FILE = 2;
    private static final int REQUEST_PERMISSIONS = REACT_CLASS.hashCode();
    private WebViewPackage aPackage;
    private ValueCallback<Uri[]> filePathCallback;
    private Uri outputFileUri;
    final String[] DEFAULT_MIME_TYPES = {"image/*", "video/*"};

    final String TAKE_PHOTO = "拍照";
    final String CHOOSE_FILE = "选择"; //test
    final String CANCEL = "取消";


    public WebViewModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (this.filePathCallback == null) { return; }
        switch (requestCode) {
            case REQUEST_CAMERA:
                if (resultCode == RESULT_OK) {
                    filePathCallback.onReceiveValue(new Uri[]{outputFileUri});
                } else {
                    filePathCallback.onReceiveValue(null);
                }
                break;
            case SELECT_FILE:
                if (resultCode == RESULT_OK && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    filePathCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
                } else {
                    filePathCallback.onReceiveValue(null);
                }
                break;
        }
        this.filePathCallback = null;
    }

    public void onNewIntent(Intent intent) { }

    public boolean startPhotoPickerIntent(
            final ValueCallback<Uri[]> filePathCallback,
            final WebChromeClient.FileChooserParams fileChooserParams

    ) {
        this.filePathCallback = filePathCallback;
        final String[] acceptTypes = getSafeAcceptedTypes(fileChooserParams);
        final CharSequence[] items = getDialogItems(acceptTypes);

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            showDialog(filePathCallback, fileChooserParams, items);
            return true;
        }
        final Activity activity = getCurrentActivity();
        if (null == activity) return true;

        List<String> permissions = new ArrayList<>();
        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            permissions.add(Manifest.permission.CAMERA);
        }
        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }
        if (permissions.size() > 0) {
            ((PermissionAwareActivity) activity).requestPermissions(permissions.toArray(new String[permissions.size()]), REQUEST_PERMISSIONS, new PermissionListener() {
                @Override
                public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
                    if (requestCode == REQUEST_PERMISSIONS) {
                        for (int grantResult : grantResults) {
                            if (grantResult == PackageManager.PERMISSION_DENIED) {
                                Toast.makeText(activity, "该功能需要相机和存储权限, 请允许", Toast.LENGTH_LONG).show();
                                filePathCallback.onReceiveValue(null);
                                return true;
                            }
                        }
                        showDialog(filePathCallback, fileChooserParams, items);
                    }
                    return true;
                }
            });
        } else {
            showDialog(filePathCallback, fileChooserParams, items);
        }
        return true;
    }

    private void showDialog(final ValueCallback<Uri[]> filePathCallback, final WebChromeClient.FileChooserParams fileChooserParams, final CharSequence[] items) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
        builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                filePathCallback.onReceiveValue(null);
            }
        });

        builder.setItems(items, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int item) {
                if (items[item].equals(TAKE_PHOTO)) {
                    try {
                        startCamera(MediaStore.ACTION_IMAGE_CAPTURE, "image-", ".jpg");
                    } catch (Exception e) {
                        e.printStackTrace();
                        Log.e("WebViewModule1: ", e.toString());
                    }
                } else if (items[item].equals(CHOOSE_FILE)) {
                    startFileChooser(fileChooserParams);
                } else if (items[item].equals(CANCEL)) {
                    dialog.cancel();
                }
            }
        });
        builder.show();
    }

    public WebViewPackage getPackage() {
        return this.aPackage;
    }

    public void setPackage(WebViewPackage aPackage) {
        this.aPackage = aPackage;
    }

    private void startCamera(String intentType, String prefix, String suffix) {
        Intent intent = new Intent(intentType);
        Activity activity = getCurrentActivity();
        if (activity == null) return;
        File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
        if (!path.exists() && !path.isDirectory()) {
            path.mkdirs();
        }
        File file = null;
        try {
            file = File.createTempFile(prefix, suffix, path);
        } catch (java.io.IOException e) {
            Log.e("WebViewModule2: ", e.toString());
        }
        if (file == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            outputFileUri = FileProvider.getUriForFile(
                    activity,
                    activity.getApplicationContext().getPackageName() + ".provider",
                    file);
        } else {
            outputFileUri = Uri.fromFile(file);
        }
        intent.putExtra(MediaStore.EXTRA_OUTPUT, outputFileUri);
        activity.startActivityForResult(intent, REQUEST_CAMERA);
    }

    private void startFileChooser(WebChromeClient.FileChooserParams fileChooserParams) {
        final String[] acceptTypes = getSafeAcceptedTypes(fileChooserParams);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Intent intent = fileChooserParams.createIntent();
            if (acceptTypes.length == 1) {
                if (acceptTypes[0].contains("image") && acceptTypes[0].contains("video") || !acceptTypes[0].contains("image") && !acceptTypes[0].contains("video")) {
                    intent.setType("*/*");
                } else if (acceptTypes[0].contains("image")) {
                    intent.setType("image/*");
                } else if (acceptTypes[0].contains("video")) {
                    intent.setType("video/*");
                }
            }
            intent.putExtra(Intent.EXTRA_MIME_TYPES, getAcceptedMimeType(acceptTypes));
            getCurrentActivity().startActivityForResult(intent, SELECT_FILE);
        }
    }

    private CharSequence[] getDialogItems(String[] types) {
        List<String> listItems = new ArrayList<String>();
        if (acceptsImages(types)) listItems.add(TAKE_PHOTO);
        listItems.add(CHOOSE_FILE);
        listItems.add(CANCEL);
        return listItems.toArray(new CharSequence[listItems.size()]);
    }

    private Boolean acceptsImages(String[] types) {
        return isArrayEmpty(types) || arrayContainsString(types, "image");
    }

    private Boolean arrayContainsString(String[] array, String pattern) {
        for (String content : array) {
            if (content.indexOf(pattern) > -1) {
                return true;
            }
        }
        return false;
    }

    private String[] getSafeAcceptedTypes(WebChromeClient.FileChooserParams params) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            return params.getAcceptTypes();
        }
        final String[] EMPTY = {};
        return EMPTY;
    }

    private String[] getAcceptedMimeType(String[] types) {
        if (isArrayEmpty(types)) {
            return DEFAULT_MIME_TYPES;
        }
        return types;
    }

    private Boolean isArrayEmpty(String[] arr) {
        return arr.length == 0 || (arr.length == 1 && arr[0].length() == 0);
    }
}
