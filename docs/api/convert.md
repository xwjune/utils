# convert
**数据转换**

```JavaScript
import { convert } from 'jun-utils';
```

## bytesToSize(value, [digit=1], [format='0B'])
数据容量单位换算

```JavaScript
convert.bytesToSize(10240); // 10.0KB

convert.bytesToSize(1024 * 1024, 2); // 1.00MB

convert.bytesToSize('32g'); // 0B

convert.bytesToSize(1e-7); // 0.0000001B（Number 科学计数法先展开再转换）

convert.bytesToSize(NaN); // 0B（非有限数字）
```

## fenToYuan(value, options)
分转化成元

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| value | 分 | string \| number | - |
| options | 配置参数 | object | {} |
| options.format | 空数据格式化 | string  | '0.00' |
| options.cutZero | 是否去掉小数末尾多余的零 | boolean  | false |
| options.toThousands | 是否使用千位分隔符 | boolean | false |

```JavaScript
convert.fenToYuan(2000); // 20.00

convert.fenToYuan(2000.45); // 20.00 非正确格式，舍去小数部分

convert.fenToYuan(); // 0.00

convert.fenToYuan(undefined, { format: '--' }); // -- 空数据格式化

convert.fenToYuan(2000, { cutZero: true }); // 20 去掉小数末尾多余的零

convert.fenToYuan(300000, { toThousands: true }); // 3,000 数字千位符分隔

convert.fenToYuan('num'); // '' 错误数据
```

## yuanToFen(value, [format='0'])
元转化成分

```JavaScript
convert.yuanToFen(20); // 2000

convert.yuanToFen(0.02); // 2

convert.yuanToFen(0.002); // 0 非正确格式

convert.yuanToFen(); // 0

convert.yuanToFen(undefined, '--'); // -- 空数据格式化

convert.yuanToFen('num'); // '' 错误数据
```

## numberToCn(value)
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

## currencyToCn(value, [format='零元整'])
数字金额转换为中文人民币大写

最大处理数字 `999999999999.99`

```JavaScript
convert.currencyToCn(0); // 零元整

convert.currencyToCn(); // 零元整

convert.currencyToCn(undefined, '--'); // -- 空数据格式化

convert.currencyToCn(100000000); // 壹亿元整

convert.currencyToCn(100000001); // 壹亿零壹元整

convert.currencyToCn(999999999999.99); // 玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分

convert.currencyToCn(1.01); // 壹元零壹分

convert.currencyToCn(1.10); // 壹元壹角

convert.currencyToCn('1x'); // 数据错误

convert.currencyToCn(1000000000000); // 超大金额
```

## combination(arr)
列出n个数组所有组合

```JavaScript
const arr =  [
  ['黑色', '白色'],
  ['64G', '128G'],
  ['国行', '港行'],
  ['全网通'],
];
convert.combination(arr);
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

## toThousands(value)
数字千位符分隔

```JavaScript
convert.toThousands(12345678); // 12,345,678

convert.toThousands(12345678.90); // 12,345,678.90

convert.toThousands(1e+21); // 1,000,000,000,000,000,000,000（科学计数法先展开）

convert.toThousands('+2000'); // 2,000（前导 + 号规范化）

convert.toThousands('0.5e5'); // 50,000（前导零规范化）

convert.toThousands(); // ''
```

## expandNumber(value)
数字转十进制字符串，展开科学计数法

```JavaScript
convert.expandNumber(1.5e-7); // '0.00000015'

convert.expandNumber(-1.5e-7); // '-0.00000015'

convert.expandNumber(1.5e21); // '1500000000000000000000'

convert.expandNumber(1.5); // '1.5' 非科学计数法原样返回

convert.expandNumber('12.34e1'); // '123.4' 字符串科学计数法同样支持

convert.expandNumber('0.123e2'); // '12.3' 前导零规范化
```

## toFixed(value, [options])
格式化数字，四舍五入保留 N 位小数

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| value | 数字 | string \| number | - |
| options | 配置参数 | object | {} |
| options.digit | 保留小数位数 | number | 2 |
| options.cutZero | 是否去掉小数末尾多余的零 | boolean  | false |
| options.toThousands | 是否使用千位分隔符 | boolean | false |
| options.format | 数据错误时返回的占位符 | string | '' |

```JavaScript
convert.toFixed(3.14159); // '3.14'

convert.toFixed(3.14159, { digit: 3 }); // '3.142'

convert.toFixed(3); // '3.00' 不足位数补零

convert.toFixed('3.10', { cutZero: true }); // '3.1' 去掉小数末尾多余的零

convert.toFixed(3, { cutZero: true }); // '3' 小数全为零时连小数点一并去掉

convert.toFixed(1234567.89, { toThousands: true }); // '1,234,567.89' 数字千位符分隔

convert.toFixed(1.005); // '1.01' 基于字面量四舍五入

convert.toFixed(9.999); // '10.00' 连锁进位

convert.toFixed(-1.005); // '-1.01' 负数按绝对值四舍五入

convert.toFixed('-0.004'); // '0.00' 负零归一化

convert.toFixed('num'); // '' 错误数据

convert.toFixed('num', { format: '--' }); // '--' 错误数据返回占位符
```

---

[← 返回 API 索引](../../README.md#api)
