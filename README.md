> npm工具包

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

## check
**校验库**

### cellphone(value)
手机校验 ：`11位数字，首位1`

```js
check.cellphone('13456789012'); // true
```

### telphone(value)
固定电话校验：`3-4位区号，7-8位直拨号码`

```js
check.cellphone('0576-85735299'); // true

check.cellphone('057685735299'); // true
```

### phone(value)
电话【手机和固定电话】校验

```js
check.phone('057685735299'); // true

check.phone('13456789012'); // true
```

### email(value)
邮箱校验：`登录名@主机名.域名`

```js
check.email('june@163.com'); // true

check.email('te_st@sima.vip.com'); // true
```

### postcode(value)
邮编校验：`6位数字`

```js
check.postcode('310000'); // true
```

### isNull(value)
空校验

空数据集合：`undefined,'undefined',null,'null','(null)','NaN',''`

```js
check.isNull(); // true

check.isNull('undefined'); // true
```

### isNumber(value)
数字校验

```js
check.isNumber('20'); // true

check.isNumber('.2'); // false
```

### isInteger(value)
整数校验

```js
check.isInteger('20'); // true

check.isInteger('0.2'); // false
```

### isDecimal(value)
小数校验

```js
check.isDecimal('0.2'); // true

check.isDecimal('20'); // false
```

### hasChinese(value)
中文判断

```js
check.hasChinese('中文'); // true
check.hasChinese('。'); // true
```

### pwdIntensity(value)
弱密码校验：`1-弱|2-中|3-强`

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
```

### idCard(value)
身份证校验：`15位【一代身份证】或18位【二代身份证】`

```js
check.idCard('330000199001017865'); // true

check.idCard('33000019900101786X'); // true
```

***

## stringUtil
**字符串处理**

### isNull(str)
空校验

空数据集合：`undefined,'undefined',null,'null','(null)','NaN',''`

```js
stringUtil.isNull(); // true

stringUtil.isNull('undefined'); // true
```

### isNumber(str)
数字校验

```js
stringUtil.isNumber('20'); // true

stringUtil.isNumber('.2'); // false
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
***

## common
**通用方法**

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
