<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# appUtil
**app 交互**

```JavaScript
import { appUtil } from 'jun-utils';
```

## isIos()
**IOS 环境判断**

iPadOS 13+ 默认请求的桌面 UA 同样识别为 IOS

```JavaScript
appUtil.isIos(); // iPhone Safari
// => true

appUtil.isIos(); // iPad Safari（iPadOS 13+ 桌面 UA）
// => true

appUtil.isIos(); // Android Chrome
// => false
```

## isAndroid()
**Android 环境判断**

```JavaScript
appUtil.isAndroid(); // Android Chrome
// => true

appUtil.isAndroid(); // iPhone Safari
// => false
```

## isMobile()
**移动端【手机、平板设备】环境判断**

iPadOS 13+ 默认请求的桌面 UA 同样识别为移动端

```JavaScript
appUtil.isMobile(); // iPhone Safari
// => true

appUtil.isMobile(); // iPad Safari（iPadOS 13+ 桌面 UA）
// => true

appUtil.isMobile(); // 桌面 Chrome
// => false
```

## isWeChat()
**微信客户端判断**

PC/Mac 微信内置浏览器同样返回 true，需限定移动端时配合 isMobile 使用

```JavaScript
appUtil.isWeChat(); // 微信内置浏览器
// => true

appUtil.isWeChat(); // 系统浏览器
// => false
```

## isAliPay()
**支付宝客户端判断**

```JavaScript
appUtil.isAliPay(); // 支付宝内置浏览器
// => true

appUtil.isAliPay(); // 系统浏览器
// => false
```

## isTaobao()
**淘宝客户端判断**

```JavaScript
appUtil.isTaobao(); // 淘宝内置浏览器
// => true

appUtil.isTaobao(); // 系统浏览器
// => false
```

## alipayJSBridgeReady(callback)
**监听 alipay 容器初始化**

容器已注入时同步触发回调，否则监听 AlipayJSBridgeReady 事件后触发，两条路径均不传参，监听为 once 触发一次后自动移除。  
非支付宝容器中该事件不会触发，回调永不执行；callback 非函数抛 TypeError

```JavaScript
appUtil.alipayJSBridgeReady(() => {
  appUtil.alipayTitle('标题'); // 容器就绪后再调用容器 API
});

appUtil.alipayJSBridgeReady(); // 非函数抛 TypeError
// => throw Error（alipayJSBridgeReady 只接受函数）
```

## alipayTitle(title, [subtitle])
**支付宝设置标题**

title 非字符串不做隐式转换，直接抛 TypeError；subtitle 未传时不携带该键

```JavaScript
appUtil.alipayTitle('标题', '副标题');

appUtil.alipayTitle(123); // 非字符串抛 TypeError
// => throw Error（alipayTitle 的 title 必须是字符串）
```

## alipayPopWindow()
**支付宝关闭当前页面**

```JavaScript
appUtil.alipayPopWindow(); // 关闭当前页面
```

## alipayExitApp()
**支付宝退出当前应用**

```JavaScript
appUtil.alipayExitApp(); // 退出当前应用
```

---

[← 返回 API 索引](../../README.md#api)
