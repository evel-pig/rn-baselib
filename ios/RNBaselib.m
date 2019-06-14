
#import "RNBaselib.h"
#import <React/RCTEventEmitter.h>
#import <Photos/PHPhotoLibrary.h>
#import <AVFoundation/AVCaptureDevice.h>
#import "LocationHelp.h"
#import "ContactsHelp.h"
#import "NotificationHelp.h"

@interface RNBaselib ()
@property (nonatomic, strong) LocationHelp *locationHelp;
@property (nonatomic, strong) NotificationHelp *notificationHelp;
@end

@implementation RNBaselib

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

@end
