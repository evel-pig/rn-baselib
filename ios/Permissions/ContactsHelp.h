//
//  ContactsHelp.h
//  QQMProject
//
//  Created by admin on 15/11/20.
//  Copyright © 2015年 admin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNBaselib.h"

@interface ContactsHelp : NSObject

+ (void)authPermissions:(void (^)(BOOL isAuthorized))callback;

@end
