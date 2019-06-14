//
//  LocationHelp.h
//  CoreLocationDemo
//
//  Created by laowen on 2017/6/1.
//  Copyright © 2017年 laowen. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RNBaselib.h"
#import <CoreLocation/CoreLocation.h>

typedef NS_ENUM(int,  LocationAuthorizationType) {
    LocationAuthorizationTypeWhenInUse = 1,
    LocationAuthorizationTypeAlways = 2,
};

typedef void(^LocationCallback)(BOOL isAuthorized);

@interface LocationHelp : NSObject

- (void)checkLocationPermission:(LocationAuthorizationType)type callback:(LocationCallback)callback;

@end
