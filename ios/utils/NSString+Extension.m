//
//  NSString+DateExtension.m
//  QQMProject
//
//  Created by liupuyan on 16/10/12.
//  Copyright © 2016年 admin. All rights reserved.
//

#import "NSString+Extension.h"

@implementation NSString (Extension)
  
- (NSString *)getUTF8String
{
  return (NSString*)CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(nil, (CFStringRef)self, nil,(CFStringRef)@"!*'();:@&=+$,/?%#[]", kCFStringEncodingUTF8));
}


/**
 获得系统时间
 
 @return <#return value description#>
 */
+ (NSString *)xk_stringDate {
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"YYYY-MM-dd hh:mm:ss"];
    NSString *dateString = [dateFormatter stringFromDate:[NSDate date]];
    return dateString;
}
@end
