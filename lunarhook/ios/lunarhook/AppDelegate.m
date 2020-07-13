/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <UIKit/UIKit.h>
#import <BackgroundTasks/BackgroundTasks.h>
#import <Foundation/Foundation.h>
#import <ifaddrs.h>
#import <arpa/inet.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

@interface AppDelegate (){
    NSInteger count;
}
@property(strong, nonatomic)NSTimer *mTimer;
@property(assign, nonatomic)UIBackgroundTaskIdentifier backIden;

@end
@implementation AppDelegate
UIBackgroundTaskIdentifier backgroundTask;
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
            options:(NSDictionary<NSString*, id> *)options
{
  // Triggers a callback event.
  // 触发回调事件
  [RCTLinkingManager application:application openURL:url options:options];
  return [WXApi handleOpenURL:url delegate:self];
}
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    return  [WXApi handleOpenURL:url delegate:self];
}

- (BOOL)application:(UIApplication *)application
  continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable
  restorableObjects))restorationHandler {
  // 触发回调方法
  [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [WXApi handleOpenUniversalLink:userActivity
  delegate:self];
}
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"lunarhook"
                                            initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
    [self registerBgTask];
  return YES;
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    [self endBack];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


- (void)applicationDidEnterBackground:(UIApplication *)application {    _mTimer = [NSTimer scheduledTimerWithTimeInterval:30.0 target:self selector:@selector(countAction) userInfo:nil repeats:YES];
  [[NSRunLoop currentRunLoop] addTimer:_mTimer forMode:NSRunLoopCommonModes];
  [self beginTask];
  [self scheduleAppRefresh];
}

//计时
-(void)countAction{
    NSLog(@"%li",count++);
  if ([UIApplication sharedApplication].backgroundTimeRemaining < 60) {
  [[UIApplication sharedApplication] endBackgroundTask:self.backIden];
  self.backIden = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
      [[UIApplication sharedApplication] endBackgroundTask:self.backIden];
      self.backIden = UIBackgroundTaskInvalid;
  }];
  }
}

//申请后台
-(void)beginTask
{
    _backIden = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
        [self endBack];
    }];
}

//注销后台
-(void)endBack
{
    NSLog(@"end=============");
    [[UIApplication sharedApplication] endBackgroundTask:_backIden];
    _backIden = UIBackgroundTaskInvalid;
}


- (void)registerBgTask {
    
    if (@available(iOS 13.0, *)) {
        BOOL registerFlag = [[BGTaskScheduler sharedScheduler] registerForTaskWithIdentifier:@"com.lunarhook.kRefreshTaskId" usingQueue:nil launchHandler:^(__kindof BGTask * _Nonnull task) {
            [self handleAppRefresh:task];
        }];
        if (registerFlag) {
            NSLog(@"注册成功");
        } else {
            NSLog(@"注册失败");
        }
    } else {
        // Fallback on earlier versions
    }
    
    if (@available(iOS 13.0, *)) {
        [[BGTaskScheduler sharedScheduler] registerForTaskWithIdentifier:@"com.lunarhook.kCleanTaskId" usingQueue:nil launchHandler:^(__kindof BGTask * _Nonnull task) {
            [self handleAppRefresh:task];
        }];
    } else {
        // Fallback on earlier versions
    }
}

- (void)scheduleAppRefresh {
    
    if (@available(iOS 13.0, *)) {
        BGAppRefreshTaskRequest *request = [[BGAppRefreshTaskRequest alloc] initWithIdentifier:@"com.lunarhook.kRefreshTaskId"];
        // 最早15分钟后启动后台任务请求
        request.earliestBeginDate = [NSDate dateWithTimeIntervalSinceNow:15.0 * 60];
        NSError *error = nil;
        [[BGTaskScheduler sharedScheduler] submitTaskRequest:request error:&error];
        if (error) {
            NSLog(@"错误信息：%@", error);
        }
        
    } else {
        // Fallback on earlier versions
    }
}
- (void)handleAppRefresh:(BGAppRefreshTask *)appRefreshTask  API_AVAILABLE(ios(13.0)){
    
    [self scheduleAppRefresh];
    
    NSLog(@"App刷新====================================================================");

}

@end
