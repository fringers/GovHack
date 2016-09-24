package com.olzone.hackgovapp;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.olzone.hackgovapp.MainActivity;

public class WebAppInterface {
    MainActivity mContext;
    WebView mWebView;;

    WebAppInterface(MainActivity c) {
        mContext = c;
    }

    WebAppInterface(MainActivity c, WebView v) {
        mContext = c;
        mWebView = v;
    }

    @JavascriptInterface
    public void backButton() {
        mWebView.loadUrl("javascript:backButton()");
        mContext.foo();
    }

}
