package com.anonymous.RailManager.newarchitecture.modules;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.anonymous.RailManager.MainActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationModule extends ReactContextBaseJavaModule {
    private static final String TAG = "NotificationModule";
    private Context reactApplicationContext;
    private ReactApplicationContext mContext;

    public NotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
        this.reactApplicationContext = reactContext;

    }


    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }


    @ReactMethod
    public void startService() {
        Log.e(TAG, "startService: ");
    }

    @ReactMethod
    public void stopService() {
        Log.e(TAG, "stopService: ");
    }

}
