//
//  NotificationHelp.m
//  RNBaselib
//
//  Created by laowen on 2019/6/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NotificationHelp.h"
#import <UIKit/UIKit.h>

#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

static NSString* RNPDidAskForNotification = @"RNPDidAskForNotification";

@interface NotificationHelp()
@property (nonatomic, copy) NotiCallback callback;
@end

@implementation NotificationHelp

- (void)authPermissions:(NotiCallback)callback {
    __block BOOL isAuthorized = NO;
    if (@available(iOS 10 , *)) {
        [[UNUserNotificationCenter currentNotificationCenter] getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
            if (settings.authorizationStatus == UNAuthorizationStatusAuthorized) {
                NSLog(@"用户早就允许了");
                isAuthorized = YES;
                if (callback) callback(isAuthorized);
            } else if (settings.authorizationStatus == UNAuthorizationStatusNotDetermined) {
                NSLog(@"用户未决定");
                [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound completionHandler:^(BOOL granted, NSError * _Nullable error) {
                    isAuthorized = granted;
                    if (callback) callback(isAuthorized);
                }];
            } else {
                NSLog(@"用户早就拒绝了");
                isAuthorized = NO;
                if (callback) callback(isAuthorized);
            }
        }];
    } else {
        BOOL didAskForPermission = [[NSUserDefaults standardUserDefaults] boolForKey:RNPDidAskForNotification];
        UIUserNotificationSettings * setting = [[UIApplication sharedApplication] currentUserNotificationSettings];
        if (setting.types != UIUserNotificationTypeNone) {
            NSLog(@"用户早就允许了");
            isAuthorized = YES;
            if (callback) callback(isAuthorized);
        } else {
            if (!didAskForPermission) {
                NSLog(@"用户未决定");
                if (!self.callback) self.callback = callback;
                [[NSNotificationCenter defaultCenter] addObserver:self
                                                         selector:@selector(applicationDidBecomeActive)
                                                             name:UIApplicationDidBecomeActiveNotification
                                                           object:nil];
                
                UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound categories:nil];
                [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
                [[UIApplication sharedApplication] registerForRemoteNotifications];
                [[NSUserDefaults standardUserDefaults] setBool:YES forKey:RNPDidAskForNotification];
                [[NSUserDefaults standardUserDefaults] synchronize];
            } else {
                NSLog(@"用户早就拒绝了");
                isAuthorized = NO;
                if (callback) callback(isAuthorized);
            }
        }
    }
}

- (void)applicationDidBecomeActive {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIApplicationDidBecomeActiveNotification
                                                  object:nil];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.2 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        [self authPermissions:self.callback];
    });
}

- (void)dealloc {
    NSLog(@"------- NotificationHelp销毁了");
}

@end
