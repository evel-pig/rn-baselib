//
//  AppStoreHelp.h
//  RNBaselib
//
//  Created by laowen on 2019/6/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RNBaselib.h"

NS_ASSUME_NONNULL_BEGIN

@interface AppStoreHelp : NSObject

+ (void)getAppStoreInfoWithId:(NSString *)appId block:(void (^)(NSDictionary *info))callback;

@end

NS_ASSUME_NONNULL_END
