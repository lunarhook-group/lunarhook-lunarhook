package com.lunarhook;

import android.app.Application;
import android.app.Activity;
import android.content.Context;
import com.facebook.react.PackageList;
import android.os.Bundle;


import com.facebook.react.ReactApplication;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.reactlibrary.RNSwissephPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.clipsub.RNShake.RNShakeEventPackage;
import com.theweflex.react.WeChatPackage;
//import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;

import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import java.lang.reflect.InvocationTargetException;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.plumber.NativePlumberPackage;
import java.util.Arrays;
import java.util.List;
//import com.facebook.react.PackageList;
import android.content.pm.*;
import android.content.Context;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new NativePlumberPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

    @Override
    public void onCreate() {
        //Compass.init(this, getChannel(this), "", "plumber-sdk");
        super.onCreate();
        //MultiDex.install(this);
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this); // Remove this line if you don't want Flipper enabled
        this.registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

            }

            @Override
            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {

            }

            @Override
            public void onActivityStarted(Activity activity) {

            }


            @Override
            public void onActivityPaused(Activity activity) {
                //Compass.setLocationInfo(20.0f,20.0f,"testgeoinfo","testgeoinfo");
            }

            @Override
            public void onActivityStopped(Activity activity) {

            }

            @Override
            public void onActivityResumed(Activity activity) {
                //Compas
                //Compass.setLocationInfo(10.0f,10.0f,"testgeoinfo","testgeoinfo");
            }

            @Override
            public void onActivityDestroyed(Activity activity) {

            }
        });
    }

    private String getChannel(Context context) {
        try {
            PackageManager pm = context.getPackageManager();
            String name = context.getPackageName();
            ApplicationInfo appInfo = pm.getApplicationInfo(name, PackageManager.GET_META_DATA);
            String channel = appInfo.metaData.getString("ChannelId");
            return channel;
        } catch (Exception e) {
        }
        return "default";
    }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
