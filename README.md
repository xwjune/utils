> jun-utils

## Installation

Install with npm:

```bash
npm install --save-dev jun-utils
```

Install with yarn:

```bash
yarn add jun-utils --dev
```

## Usage

ES6 module:

```JavaScript
import { check } from 'jun-utils'; // import check from 'jun-utils/lib/check';

// 手机号码校验
check.cellphone('13456789012'); // true
```

Script:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>jun-utils</title>
  <script src="jun-utils.min.js"></script>
</head>
<body>
  <script type="text/javascript">
    junUtils.check.cellphone('13456789012'); // true
  </script>
</body>
</html>
```

## API

索引：

* [check](#check)
* [stringUtil](#stringUtil)
* [floatUtil](#floatUtil)
* [treeUtil](#treeUtil)
* [appUtil](#appUtil)
* [convert](#convert)
* [common](#common)
* [crypt](#crypt)
* [ws](#ws)

## check
**校验库**

```JavaScript
import { check } from 'jun-utils';
```

### cellphone(value)
手机校验 `11位数字，首位1`

```JavaScript
check.cellphone('13456789012'); // true
```

### telphone(value)
固定电话校验 `3-4位区号，7-8位直拨号码`

```JavaScript
check.telphone('0571-85735888'); // true

check.telphone('057185735888'); // true

check.telphone('85735888'); // true
```

### phone(value)
电话【手机和固定电话】校验

```JavaScript
check.phone('057185735888'); // true

check.phone('13456789012'); // true
```

### email(value)
邮箱校验 `登录名@主机名.域名`

```JavaScript
check.email('test@163.com'); // true

check.email('te_st@sima.vip.com'); // true
```

### postcode(value)
邮编校验 `6位数字`

```JavaScript
check.postcode('310000'); // true
```

### isNull(value)
空数据校验 `undefined, null, ''`

```JavaScript
check.isNull(); // true

check.isNull(null); // true

check.isNull(''); // true
```

### isNumber(value)
数字校验

```JavaScript
check.isNumber('20'); // true

check.isNumber('-20'); // true

check.isNumber('.2'); // false

check.isNumber(.2); // true

check.isNumber(9.007199254740992e+21); // true
```

### isInteger(value)
整数校验 `不兼容科学计数法数字`

```JavaScript
check.isInteger('20'); // true

check.isInteger('-20'); // true

check.isInteger('0.2'); // false

check.isInteger('020'); // false
```

### isDecimal(value)
小数校验 `不兼容科学计数法数字`

```JavaScript
check.isDecimal('0.2'); // true

check.isDecimal('-0.2'); // true

check.isDecimal('20'); // false

check.isDecimal('00.2'); // false
```

### money(value)
金额【元】判断

```JavaScript
check.money('-20'); // false

check.money('20.00'); // true

check.money('20.002'); // false

check.money('002'); // false
```

### hasChinese(value)
中文判断

```JavaScript
check.hasChinese('中文'); // true

check.hasChinese('。'); // true
```

### idCard(value)
身份证校验：`一代身份证【15位】或二代身份证【18位】`

```JavaScript
check.idCard('330000199001017865'); // true

check.idCard('33000019900101786X'); // true

check.idCard('330000900101786'); // true
```

### ip(value)
ip地址校验

```JavaScript
check.ip('192.168.0.1'); // true
```

### alipay(value)
支付宝账号校验 `邮箱或手机号`

```JavaScript
check.alipay('test@163.com'); // true

check.alipay('13456789012'); // true
```

### pwdIntensity(value)
弱密码校验 `1-弱|2-中|3-强`

规则：

1. 位数为6-32位，包括6位或32位
2. 包含以下任意两种或以上组成元素：
	- 数字
	- 大写字母
	- 小写字母
	- 符号【键盘上可以打出来的符号】

```JavaScript
check.pwdIntensity('123456'); // 1

check.pwdIntensity('123456abc'); // 2

check.pwdIntensity('123456abcABC'); // 3
```

### illegalChar(value)
非法字符校验 `",\,\n`

```JavaScript
check.illegalChar('123\n123'); // true
check.illegalChar('123\t123'); // true
check.illegalChar('123\v123'); // true
check.illegalChar('123\\123'); // true
check.illegalChar('123"123'); // true
check.illegalChar('123'); // false
```

***

## stringUtil
**字符串处理**

```JavaScript
import { stringUtil } from 'jun-utils';
```

### filterNull(str, [format=''])
空数据过滤

```JavaScript
stringUtil.filterNull('xxx'); // xxx

stringUtil.filterNull(); //

stringUtil.filterNull(null, '--'); // --
```

***

## floatUtil
**浮点数运算【解决精度问题】**

```JavaScript
import { floatUtil } from 'jun-utils';
```

### add(arg1, arg2, [format=''])
加法

```JavaScript
floatUtil.add(0.1, 0.2); // 0.3

floatUtil.add(2.22, 0.1); // 2.32

floatUtil.add(2.22, 'xx', '--'); // --
```

### subtract(arg1, arg2, [format=''])
减法

```JavaScript
floatUtil.subtract(1.5, 1.2); // 0.3

floatUtil.subtract(0.3, 0.2); // 0.1
```

### multiply(arg1, arg2, [format=''])
乘法

```JavaScript
floatUtil.multiply(19.9, 100); // 1990

floatUtil.multiply(0.7, 180); // 126
```

### divide(arg1, arg2, [format=''])
除法

```JavaScript
floatUtil.divide(0.3, 0.1); // 3

floatUtil.divide(0.69, 10); // 0.069
```

***

## treeUtil
**树结构数据操作**

```JavaScript
import { treeUtil } from 'jun-utils';
```

### dataConvert(source, options)
数据转换

#### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| source | 源数据 | object[] | [] |
| options | 配置参数 | object | {} |
| options.pId | 源数据父主键key | string  | - |
| options.rootId | 源数据根节点主键值 | string | - |
| options.id | 源数据主键key | string | id |
| options.name | 源数据名称key | string | name |
| options.tId | 树节点主键key | string | id |
| options.tName | 树节点名称key | string | name |
| options.children | 树节点子集合key | string | children |
| options.raw | 是否保留所有属性 | boolean | false |
| options.otherKeys | 其他需要保留的属性 | array | [] |

```JavaScript
const source = [
  { id: '330000', value: '浙江省', parentId: '100000' },
  { id: '330100', value: '杭州市', parentId: '330000' },
  { id: '330200', value: '宁波市', parentId: '330000' },
  { id: '320000', value: '江苏省', parentId: '100000' },
  { id: '320100', value: '南京市', parentId: '320000' },
  { id: '320200', value: '无锡市', parentId: '320000' },
];
const options = { rootId: '100000', pId: 'parentId', name: 'value' };
treeUtil.dataConvert(source, options);
// => 
[{ 
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}, {
  id: '330000',
  name: '浙江省',
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}];
```

### dataPick(treeData, values, [options])
数据提取

#### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| treeData | 源数据 | object[] | [] |
| values | 原始值 | array | - |
| options | 配置参数 | object | {} |
| options.origin | 原始key | string  | id |
| options.key | 提取key | string  | name |
| options.children | 子集合key | string | children |

```JavaScript
const treeData = [{
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}, {
  id: '330000',
  name: '浙江省',
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}];
treeUtil.dataPick(treeData, ['330000', '330100']); // ['浙江省', '杭州市']
```

### dataFind(treeData, value, [options])
数据查找

#### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| treeData | 源数据 | object[] | [] |
| value | 属性值 | string | - |
| options | 配置参数 | object | {} |
| options.key | key | string  | id |
| options.children | 子集合key | string | children |

```JavaScript
const treeData = [{
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}, {
  id: '330000',
  name: '浙江省',
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}];
treeUtil.dataFind(treeData, '330100'); // { id: '330100', name: '杭州市' }
```

***

## appUtil
**app交互**

```JavaScript
import { appUtil } from 'jun-utils';
```

### isIos()
IOS环境判断

### isAndroid()
Android环境判断

### isMobile()
移动端【手机、平板设备】环境判断

### isWeChat()
微信客户端判断

### isAliPay()
支付宝客户端判断

### isTaobao()
淘宝客户端判断

### alipayJSBridgeReady([callback])
监听alipay容器初始化

### alipayTitle(title, [subtitle])
支付宝设置标题

```JavaScript
appUtil.alipayTitle('标题', '副标题');
```

### alipayPopWindow()
支付宝关闭当前页面

### alipayExitApp()
支付宝退出当前应用

***

## convert
**数据转换**

```JavaScript
import { convert } from 'jun-utils';
```

### bytesToSize(value, [digit=1], [format='0B'])
数据容量单位换算

```JavaScript
convert.bytesToSize(10240); // 10.0KB

convert.bytesToSize(1024 * 1024, 2); // 1.00MB

convert.bytesToSize('32g'); // 0B
```

### fenToYuan(value, [format='0.00'], [cutZero=false])
分转化成元

```JavaScript
convert.fenToYuan(2000); // 20.00

convert.fenToYuan(2000, '0', true); // 20 去掉小数末尾多余的零

convert.fenToYuan(2000.45); // 20.00 非正确格式，舍去小数部分

convert.fenToYuan(); // 0.00

convert.fenToYuan(null, '--'); // --
```

### yuanToFen(value, [format='0'])
元转化成分

```JavaScript
convert.yuanToFen(20); // 2000

convert.yuanToFen(0.02); // 2

convert.yuanToFen(0.002); // 0

convert.yuanToFen(); // 0

stringUtil.yuanToFen(null, '--'); // --
```

### numberToCn(value)
阿拉伯数字转中文
`处理数字不超过1000000000000【壹万亿】`

```JavaScript
convert.numberToCn(0.01); // 零点零壹

convert.numberToCn(100); // 壹佰

convert.numberToCn(1008); // 壹仟零捌

convert.numberToCn(10008000); // 壹仟万捌仟

convert.numberToCn(100000800); // 壹亿零捌佰

convert.numberToCn(100008000); // 壹亿零捌仟

convert.numberToCn('12x'); // 数据错误

convert.numberToCn(1000000000000); // 超大数字
```

### currencyToCn(value, [format='零元整'])
数字金额转换为中文人民币大写

最大处理数字 `999999999999.99`

```JavaScript
convert.currencyToCn(0); // 零元整

convert.currencyToCn(); // 零元整

convert.currencyToCn(100000000); // 壹亿元整

convert.currencyToCn(100000001); // 壹亿零壹元整

convert.currencyToCn(999999999999.99); // 玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分

convert.currencyToCn(1.01); // 壹元零壹分

convert.currencyToCn(1.10); // 壹元壹角

convert.currencyToCn('1x'); // 数据错误

convert.currencyToCn(1000000000000); // 超大金额
```

### combination(arr)
列出n个数组所有组合

```JavaScript
const arr =  [
  ['黑色', '白色'],
  ['64G', '128G'],
  ['国行', '港行'],
  ['全网通'],
];
combination(arr);
// => 
[
  ['黑色', '64G', '国行', '全网通'],
  ['黑色', '64G', '港行', '全网通'],
  ['黑色', '128G', '国行', '全网通'],
  ['黑色', '128G', '港行', '全网通'],
  ['白色', '64G', '国行', '全网通'],
  ['白色', '64G', '港行', '全网通'],
  ['白色', '128G', '国行', '全网通'],
  ['白色', '128G', '港行', '全网通'],
];
```

### toThousands(value, [format=''])
数字千位符分隔

```JavaScript
convert.toThousands(12345678); // 12,345,678

convert.toThousands(12345678.90); // 12,345,678.90

convert.toThousands(); // ''
```

***

## common
**通用方法**

```JavaScript
import { common } from 'jun-utils';
```

### generateUUID()
生成uuid

```JavaScript
common.generateUUID(); // cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
```

### getParameter(name, [url=window.location.search])
获取url中的参数

```JavaScript
common.getParameter('name', 'http://www.w3school.com?name=xxx'); // xxx

common.getParameter('name', 'http://www.w3school.com?name='); // ''

common.getParameter('name', 'http://www.w3school.com'); // null
```

### loadScript(url, [callback])
动态加载js

```JavaScript
common.loadScript('https://xxx.js', () => {
  console.log('loaded');
});
```

### stopPropagation(evt)
阻止事件冒泡

### preventDefault(evt);
阻止事件默认行为

### addEvent(target, type, handler, [useCapture=false]);
添加事件监听

```JavaScript
const handler = () => {
  console.log('onload');
};
common.addEvent(window, 'load', handler);
```

### removeEvent(target, type, handler, [useCapture=false]);
移除事件监听

```JavaScript
const handler = () => {
  console.log('onload');
};
common.removeEvent(window, 'load', handler);
```

### getCookie(name)
读取cookie

### setCookie(name, value, [options={}])
创建cookie

```JavaScript
// 一天后过期
common.setCookie('name', 'value', {
  maxAge: 60 * 60 * 24,
});
```

### delCookie(name)
删除cookie

### getWinHeight()
获取窗口可视区的高度

### getWinWidth()
获取窗口可视区的宽度

### getWinScrollHeight()
获取窗口可视区内容的总高度

### getWinScrollWidth()
获取窗口可视区内容的总宽度

### getWinScrollTop()
获取窗口可视区滚动条垂直偏移

### getWinScrollLeft()
获取窗口可视区滚动条水平偏移

### selectText(textNode, [start=0], [length])
选中文本

```JavaScript
<input type="text" value="12元" />

// 鼠标停留在’元‘前面
common.selectText(document.querySelector('input'), 2, 0);

// 选中所有
common.selectText(document.querySelector('input'));
```
***

## crypt
**加密解密【用于暴露在url中的重要参数】**

```JavaScript
import { crypt } from 'jun-utils';
```

### encode(value)
加密

```JavaScript
crypt.encode('123456'); // CJ8pD3Ks
```

### decode(value)
解密

```JavaScript
crypt.decode('CJ8pD3Ks'); // 123456
```

## ws
**webSocket【断线重连】**

```JavaScript
import { ws } from 'jun-utils';
```

### ws(url, [options])

| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| url | 服务器网址 | string | - |
| options | 配置参数 | object | {} |
| options.timeout | 重连频率【毫秒】 | number  | 3000 |
| options.limitConnect | 断线重连次数 | number | 3 |
| options.onopen | 连接建立回调 | function(ws) | - |
| options.onclose | 连接关闭回调 | function | - |
| options.onmessage | 接收数据回调 | function(data) | - |
| options.reconnect | 重连回调 | function(ws) | - |
