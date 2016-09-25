package com.olzone.hackgovapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    public WebView webView;
    public WebAppInterface mWebInterface;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        InitWebView();
    }

    private void InitWebView() {
        webView = (WebView)findViewById(R.id.webView);
        mWebInterface = new WebAppInterface(this, webView);
        WebSettings webSettings = webView.getSettings();

        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setGeolocationDatabasePath( this.getFilesDir().getPath() );
        webSettings.setAppCacheEnabled(true);

        webView.addJavascriptInterface(mWebInterface, "Android");

        webView.setWebChromeClient(new WebChromeClient() {
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        mWebInterface.backButton();
    }

    public void foo() {
    }
}
//my department