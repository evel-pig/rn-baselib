//
//  AppStoreHelp.m
//  RNBaselib
//
//  Created by laowen on 2019/6/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AppStoreHelp.h"

@implementation AppStoreHelp

+ (void)getAppStoreInfoWithId:(NSString *)appId block:(void (^)(NSDictionary *info))callback {
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_async(queue, ^{
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"https://itunes.apple.com/lookup?id=%@", appId]];
        NSError *error = nil;
        NSString *file = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:&error];
        if (!error) {
            NSDictionary *dict = [self dictionaryWithJsonString:file];
            dispatch_async(dispatch_get_main_queue(), ^{
                callback(dict);
            });
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                callback(nil);
            });
        }
    });
}

// json -> dict
+ (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString {
    if (jsonString == nil) { return nil; }
    
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&err];
    if (err) { return nil; }
    return dic;
}


@end
