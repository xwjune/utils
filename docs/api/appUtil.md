<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# appUtil
**app 交互**

```JavaScript
import { appUtil } from 'jun-utils';
```

## isIos()
**IOS 环境判断**

```JavaScript
appUtil.isIos(); // iPhone Safari
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

```JavaScript
appUtil.isMobile(); // iPhone Safari
// => true

appUtil.isMobile(); // 桌面 Chrome
// => false
```

## isWeChat()
**微信客户端判断**

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

## alipayJSBridgeReady([callback])
**监听 alipay 容器初始化**

```JavaScript
appUtil.alipayJSBridgeReady(() => {
  appUtil.alipayTitle('标题'); // 容器就绪后再调用容器 API
});
```

## alipayTitle(title, [subtitle])
**支付宝设置标题**

```JavaScript
appUtil.alipayTitle('标题', '副标题');
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
