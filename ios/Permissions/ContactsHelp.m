
//
//  ContactsHelp.m
//  QQMProject
//
//  Created by admin on 15/11/20.
//  Copyright © 2015年 admin. All rights reserved.
//

#import "ContactsHelp.h"

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= __IPHONE_9_0
#import <Contacts/Contacts.h>
#else
#import <AddressBook/AddressBook.h>
#endif

@interface ContactsHelp ()
@end

@implementation ContactsHelp

+ (void)authPermissions:(void (^)(BOOL isAuthorized))callback {
    __block BOOL isAuthorized = NO;
#if __IPHONE_OS_VERSION_MIN_REQUIRED >= __IPHONE_9_0
    CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
    CNContactStore *store = [[CNContactStore alloc] init];
    if (status == CNAuthorizationStatusNotDetermined) {
        MyLog(@"用户未决定");
        [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
            isAuthorized = granted;
            if (callback) callback(isAuthorized);
            return;
        }];
    } else if (status == CNAuthorizationStatusAuthorized) { // 用户已授权
        MyLog(@"用户已授权");
        isAuthorized = YES;
        if (callback) callback(isAuthorized);
    } else {
        MyLog(@"用户已拒绝");
        isAuthorized = NO;
        if (callback) callback(isAuthorized);
    }
#else
    ABAuthorizationStatus status = ABAddressBookGetAuthorizationStatus();
    CFErrorRef myError = NULL;
    ABAddressBookRef addressBook = ABAddressBookCreateWithOptions(NULL, &myError);
    if (myError) {
        isAuthorized = NO;
        if (callback) callback(isAuthorized);
    } else {
        if (status == kABAuthorizationStatusNotDetermined) {
            MyLog(@"用户未决定");
            ABAddressBookRequestAccessWithCompletion(addressBook, ^(bool granted, CFErrorRef error) {
                isAuthorized = granted;
                if (callback) callback(isAuthorized);
                return;
            });
        } else if (status == kABAuthorizationStatusAuthorized) {  // 用户已授权
            MyLog(@"用户已授权");
            isAuthorized = YES;
            if (callback) callback(isAuthorized);
        } else {
            MyLog(@"用户已拒绝");
            isAuthorized = NO;
            if (callback) callback(isAuthorized);
        }
    }
    if (addressBook) CFRelease(addressBook);
    if (myError) CFRelease(myError);
#endif
}

@end
