//
//  NetInfoHelp.m
//  RNBaselib
//
//  Created by laowen on 2019/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NetInfoHelp.h"
#import <NetworkExtension/NetworkExtension.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#include <ifaddrs.h>
#include <arpa/inet.h>

@implementation NetInfoHelp

+ (NSString *)getWifiMac {
    NSArray *ifs = CFBridgingRelease(CNCopySupportedInterfaces());
    id info = nil;
    for(NSString *ifnam in ifs) {
        info = (__bridge_transfer id)CNCopyCurrentNetworkInfo((CFStringRef)ifnam);
        if(info && [info count]) {
            break;
        }
    }
    NSDictionary *dict = (NSDictionary *)info;
//    NSString *ssid = [[dict objectForKey:@"SSID"] lowercaseString];  // wifi名称
    NSString *bssid = [dict objectForKey:@"BSSID"];   // wifi mac地址

    
    if (bssid) {
        NSString *bssid = @"c:a1:06:7b:1c:26";
        NSMutableArray *mutableArray = [NSMutableArray arrayWithArray:[bssid componentsSeparatedByString:@":"]];
        [mutableArray enumerateObjectsUsingBlock:^(NSString *obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if (!obj || obj.length == 0) {
                mutableArray[idx] = @"00";
            } else if (obj.length == 1) {
                mutableArray[idx] = [NSString stringWithFormat:@"0%@", obj];
            }
        }];
        
        __block NSString *mac = @"";
        [mutableArray enumerateObjectsUsingBlock:^(NSString *obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if (idx == 0) {
                mac = obj;
            } else {
                mac = [NSString stringWithFormat:@"%@:%@", mac, obj];
            }
        }];
        return mac;
    } else {
        return @"";
    }
}

+ (NSString *)getWifiIP {
    NSString *address = @"0.0.0.0";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    // retrieve the current interfaces - returns 0 on success
    success = getifaddrs(&interfaces);
    if (success == 0) {
        // Loop through linked list of interfaces
        temp_addr = interfaces;
        while(temp_addr != NULL) {
            if(temp_addr->ifa_addr->sa_family == AF_INET) {
                // Check if interface is en0 which is the wifi connection on the iPhone
                if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
                    // Get NSString from C String
                    address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
                    
                }
                
            }
            temp_addr = temp_addr->ifa_next;
        }
    }
    // Free memory
    freeifaddrs(interfaces);
    return address;
}

@end
