//
//  StorageHelp.h
//  RNBaselib
//
//  Created by laowen on 2019/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface StorageHelp : NSObject

+ (NSMutableDictionary *)keychainItemForKey:(NSString *)key service:(NSString *)service;

+ (OSStatus)setValue:(NSString *)value forKeychainKey:(NSString *)key inService:(NSString *)service;

+ (NSString *)valueForKeychainKey:(NSString *)key service:(NSString *)service;


+ (BOOL)setValue:(NSString *)value forUserDefaultsKey:(NSString *)key;

+ (NSString *)valueForUserDefaultsKey:(NSString *)key;


+ (void)saveWithKey:(NSString *)key value:(NSString *)value;

@end

NS_ASSUME_NONNULL_END
