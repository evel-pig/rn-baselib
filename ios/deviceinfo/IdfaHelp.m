//
//  IdfaHelp.m
//  RNBaselib
//
//  Created by laowen on 2019/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "IdfaHelp.h"
#import "StorageHelp.h"
#import <AdSupport/AdSupport.h>

static NSString * const idfaKey = @"RNBaselibIDFA";

@implementation IdfaHelp

+ (NSString *)getIdfa {
    NSString *idfa = @"";
    idfa = [StorageHelp valueForKeychainKey:idfaKey service:idfaKey];
    if (!idfa) idfa = [StorageHelp valueForUserDefaultsKey:idfaKey];
    if (!idfa) idfa = [self getNewIdfa];
    BOOL isEmpty = !idfa || idfa.length == 0 || [[idfa stringByReplacingOccurrencesOfString:@"-" withString:@""] stringByReplacingOccurrencesOfString:@"0" withString:@""].length == 0;
    if (!isEmpty) [StorageHelp saveWithKey:idfaKey value:idfa];
    return idfa;
}

+ (NSString *)getNewIdfa {
    return [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
}

@end
