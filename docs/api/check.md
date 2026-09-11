# check
**校验库**

```JavaScript
import { check } from 'jun-utils';
```

## cellphone(value)
手机校验 `11位数字，首位1`，非字符串判非法

```JavaScript
check.cellphone('13456789012'); // true

check.cellphone(13456789012); // false（非字符串不做隐式转换）

check.cellphone(['13456789012']); // false（非字符串不做隐式转换）
```

## telphone(value)
固定电话校验 `3-4位区号，7-8位直拨号码`，非字符串判非法

```JavaScript
check.telphone('0571-85735888'); // true

check.telphone('057185735888'); // true

check.telphone('85735888'); // true

check.telphone(['0571-85735888']); // false（非字符串不做隐式转换）
```

## phone(value)
电话【手机和固定电话】校验，非字符串判非法

```JavaScript
check.phone('057185735888'); // true

check.phone('13456789012'); // true

check.phone([13456789012]); // false（非字符串不做隐式转换）
```

## email(value)
邮箱校验 `登录名@主机名.域名`，非字符串判非法。登录名的点仅作分段符（不可在首尾或连续）；域名标签不可连字符开头/结尾；顶级域至少 2 位字母（放行 `.technology` 等新顶级域）

```JavaScript
check.email('test@163.com'); // true

check.email('te_st@sima.vip.com'); // true

check.email('test+tag@163.com'); // true（+ 别名合法）

check.email('test@163..com'); // false（域名连续点）

check.email('test@163-.com'); // false（域名标签连字符收尾）

check.email(['test@163.com']); // false（非字符串不做隐式转换）
```

## postcode(value)
邮编校验 `6位数字`，前导零合法，非字符串判非法

```JavaScript
check.postcode('310000'); // true

check.postcode('010000'); // true（前导零合法，内蒙 010000、河北 050000）

check.postcode('3100000'); // false

check.postcode(['310000']); // false（非字符串不做隐式转换）
```

## isNull(value)
空数据校验 `undefined, null, ''`

```JavaScript
check.isNull(); // true

check.isNull(null); // true

check.isNull(''); // true
```

## isNumber(value)
数字校验 `兼容科学计数法`

```JavaScript
check.isNumber('20'); // true

check.isNumber('-20'); // true

check.isNumber('.2'); // false

check.isNumber(' 20 '); // false（仅接受十进制及科学计数法字面量）

check.isNumber(.2); // true

check.isNumber(1e+21); // true

check.isNumber(NaN); // false（非有限数字）

check.isNumber('Infinity'); // false
```

## isDecimalNumber(value)
十进制数字校验 `仅接受数字及十进制字面量，不兼容科学计数法`

```JavaScript
check.isDecimalNumber('20'); // true

check.isDecimalNumber('-20.5'); // true

check.isDecimalNumber(20.5); // true

check.isDecimalNumber('1e3'); // false（科学计数法视为非法）

check.isDecimalNumber(1e+21); // false（String(1e+21) => '1e+21'）

check.isDecimalNumber('020'); // false

check.isDecimalNumber([20]); // false（其余类型不做隐式转换）

check.isDecimalNumber('1' + '0'.repeat(400)); // false（超出双精度表示范围）
```

## isInteger(value)
整数校验 `不兼容科学计数法数字`

```JavaScript
check.isInteger('20'); // true

check.isInteger('-20'); // true

check.isInteger(20); // true

check.isInteger('0.2'); // false

check.isInteger('020'); // false

check.isInteger([20]); // false（其余类型不做隐式转换）

check.isInteger('1' + '0'.repeat(400)); // false（超出双精度表示范围）
```

## isDecimal(value)
小数校验 `不兼容科学计数法数字`

```JavaScript
check.isDecimal('0.2'); // true

check.isDecimal('-0.2'); // true

check.isDecimal(0.2); // true

check.isDecimal('20'); // false

check.isDecimal('00.2'); // false

check.isDecimal([0.2]); // false（其余类型不做隐式转换）

check.isDecimal('1' + '0'.repeat(400) + '.5'); // false（超出双精度表示范围）
```

## money(value)
金额【元】判断，非负、最多两位小数，仅接受数字及十进制字面量

```JavaScript
check.money('20.00'); // true

check.money(20.5); // true

check.money('-20'); // false

check.money('20.002'); // false

check.money('002'); // false

check.money(1e-7); // false（String(1e-7) => '1e-7'，科学计数法视为非法）

check.money(['20']); // false（非字符串/数字不做隐式转换）
```

## hasChinese(value)
中文判断：命中汉字【基本区、扩展 A、扩展 B 起及各兼容区】或中文专属符号【。，、（）￥㎡ 等】；中西共用符号不算中文，非字符串判 false

```JavaScript
check.hasChinese('中文'); // true

check.hasChinese('。'); // true（中文标点）

check.hasChinese('𠮷'); // true（扩展 B 生僻字）

check.hasChinese('ＡＢＣ'); // false（全角字母数字不算中文）

check.hasChinese('—…“”'); // false（弯引号、破折号、省略号等中西共用标点不算）

check.hasChinese('l’étude'); // false（西文弯撇号）

check.hasChinese('ｱ'); // false（半角片假名）

check.hasChinese(['中', '文']); // false（非字符串不做隐式转换）
```

## idCard(value)
身份证校验：`一代身份证【15位】或二代身份证【18位】`，二代校验码参与验算，日期须真实存在，非字符串判非法

```JavaScript
check.idCard('330000199001017865'); // true

check.idCard('33000019900101746x'); // true（校验码 X 不区分大小写）

check.idCard('330000900101786'); // true

check.idCard('330000199001017866'); // false（校验码错误）

check.idCard('330000199002311230'); // false（2月31日不存在）
```

## ip(value)
ip地址校验：IPv4 `四段 0-255`，拒绝前导零，非字符串判非法

```JavaScript
check.ip('192.168.0.1'); // true

check.ip('01.1.1.1'); // false（拒绝前导零）
```

## alipay(value)
支付宝账号校验 `邮箱或手机号`

```JavaScript
check.alipay('test@163.com'); // true

check.alipay('13456789012'); // true
```

## pwdIntensity(value)
弱密码校验 `1-弱|2-中|3-强`，非字符串输入直接判弱

规则：

1. 位数为6-32位，包括6位或32位
2. 不能包含空白字符（空格、制表符、换行等）
3. 包含以下任意两种或以上组成元素：
	- 数字
	- 大写字母
	- 小写字母
	- 符号【键盘上可以打出来的符号】

```JavaScript
check.pwdIntensity('123456'); // 1

check.pwdIntensity('123456abc'); // 2

check.pwdIntensity('123456abcABC'); // 3

check.pwdIntensity(' abc123ABC'); // 1，含空格
```

## illegalChar(value)
非法字符校验：双引号（`"`）、反斜杠（`\`）、回车（`\r`）、换行（`\n`）、制表（`\t`）、垂直制表（`\v`）、换页（`\f`）、空字符（`\0`）以及其余控制字符（0x00-0x1F 与 0x7F）；空格合法。非字符串一律返回 `false`（视为未检出）

```JavaScript
check.illegalChar('123\n123'); // true
check.illegalChar('123\t123'); // true
check.illegalChar('123\v123'); // true
check.illegalChar('123\r123'); // true
check.illegalChar('123\\123'); // true
check.illegalChar('123"123'); // true
check.illegalChar('123'); // false
check.illegalChar('123 123'); // false（空格合法）
check.illegalChar(['123"123']); // false（非字符串不做隐式转换）
```

## date(value)
日期校验：`YYYY-MM-DD 或 YYYY/MM/DD`，年 4 位、月日各 2 位补零、分隔符前后一致，日历日期须真实存在【闰年 2 月 29 日、大小月 31 日】，非字符串判非法

```JavaScript
check.date('2024-02-29'); // true（闰年）

check.date('2024/02/29'); // true（斜杠分隔）

check.date('2023-02-29'); // false（平年无 2 月 29 日）

check.date('2024-04-31'); // false（4 月只有 30 天）

check.date('2024-2-29'); // false（月不足两位）

check.date('2024-02/29'); // false（分隔符前后不一致）

check.date(['2024-02-29']); // false（非字符串不做隐式转换）
```

## commonDate(value)
常用日期校验：规则同 `date`，但年限定 `1000-9999`【年 1000 前的 ISO 日期不收】，其余一致（`YYYY-MM-DD 或 YYYY/MM/DD`、月日各 2 位补零、分隔符前后一致、日历日期须真实存在）

```JavaScript
check.commonDate('2024-02-29'); // true（闰年）

check.commonDate('1000-01-01'); // true（年下界）

check.commonDate('0999-12-31'); // false（年 1000 前，date 放行、commonDate 不收）

check.commonDate('2024-04-31'); // false（4 月只有 30 天）

check.commonDate(['2024-02-29']); // false（非字符串不做隐式转换）
```

---

[← 返回 API 索引](../../README.md#api)
