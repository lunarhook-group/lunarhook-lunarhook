/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#include <sys/sysctl.h>
#include <net/if.h>
#include <net/if_dl.h>
#import "AppDelegate.h"
#import <Foundation/Foundation.h>

int main(int argc, char * argv[]) {
  //[test getMacAddress];
  @autoreleasepool {
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
