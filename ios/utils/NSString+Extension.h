//
//  NSString+DateExtension.h
//  QQMProject
//
//  Created by liupuyan on 16/10/12.
//  Copyright © 2016年 admin. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (Extension)

// 将NSString转换成UTF8编码的NSString
- (NSString *)getUTF8String;
  
/**
 获得系统时间
 
 @return <#return value description#>
 */
+ (NSString *)xk_stringDate;
@end
