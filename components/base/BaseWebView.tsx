import React, { PureComponent } from 'react';
import {
  WebView,
  Platform,
  requireNativeComponent,
  WebViewProperties,
  WebViewProps,
} from 'react-native';

export interface BaseWebViewProps extends WebViewProperties {
  getRef?: any;
}

// react-native自带的webview在安卓上不能拍照片和选择照片.
class BaseWebView extends PureComponent<BaseWebViewProps, any> {
  render() {
    return (
      <WebView
        ref={this.props.getRef}
        dataDetectorTypes={'link'}
        startInLoadingState
        {...Platform.select({
          android: {
            mixedContentMode: 'always', // 是否应该允许安全链接（https）页面中加载非安全链接（http）
            javaScriptEnabled: true,    // 控制是否启用 JavaScript
            domStorageEnabled: true,    // 是否开启 DOM 本地存储
            nativeConfig: Config,       // 安卓使用原生webview
          } as WebViewProps,
        })}
        {...this.props}
      >
        {this.props.children}
      </WebView>
    );
  }
}

const Config = Platform.OS === 'android' ? {
  component: requireNativeComponent('CustomWebView'),
} : null;

export default BaseWebView;
