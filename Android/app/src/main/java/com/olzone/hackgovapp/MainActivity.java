package com.olzone.hackgovapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
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

        webView.addJavascriptInterface(mWebInterface, "Android");

        webView.setWebViewClient(new WebViewClient() {
            public void onPageFinished(WebView view, String url) {
                ;
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