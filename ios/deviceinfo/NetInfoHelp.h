//
//  NetInfoHelp.h
//  RNBaselib
//
//  Created by laowen on 2019/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface NetInfoHelp : NSObject

+ (NSString *)getWifiMac;

+ (NSString *)getWifiIP;

@end

NS_ASSUME_NONNULL_END
