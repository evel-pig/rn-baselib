//
//  LocationHelp.m
//  CoreLocationDemo
//
//  Created by laowen on 2017/6/1.
//  Copyright © 2017年 laowen. All rights reserved.
//

#import "LocationHelp.h"

@interface LocationHelp() <CLLocationManagerDelegate>
@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, copy) LocationCallback callback;
@property (nonatomic, assign) LocationAuthorizationType type;
@end

@implementation LocationHelp

- (void)checkLocationPermission:(LocationAuthorizationType)type callback:(LocationCallback)callback {
  [self initLocationManager];
  _callback = callback;
    _type = type;
  [self handleResult];
}

- (void)handleResult {
  BOOL isAuthorized = NO;
  if (![CLLocationManager locationServicesEnabled]) {
    isAuthorized = NO;
      if (_callback) {
          _callback(isAuthorized);
//          [self cleanProperty];
      }
  } else {
      CLAuthorizationStatus state = [CLLocationManager authorizationStatus];
      if (state == kCLAuthorizationStatusNotDetermined) {
          NSLog(@"用户未决定");
          // 弹出授权弹窗
          if (_type == LocationAuthorizationTypeWhenInUse) {
              [_locationManager requestWhenInUseAuthorization];
          } else if (_type == LocationAuthorizationTypeAlways) {
              [_locationManager requestAlwaysAuthorization];
          }
      }
      else if (state == kCLAuthorizationStatusAuthorizedAlways || state == kCLAuthorizationStatusAuthorizedWhenInUse) {
          NSLog(@"用户已授权");
          isAuthorized = YES;
          if (_callback) {
              _callback(isAuthorized);
//              [self cleanProperty];
          }
      }
      else if (state == kCLAuthorizationStatusDenied || state == kCLAuthorizationStatusRestricted) {
          NSLog(@"用户已拒绝");
          isAuthorized = NO;
          if (_callback) {
              _callback(isAuthorized);
//              [self cleanProperty];
          }
      }
  }
}

//- (void)cleanProperty {
//  if (_callback) _callback = nil;
//  if (_locationManager) _locationManager = nil;
//}

- (void)initLocationManager {
  if (!_locationManager) {
    _locationManager = [[CLLocationManager alloc] init];
    _locationManager.delegate = self;
    _locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters;
  }
}

#pragma mark - delegate
// 授权状态改变时调用 (可以作授权弹窗点击回调)
- (void)locationManager:(CLLocationManager*)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
  if (status != kCLAuthorizationStatusNotDetermined) {
    [self handleResult];
  }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
  
}

// 失败回调
- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  NSLog(@"获取位置定位失败, 请重试");
  if (_callback) {
    BOOL isAuthorized = NO;
    _callback(isAuthorized);
//      [self cleanProperty];
  }
}

- (void)dealloc {
    NSLog(@"------- LocationHelp销毁了");
}

@end
