
#import "RNBaselib.h"
#import <React/RCTEventEmitter.h>
#import <Photos/PHPhotoLibrary.h>
#import <AVFoundation/AVCaptureDevice.h>
#import "LocationHelp.h"
#import "ContactsHelp.h"
#import "NotificationHelp.h"
#import "AppStoreHelp.h"
#import "UUIDHelp.h"
#import "IdfaHelp.h"
#import <NetworkExtension/NetworkExtension.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#include <ifaddrs.h>
#include <arpa/inet.h>
#import <sys/utsname.h>
#import <CoreTelephony/CoreTelephonyDefines.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#import "NetInfoHelp.h"

#define iOS9 ([[[UIDevice currentDevice] systemVersion] floatValue] >= 9.0)
#define iOS10 ([[[UIDevice currentDevice] systemVersion] floatValue] >= 10.0)

@interface RNBaselib ()
@property (nonatomic, strong) LocationHelp *locationHelp;
@property (nonatomic, strong) NotificationHelp *notificationHelp;
@property (nonatomic, assign) BOOL isKeyboardShowing;
@property(nonatomic, strong, readonly) NSString *uuid;
@property(nonatomic, strong, readonly) NSString *idfa;
@end

@implementation RNBaselib

- (instancetype)init {
    if (self = [super init]) {
        _isKeyboardShowing = false;
        NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
        [center  addObserver:self selector:@selector(keyboardDidShow)  name:UIKeyboardDidShowNotification  object:nil];
        [center addObserver:self selector:@selector(keyboardDidHide)  name:UIKeyboardWillHideNotification object:nil];
    }
    return self;
}

- (void)keyboardDidShow {
    _isKeyboardShowing = YES;
//    NSLog(@"1========+++++++========+++++++ %d", _isKeyboardShowing);
}

- (void)keyboardDidHide {
    _isKeyboardShowing = NO;
//    NSLog(@"2========+++++++========+++++++ %d", _isKeyboardShowing);
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(testWithcallback:(RCTResponseSenderBlock)callback) {
    NSString *str = @"哈哈哈哈";
    if (callback) callback(@[str]);
}

// 相册权限
RCT_EXPORT_METHOD(checkPhotoPermission:(RCTResponseSenderBlock)callback) {
    __block BOOL isAuthorized = NO;
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    if (status == PHAuthorizationStatusNotDetermined) {
        NSLog(@"第一次弹授权弹窗");
        [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
            if (status == PHAuthorizationStatusAuthorized) {
                NSLog(@"2用户允许了");
                isAuthorized = YES;
            } else {
                NSLog(@"2用户拒绝了");
                isAuthorized = NO;
            }
            if (callback) callback(@[@(isAuthorized)]);
            return;
        }];
    } else if (status == PHAuthorizationStatusAuthorized) {
        NSLog(@"用户允许了");
        isAuthorized = YES;
        if (callback) callback(@[@(isAuthorized)]);
    } else {
        NSLog(@"用户拒绝了");
        isAuthorized = NO;
        if (callback) callback(@[@(isAuthorized)]);
    }
}

// 相机权限
RCT_EXPORT_METHOD(checkCameraPermission:(RCTResponseSenderBlock)callback) {
    __block BOOL isAuthorized = NO;
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if (authStatus == AVAuthorizationStatusNotDetermined) {
        NSLog(@"第一次弹授权弹窗");
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
            dispatch_async(dispatch_get_main_queue(), ^{
                isAuthorized = granted;
                if (callback) callback(@[@(isAuthorized)]);
                return;
            });
        }];
    }
    else if (authStatus == AVAuthorizationStatusAuthorized) {
        NSLog(@"用户早就允许了");
        isAuthorized = YES;
        if (callback) callback(@[@(isAuthorized)]);
    }
    else {
        NSLog(@"用户早就拒绝了");
        isAuthorized = NO;
        if (callback) callback(@[@(isAuthorized)]);
    }
}

// 定位权限
RCT_EXPORT_METHOD(checkLocationPermission:(int)type callback:(RCTResponseSenderBlock)callback) {
    if (!_locationHelp) _locationHelp = [[LocationHelp alloc] init];
    [_locationHelp checkLocationPermission:type callback:^(BOOL isAuthorized) {
        if (callback) callback(@[@(isAuthorized)]);
        if (_locationHelp) _locationHelp = nil;
    }];
}

// 通讯录权限
RCT_EXPORT_METHOD(checkContactsPermission:(RCTResponseSenderBlock)callback) {
    [ContactsHelp authPermissions:^(BOOL isAuthorized) {
        if (callback) callback(@[@(isAuthorized)]);
    }];
}

// 消息推送权限
RCT_EXPORT_METHOD(checkNotificationPermission:(RCTResponseSenderBlock)callback) {
    if (!_notificationHelp) _notificationHelp = [[NotificationHelp alloc] init];
    [_notificationHelp authPermissions:^(BOOL isAuthorized) {
        NSLog(@"------ %d", isAuthorized);
        if (callback) callback(@[@(isAuthorized)]);
        if (_notificationHelp) _notificationHelp = nil;
    }];
}

// 跳转系统权限设置页面
RCT_EXPORT_METHOD(toPermissionSettingCenter) {
    NSURL * url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
    if ([[UIApplication sharedApplication] canOpenURL:url]) {
        if (iOS10) {
            // 默认NO，如果没有有效连接则会在Safari打开
            NSDictionary *options = @{UIApplicationOpenURLOptionUniversalLinksOnly : @NO};
            [[UIApplication sharedApplication] openURL:url options:options completionHandler:nil];
        } else {
            [[UIApplication sharedApplication] openURL:url];
        }
    }
}

// 跳转系统权限设置页面
RCT_EXPORT_METHOD(checkDeviceType:(RCTResponseSenderBlock)callback) {
    BOOL isSimulator = NO;
#if TARGET_IPHONE_SIMULATOR
    isSimulator = YES;
#endif
    if (callback) callback(@[@(isSimulator)]);
}

// 跳转系统权限设置页面
RCT_EXPORT_METHOD(getKeyboardStatus:(RCTResponseSenderBlock)callback) {
    if (callback) callback(@[@(_isKeyboardShowing)]);
}

// 获取 app 在 app store上信息
RCT_EXPORT_METHOD(getAppStoreInfoWithId:(NSString *)appId callback:(RCTResponseSenderBlock)callback) {
    MyLog(@"-----id %@", appId);
    [AppStoreHelp getAppStoreInfoWithId:appId block:^(NSDictionary * _Nonnull info) {
        if (info && info[@"results"] && [info[@"results"] isKindOfClass:[NSArray class]] && [info[@"results"] firstObject] && [[info[@"results"] firstObject] isKindOfClass:[NSDictionary class]]) {
            if (callback) callback(@[[info[@"results"] firstObject]]);
        } else {
            if (callback) callback(@[@{}]);
        }
    }];
}

// 获取uuid
RCT_EXPORT_METHOD(getUUID:(RCTResponseSenderBlock)callback) {
    if (!_uuid || _uuid.length == 0) _uuid = [UUIDHelp getUUID];
    if (callback) callback(@[_uuid]);
}

// 获取idfa
RCT_EXPORT_METHOD(getIDFA:(RCTResponseSenderBlock)callback) {
    if (!_idfa || _idfa.length == 0) _idfa = [IdfaHelp getIdfa];
    if (callback) callback(@[_idfa]);
}

// 获取wifi的mac地址
RCT_EXPORT_METHOD(getWifiMac:(RCTResponseSenderBlock)callback) {
    NSString *mac = [NetInfoHelp getWifiMac];
    if (callback) callback(@[mac]);
}

// 获取wifi的ip
RCT_EXPORT_METHOD(getWifiIP:(RCTResponseSenderBlock)callback) {
    NSString *address = [NetInfoHelp getWifiIP];
    if (callback) callback(@[address]);
}

// 手机型号
RCT_EXPORT_METHOD(getDeviceModel:(RCTResponseSenderBlock)callback) {
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceString = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    if (callback) callback(@[deviceString]);
}

// 手机本地语言
RCT_EXPORT_METHOD(getDeviceLocale:(RCTResponseSenderBlock)callback) {
    NSString *language = [[NSLocale preferredLanguages] firstObject];
    if (callback) callback(@[language]);
}

- (NSDictionary *)constantsToExport {
    UIDevice *currentDevice = [UIDevice currentDevice];
    CTTelephonyNetworkInfo *telephonyInfo = [[CTTelephonyNetworkInfo alloc] init];
    CTCarrier *carrier = [telephonyInfo subscriberCellularProvider];
    return @{
             @"model": currentDevice.localizedModel,
             @"systemVersion": currentDevice.systemVersion,
             @"deviceName": currentDevice.name,
             @"appName": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"] ?: @"",
             @"bundleId": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"] ?: @"",
             @"versionName": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"] ?: @"",
             @"versionCode": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"] ?: @"",
             @"mcc": [carrier mobileCountryCode] ?: @"",
             @"mnc": [carrier mobileNetworkCode] ?: @"",
             };
}

@end
