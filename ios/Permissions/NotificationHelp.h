//
//  NotificationHelp.h
//  RNBaselib
//
//  Created by laowen on 2019/6/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNBaselib.h"

NS_ASSUME_NONNULL_BEGIN

@interface NotificationHelp : NSObject

typedef void(^NotiCallback)(BOOL isAuthorized);

- (void)authPermissions:(NotiCallback)callback;

@end

NS_ASSUME_NONNULL_END
