> jun-utils

[git地址](https://github.com/xwjune/jun-utils.git)

## 使用
```bash
## Install globally or locally
$ npm i jun-utils -S
```

```js
import { check } from 'jun-utils';

// 手机号码校验
check.cellphone('13456789012'); // true
```
索引：

* [check](#check)
* [stringUtil](#stringUtil)
* [pinyinUtil](#pinyinUtil)
* [floatUtil](#floatUtil)
* [treeUtil](#treeUtil)
* [appUtil](#appUtil)
* [common](#common)
* [crypt](#crypt)
* [pickTime](#pickTime)

## check
**校验库**

```js
import { check } from 'jun-utils';
```

### cellphone(value)
手机校验 `11位数字，首位1`

```js
check.cellphone('13456789012'); // true
```

### telphone(value)
固定电话校验 `3-4位区号，7-8位直拨号码`

```js
check.telphone('0571-85735888'); // true

check.telphone('057185735888'); // true

check.telphone('85735888'); // true
```

### phone(value)
电话【手机和固定电话】校验

```js
check.phone('057185735888'); // true

check.phone('13456789012'); // true
```

### email(value)
邮箱校验 `登录名@主机名.域名`

```js
check.email('test@163.com'); // true

check.email('te_st@sima.vip.com'); // true
```

### postcode(value)
邮编校验 `6位数字`

```js
check.postcode('310000'); // true
```

### isNull(value)
空校验

空数据集合 `undefined,'undefined',null,'null','(null)','NaN',''`

```js
check.isNull(); // true

check.isNull('undefined'); // true
```

### isNumber(value)
数字校验

```js
check.isNumber('20'); // true

check.isNumber('-20'); // true

check.isNumber('.2'); // false
```

### isInteger(value)
整数校验

```js
check.isInteger('20'); // true

check.isInteger('-20'); // true

check.isInteger('0.2'); // false

check.isInteger('020'); // false
```

### isDecimal(value)
小数校验

```js
check.isDecimal('0.2'); // true

check.isDecimal('-0.2'); // true

check.isDecimal('20'); // false

check.isDecimal('00.2'); // false
```

### money(value)
金额【元】判断

```js
check.money('-20'); // true

check.money('-20.00'); // true

check.money('20.002'); // false

check.money('002'); // false
```

### hasChinese(value)
中文判断

```js
check.hasChinese('中文'); // true

check.hasChinese('。'); // true
```

### idCard(value)
身份证校验：`一代身份证【15位】或二代身份证【18位】`

```js
check.idCard('330000199001017865'); // true

check.idCard('33000019900101786X'); // true

check.idCard('330000900101786'); // true
```

### ip(value)
ip地址校验

```js
check.ip('192.168.0.1'); // true
```

### alipay(value)
支付宝账号校验 `邮箱或手机号`

```js
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

```js
check.pwdIntensity('123456'); // 1

check.pwdIntensity('123456abc'); // 2

check.pwdIntensity('123456abcABC'); // 3
```

***

## stringUtil
**字符串处理**

```js
import { stringUtil } from 'jun-utils';
```

### isNull(str)
空校验

空数据集合 `undefined,'undefined',null,'null','(null)','NaN',''`

```js
stringUtil.isNull(); // true

stringUtil.isNull('undefined'); // true
```

### filterNull(str, [format=''])
空数据过滤

```js
stringUtil.filterNull('xxx'); // xxx

stringUtil.filterNull(); //

stringUtil.filterNull(null, '--'); // --
```

### convertFenToYuan(str, [format='0.00'])
分转化成元

```js
stringUtil.convertFenToYuan('2000'); // 20.00

stringUtil.convertFenToYuan('2000.45'); // 20.00

stringUtil.convertFenToYuan(); // 0.00

stringUtil.convertFenToYuan(null, '--'); // --
```

### convertYuanToFen(str, [format='0'])
元转化为分

```js
stringUtil.convertYuanToFen('20'); // 2000

stringUtil.convertYuanToFen('0.02'); // 2

stringUtil.convertYuanToFen('0.002'); // 0

stringUtil.convertYuanToFen(); // 0

stringUtil.convertYuanToFen(null, '--'); // --
```

### convertCurrency(str, [format='零元整'])
数字金额转换为中文人民币大写

最大处理数字 `999999999999.99`

```js
stringUtil.convertCurrency('0'); // 零元整

stringUtil.convertCurrency(''); // 零元整

stringUtil.convertCurrency('100000000'); // 壹亿元整

stringUtil.convertCurrency('100000001'); // 壹亿零壹元整

stringUtil.convertCurrency('1.01'); // 壹元零壹分

stringUtil.convertCurrency('1.10'); // 壹元壹角
```

***

## pinyinUtil
**汉字与拼音互转**

```js
import { pinyinUtil } from 'jun-utils';
```

### getPinyin(chinese, [splitter=''], [withtone=false])
根据汉字获取拼音

```js
pinyinUtil.getPinyin('小明', ' '); // xiao ming

pinyinUtil.getPinyin('小明', ' ', true); // xiǎo míng

pinyinUtil.getPinyin('小明plus', ' '); // xiao ming plus
```

### getCityPinyin(city, [splitter=''], [withtone=false])
获取城市拼音【城市多音字已处理】

```js
pinyinUtil.getCityPinyin('重庆市'); // chongqingshi

pinyinUtil.getCityPinyin('西藏', ' ', true); // xī zhàng
```

## getHanzi(pinyin)
单个拼音转汉字

```js
pinyinUtil.getHanzi('diu'); // 丟丢銩铥颩
```

***

## floatUtil
**浮点数运算【解决精度问题】**

```js
import { floatUtil } from 'jun-utils';
```

### add(arg1, arg2, [format=''])
加法

```js
floatUtil.add(0.1, 0.2); // 0.3

floatUtil.add(2.22, 0.1); // 2.32

floatUtil.add(2.22, 'xx', '--'); // --
```

### subtract(arg1, arg2, [format=''])
减法

```js
floatUtil.subtract(1.5, 1.2); // 0.3

floatUtil.subtract(0.3, 0.2); // 0.1
```

### multiply(arg1, arg2, [format=''])
乘法

```js
floatUtil.multiply(19.9, 100); // 1990

floatUtil.multiply(0.7, 180); // 126
```

### divide(arg1, arg2, [format=''])
除法

```js
floatUtil.divide(0.3, 0.1); // 3

floatUtil.divide(0.69, 10); // 0.069
```

***

## treeUtil
**树结构数据操作**

```js
import { treeUtil } from 'jun-utils';
```

### dataConvert(source, attributes)
数据转换

```js
const source = [
  { id: '330000', value: '浙江省', parentId: '100000' },
  { id: '330100', value: '杭州市', parentId: '330000' },
  { id: '330200', value: '宁波市', parentId: '330000' },
  { id: '320000', value: '江苏省', parentId: '100000' },
  { id: '320100', value: '南京市', parentId: '320000' },
  { id: '320200', value: '无锡市', parentId: '320000' },
];
const attributes = { rootId: '100000', pId: 'parentId', name: 'value' };
treeUtil.dataConvert(source, attributes);
// => 
[{
  id: '330000',
  name: '浙江省', 
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}, { 
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}];
```

### dataPick(treeData, values, [attributes])
数据提取

```js
const treeData = [{
  id: '330000',
  name: '浙江省', 
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}, { 
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}];
treeUtil.dataPick(treeData, ['330000', '330100']); // ['浙江省', '杭州市']
```

### dataMatch(treeData, value, [attributes])
判断数据是否存在

```js
const treeData = [{
  id: '330000',
  name: '浙江省', 
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}, { 
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}];
treeUtil.dataMatch(treeData, '杭州市', { key: 'name' }); // true
```

***

## appUtil
**app交互**

```js
import { appUtil } from 'jun-utils';
```

### isIos()
IOS环境判断

```js
appUtil.isIos();
```

### isAndroid()
Android环境判断

```js
appUtil.isAndroid();
```

### isMobile()
移动端【手机、平板设备】环境判断

```js
appUtil.isMobile();
```

### isWeChat()
微信客户端判断

```js
appUtil.isWeChat();
```

### isAliPay()
支付宝客户端判断

```js
appUtil.isAliPay();
```

### isTaobao()
淘宝客户端判断

```js
appUtil.isTaobao();
```

### alipayJSBridgeReady([callback])
监听alipay容器初始化

```js
appUtil.alipayJSBridgeReady();
```

### alipayTitle(title, [subtitle])
支付宝设置标题

```js
appUtil.alipayTitle('标题', '副标题');
```

### alipayPopWindow()
支付宝关闭当前页面

```js
appUtil.alipayPopWindow();
```

### alipayExitApp()
支付宝退出当前应用

```js
appUtil.alipayExitApp();
```

***

## common
**通用方法**

```js
import { common } from 'jun-utils';
```

### generateUUID()
生成uuid

```js
common.generateUUID(); // cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
```

### getParameter(name, [url=window.location.search])
获取url中的参数

```js
common.getParameter('name', 'http://www.w3school.com?name=xxx'); // xxx
```

### loadScript(url, [callback])
动态加载js

```js
common.loadScript('https://xxx.js', () => {
  console.log('loaded');
});
```

### stopPropagation(evt)
阻止事件冒泡

```js
common.stopPropagation(event);
```

### preventDefault(evt);
阻止事件默认行为

```js
common.preventDefault(event);
```

### addEvent(target, type, handler, [useCapture=false]);
添加事件监听

```js
const handler = () => {
  console.log('onload');
};
common.addEvent(window, 'load', handler);
```

### removeEvent(target, type, handler, [useCapture=false]);
移除事件监听

```js
const handler = () => {
  console.log('onload');
};
common.removeEvent(window, 'load', handler);
```

***

## crypt
**加密解密【用于暴露在url中的重要参数】**

```js
import { crypt } from 'jun-utils';
```

### encode(value)
加密

```js
crypt.encode('123456'); // CJ8pD3Ks
```

### decode(value)
解密

```js
crypt.decode('CJ8pD3Ks'); // 123456
```

***

## pickTime
**预约时间解析**

根据对应的时间区间和间隔天数，推算出可选的时间范围，可用于快递上门取件等场景

```js
import { pickTime } from 'jun-utils';
```

### pickTime(range, interval, [attributes])

```js
// 9:00~13:00 T+2 当前时间：2018-08-11 10:10
pickTime([9, 13], 2, { key: 'value', name: 'label' });
// =>
[{
  label: '08月11日',
  value: '1533916800',
  children: [
    { label: '11:00-12:00', value: '1533956400' },
    { label: '12:00-13:00', value: '1533960000' },
  ],
}, {
  label: '08月12日',
  value: '1534003200',
  children: [
    { label: '09:00-10:00', value: '1534035600' },
    { label: '10:00-11:00', value: '1534039200' },
    { label: '11:00-12:00', value: '1534042800' },
    { label: '12:00-13:00', value: '1534046400' },
  ],
}, {
  label: '08月13日',
  value: '1534089600',
  children: [
    { label: '09:00-10:00', value: '1534122000' },
    { label: '10:00-11:00', value: '1534125600' },
    { label: '11:00-12:00', value: '1534129200' },
    { label: '12:00-13:00', value: '1534132800' },
  ],
}];
```

***
