//
//  StorageHelp.m
//  RNBaselib
//
//  Created by laowen on 2019/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "StorageHelp.h"

@implementation StorageHelp

#pragma mark - Keychain methods

/*! Create as generic NSDictionary to be used to query and update Keychain items.
 *  param1
 *  param2
 */
+ (NSMutableDictionary *)keychainItemForKey:(NSString *)key service:(NSString *)service {
    NSMutableDictionary *keychainItem = [[NSMutableDictionary alloc] init];
    keychainItem[(__bridge id)kSecClass] = (__bridge id)kSecClassGenericPassword;
    keychainItem[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleAlways;
    keychainItem[(__bridge id)kSecAttrAccount] = key;
    keychainItem[(__bridge id)kSecAttrService] = service;
    return keychainItem;
}

/*! Sets
 *  param1
 *  param2
 */
+ (OSStatus)setValue:(NSString *)value forKeychainKey:(NSString *)key inService:(NSString *)service {
    NSMutableDictionary *keychainItem = [[self class] keychainItemForKey:key service:service];
    keychainItem[(__bridge id)kSecValueData] = [value dataUsingEncoding:NSUTF8StringEncoding];
    return SecItemAdd((__bridge CFDictionaryRef)keychainItem, NULL);
}

+ (NSString *)valueForKeychainKey:(NSString *)key service:(NSString *)service {
    OSStatus status;
    NSMutableDictionary *keychainItem = [[self class] keychainItemForKey:key service:service];
    keychainItem[(__bridge id)kSecReturnData] = (__bridge id)kCFBooleanTrue;
    keychainItem[(__bridge id)kSecReturnAttributes] = (__bridge id)kCFBooleanTrue;
    CFDictionaryRef result = nil;
    status = SecItemCopyMatching((__bridge CFDictionaryRef)keychainItem, (CFTypeRef *)&result);
    if (status != noErr) {
        return nil;
    }
    NSDictionary *resultDict = (__bridge_transfer NSDictionary *)result;
    NSData *data = resultDict[(__bridge id)kSecValueData];
    if (!data) {
        return nil;
    }
    return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
}

#pragma mark - NSUserDefaults methods

+ (BOOL)setValue:(NSString *)value forUserDefaultsKey:(NSString *)key {
    [[NSUserDefaults standardUserDefaults] setObject:value forKey:key];
    return [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString *)valueForUserDefaultsKey:(NSString *)key {
    return [[NSUserDefaults standardUserDefaults] objectForKey:key];
}

#pragma mark - save

+ (void)saveWithKey:(NSString *)key value:(NSString *)value {
    if (![self valueForKeychainKey:key service:key] || ![[self valueForKeychainKey:key service:key] isEqualToString:value]) {
        [self setValue:value forKeychainKey:key inService:key];
    }
    if (![self valueForUserDefaultsKey:key] || ![[self valueForUserDefaultsKey:key] isEqualToString:value]) {
        [self setValue:value forUserDefaultsKey:key];
    }
}

@end
