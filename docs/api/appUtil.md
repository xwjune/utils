# appUtil
**app交互**

```JavaScript
import { appUtil } from 'jun-utils';
```

## isIos()
IOS环境判断

## isAndroid()
Android环境判断

## isMobile()
移动端【手机、平板设备】环境判断

## isWeChat()
微信客户端判断

## isAliPay()
支付宝客户端判断

## isTaobao()
淘宝客户端判断

## alipayJSBridgeReady([callback])
监听alipay容器初始化

## alipayTitle(title, [subtitle])
支付宝设置标题

```JavaScript
appUtil.alipayTitle('标题', '副标题');
```

## alipayPopWindow()
支付宝关闭当前页面

## alipayExitApp()
支付宝退出当前应用

---

[← 返回 API 索引](../../README.md#api)
