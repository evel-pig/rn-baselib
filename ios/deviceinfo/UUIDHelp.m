//
//  UUIDHelp.m
//  RNBaselib
//
//  Created by laowen on 2019/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "UUIDHelp.h"
#import "StorageHelp.h"

static NSString * const uuidKey = @"RNBaselibUUID";

@implementation UUIDHelp

+ (NSString *)getUUID {
    NSString *uuid = @"";
    uuid = [StorageHelp valueForKeychainKey:uuidKey service:uuidKey];
    if (!uuid) uuid = [StorageHelp valueForUserDefaultsKey:uuidKey];
    if (!uuid) uuid = [self getAppleIFV];
    if (!uuid) uuid = [self getRandomUUID];
    if (uuid) [StorageHelp saveWithKey:uuidKey value:uuid];
    return uuid;
}

+ (NSString *)getAppleIFV {
    if (NSClassFromString(@"UIDevice") && [UIDevice instancesRespondToSelector:@selector(identifierForVendor)]) {
        return [UIDevice currentDevice].identifierForVendor.UUIDString;
    }
    return nil;
}

+ (NSString *)getRandomUUID {
    if (NSClassFromString(@"NSUUID")) {
        return [[NSUUID UUID] UUIDString];
    }
    CFUUIDRef uuidRef = CFUUIDCreate(kCFAllocatorDefault);
    CFStringRef cfuuid = CFUUIDCreateString(kCFAllocatorDefault, uuidRef);
    CFRelease(uuidRef);
    NSString *uuid = [((__bridge NSString *) cfuuid) copy];
    CFRelease(cfuuid);
    return uuid;
}

@end
