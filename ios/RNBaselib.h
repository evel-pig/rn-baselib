
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#ifdef DEBUG
#import "NSString+Extension.h"
#define MyString [NSString stringWithFormat:@"%s", __FILE__].lastPathComponent
#define MyLog(...) printf("%s: %s 第%d行-------------------%s\n",[[NSString xk_stringDate] UTF8String] ,[MyString UTF8String], __LINE__, [[NSString stringWithFormat:__VA_ARGS__] UTF8String])
#else
#define MyLog(...)
#endif

@interface RNBaselib : NSObject <RCTBridgeModule>

@end
  
