<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# check
**校验库**

```JavaScript
import { check } from 'jun-utils';
```

## cellphone(value)
**手机校验**

规则：11 位数字，首位 1

```JavaScript
check.cellphone('13456789012'); // 11 位手机号
// => true

check.cellphone(13456789012); // 数字非字符串
// => false

check.cellphone(['13456789012']); // 数组非字符串
// => false
```

## telphone(value)
**固定电话校验**

规则：3-4 位 0 开头区号【国内区号均 0 起，如 010、0571】，7-8 位直拨号码；区号可省

```JavaScript
check.telphone('0571-85735888'); // 区号带连字符
// => true

check.telphone('057185735888'); // 区号不带连字符
// => true

check.telphone('010-12345678'); // 3 位区号
// => true

check.telphone('85735888'); // 省略区号
// => true

check.telphone('999-9999999'); // 区号非 0 开头，不是国内固话
// => false

check.telphone(['0571-85735888']); // 数组非字符串
// => false
```

## phone(value)
**电话【手机和固定电话】校验**

```JavaScript
check.phone('057185735888'); // 固定电话
// => true

check.phone('13456789012'); // 手机号
// => true

check.phone([13456789012]); // 数组非字符串
// => false
```

## email(value)
**邮箱校验**

规则：登录名@主机名.域名

- 登录名可用字母、数字、_、-、+，点仅作分段符【不可在首尾或连续】
- 域名标签不可以连字符开头或结尾，点同样仅作分段符
- 顶级域为纯字母且至少 2 位【放行 .technology 等新顶级域】

```JavaScript
check.email('test@163.com'); // 常规邮箱
// => true

check.email('te_st@sima.vip.com'); // 登录名含下划线，多级域名
// => true

check.email('test+tag@163.com'); // + 别名合法
// => true

check.email('test@163..com'); // 域名连续点
// => false

check.email('test@163-.com'); // 域名标签连字符收尾
// => false

check.email(['test@163.com']); // 数组非字符串
// => false
```

## postcode(value)
**邮编校验**

规则：6 位数字【前导零合法，如内蒙 010000、河北 050000】

```JavaScript
check.postcode('310000'); // 常规 6 位
// => true

check.postcode('010000'); // 前导零合法，内蒙 010000、河北 050000
// => true

check.postcode('3100000'); // 7 位不符 6 位
// => false

check.postcode(['310000']); // 数组非字符串
// => false
```

## isNull(value)
**空数据校验**

空数据集合：undefined, null, ''

```JavaScript
check.isNull(); // 缺省即 undefined
// => true

check.isNull(null); // null
// => true

check.isNull(''); // 空字符串
// => true
```

## isNumber(value)
**数字校验**

字符串仅接受十进制及科学计数法字面量【如 '0x10'、' 20 '、'020' 均视为非法】  
NaN、Infinity 等非有限数字视为非法【如 Number('Infinity') === Infinity】

```JavaScript
check.isNumber('20'); // 十进制字符串
// => true

check.isNumber('-20'); // 负号
// => true

check.isNumber('+20'); // 正号
// => true

check.isNumber('.2'); // 字符串缺整数位
// => false

check.isNumber(.2); // 数字类型
// => true

check.isNumber(1e+21); // 科学计数法数字 1000000000000000000000
// => true

check.isNumber('1e3'); // 科学计数法字符串 1000
// => true

check.isNumber('0x10'); // 十六进制字面量
// => false

check.isNumber(' 20 '); // 带空白
// => false

check.isNumber(NaN); // NaN 非有限数字
// => false

check.isNumber(Infinity); // Infinity 非有限数字
// => false

check.isNumber('Infinity'); // Infinity 非有限数字
// => false
```

## isDecimalNumber(value)
**十进制数字校验**

仅接受数字与十进制数字字面量字符串，不兼容科学计数法数字【如 '1e+21'、1e+21、[20] 均视为非法】  
超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400)) => Infinity】

```JavaScript
check.isDecimalNumber('20'); // 整数字符串
// => true

check.isDecimalNumber('-20.5'); // 负小数
// => true

check.isDecimalNumber(20.5); // 数字类型
// => true

check.isDecimalNumber('1e3'); // 科学计数法字符串 1000
// => false

check.isDecimalNumber(1e+21); // 科学计数法数字 1000000000000000000000
// => false

check.isDecimalNumber('020'); // 前导零
// => false

check.isDecimalNumber([20]); // 数组非字符串/数字
// => false

check.isDecimalNumber('1' + '0'.repeat(400)); // Infinity
// => false
```

## isInteger(value)
**整数校验**

仅接受数字与十进制整数字面量字符串，不兼容科学计数法数字【如 '1e+21'、1e+21、[20] 均视为非法】  
超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400)) => Infinity】

```JavaScript
check.isInteger('20'); // 整数字符串
// => true

check.isInteger('-20'); // 负整数
// => true

check.isInteger(20); // 数字类型
// => true

check.isInteger('0.2'); // 小数非整数
// => false

check.isInteger('020'); // 前导零
// => false

check.isInteger([20]); // 数组非字符串/数字
// => false

check.isInteger('1' + '0'.repeat(400)); // Infinity
// => false
```

## isDecimal(value)
**小数校验**

仅接受数字与十进制小数字面量字符串，不兼容科学计数法数字【如 '1e-7'、1e-7、[20] 均视为非法】  
超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400) + '.5') => Infinity】

```JavaScript
check.isDecimal('0.2'); // 小数字符串
// => true

check.isDecimal('-0.2'); // 负小数
// => true

check.isDecimal(0.2); // 数字类型
// => true

check.isDecimal('20'); // 无小数位
// => false

check.isDecimal('00.2'); // 前导零
// => false

check.isDecimal([0.2]); // 数组非字符串/数字
// => false

check.isDecimal('1' + '0'.repeat(400) + '.5'); // Infinity
// => false
```

## money(value)
**金额【元】判断**

规则：非负、最多两位小数；  
仅接受数字及十进制字面量【如 '-20'、'002'、[20]、1e-7、NaN 均视为非法】

```JavaScript
check.money('20.00'); // 两位小数
// => true

check.money(20.5); // 数字一位小数
// => true

check.money('-20'); // 负数
// => false

check.money('20.002'); // 三位小数
// => false

check.money('002'); // 前导零
// => false

check.money(1e-7); // 科学计数法数字 0.0000001
// => false

check.money(['20']); // 数组非字符串/数字
// => false
```

## hasChinese(value)
**中文判断**

命中汉字【基本区、扩展 A、扩展 B 起代理对区及各兼容区】或中文专属符号【。，、（）￥㎡ 等】即真。  
中西共用符号不算中文【弯引号、破折号、省略号、全角字母数字等】

```JavaScript
check.hasChinese('中文'); // 常用汉字
// => true

check.hasChinese('。'); // 中文标点
// => true

check.hasChinese('𠮷'); // 扩展 B 生僻字
// => true

check.hasChinese('ＡＢＣ'); // 全角字母数字不算中文
// => false

check.hasChinese('—…“”'); // 弯引号、破折号、省略号等中西共用标点不算
// => false

check.hasChinese('l’étude'); // 西文弯撇号
// => false

check.hasChinese('ｱ'); // 半角片假名不算
// => false

check.hasChinese(['中', '文']); // 数组非字符串
// => false
```

## idCard(value)
**身份证校验**

一代身份证【15 位】：地址码【六位】出生日期码【六位】数字顺序码【三位】  
二代身份证【18 位】：地址码【六位】出生日期码【八位】数字顺序码【三位】数字校验码【一位】

```JavaScript
check.idCard('330000199001017865'); // 常规二代身份证
// => true

check.idCard('33000019900101746x'); // 校验码 X 不区分大小写
// => true

check.idCard('330000900101786'); // 常规一代身份证
// => true

check.idCard('330000199001017866'); // 校验码错误
// => false

check.idCard('330000199002311230'); // 2月31日不存在
// => false
```

## ip(value)
**ip 地址校验（IPv4）**

四段 0-255 以点分隔【拒绝前导零，如 01.1.1.1 不通过】

```JavaScript
check.ip('192.168.0.1'); // 常规 IPv4
// => true

check.ip('01.1.1.1'); // 前导零
// => false

check.ip('127.256.27.1'); // 段超 255
// => false
```

## alipay(value)
**支付宝账号校验**

规则：邮箱或手机号

```JavaScript
check.alipay('test@163.com'); // 邮箱账号
// => true

check.alipay('13456789012'); // 手机号账号
// => true
```

## pwdIntensity(value)
**弱密码校验**

强度分级：1-弱、2-中、3-强

- 位数为 6-32 位，包括 6 位或 32 位
- 不能包含空白字符（空格、制表符、换行等）
- 包含以下任意两种或以上组成元素：
  - ① 数字
  - ② 大写字母
  - ③ 小写字母
  - ④ 符号【ASCII 键盘符号】

```JavaScript
check.pwdIntensity('123456'); // 纯数字，1 种元素
// => 1

check.pwdIntensity('123456abc'); // 数字 + 小写字母，2 种元素
// => 2

check.pwdIntensity('123456abcABC'); // 数字 + 小写 + 大写，3 种元素
// => 3

check.pwdIntensity(' abc123ABC'); // 含空白字符
// => 1
```

## illegalChar(value)
**非法字符校验**

非法字符集【空格（0x20）不在集合内，合法】：

- 双引号（"）、反斜杠（\）、回车（\r）、换行（\n）、制表（\t）、垂直制表（\v）、换页（\f）、空字符（\0）
- 以及其余控制字符（0x00-0x1F 与 0x7F 全集）

```JavaScript
check.illegalChar('123\n123'); // 换行
// => true

check.illegalChar('123\t123'); // 制表符
// => true

check.illegalChar('123\v123'); // 垂直制表符
// => true

check.illegalChar('123\r123'); // 回车
// => true

check.illegalChar('123\\123'); // 反斜杠
// => true

check.illegalChar('123"123'); // 双引号
// => true

check.illegalChar('123'); // 无非法字符
// => false

check.illegalChar('123 123'); // 空格合法
// => false

check.illegalChar(['123"123']); // 数组非字符串（含双引号也不收）
// => false
```

## date(value)
**日期校验**

规则：YYYY-MM-DD 或 YYYY/MM/DD【年 4 位，月日各 2 位且补零，分隔符须前后一致】  
且日历日期须真实存在【闰年 2 月 29 日、大小月 31 日等月日联合规则】

```JavaScript
check.date('2024-02-29'); // 闰年
// => true

check.date('2024/02/29'); // 斜杠分隔
// => true

check.date('2023-02-29'); // 平年无 2 月 29 日
// => false

check.date('2024-04-31'); // 4 月只有 30 天
// => false

check.date('2024-2-29'); // 月不足两位
// => false

check.date('2024-02/29'); // 分隔符前后不一致
// => false

check.date(['2024-02-29']); // 数组非字符串
// => false
```

## commonDate(value)
**常用日期校验**

规则：YYYY-MM-DD 或 YYYY/MM/DD【年 1000-9999，月日各 2 位且补零，分隔符须前后一致】  
且日历日期须真实存在【闰年 2 月 29 日、大小月 31 日等月日联合规则】  
全量 0000-9999 年请用 date【本方法下界 1000，年 1000 前的 ISO 日期不收】

```JavaScript
check.commonDate('2024-02-29'); // 闰年
// => true

check.commonDate('1000-01-01'); // 年下界
// => true

check.commonDate('0999-12-31'); // 年 1000 前，date 放行、commonDate 不收
// => false

check.commonDate('2024-04-31'); // 4 月只有 30 天
// => false

check.commonDate(['2024-02-29']); // 数组非字符串
// => false
```

---

[← 返回 API 索引](../../README.md#api)
