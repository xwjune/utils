<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# convert
**数据转换**

```JavaScript
import { convert } from 'jun-utils';
```

## bytesToSize(bytes, [digit=1], [format='0B'])
**数据容量单位换算**

```JavaScript
convert.bytesToSize(10240);
// => 10.0KB

convert.bytesToSize(1024 * 1024, 2);
// => 1.00MB

convert.bytesToSize('32g');
// => 0B

convert.bytesToSize(1e-7); // Number 科学计数法先展开再转换
// => 0.0000001B

convert.bytesToSize(NaN); // 非有限数字
// => 0B
```

## fenToYuan(value, options)
**分->元**

为防止浮点数运算精度丢失，故采用字符串形式解析

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| value | 分 | number | - |
| options | 配置参数 | Object | - |
| options.format | 空数据格式化 | string | '0.00' |
| options.cutZero | 是否去掉小数末尾多余的零 | boolean | false |
| options.toThousands | 是否使用千位分隔符 | boolean | false |

```JavaScript
convert.fenToYuan(2000);
// => 20.00

convert.fenToYuan(2000, { cutZero: true }); // 去掉小数末尾多余的零
// => 20

convert.fenToYuan(2000.45); // 非正确格式，舍去小数部分
// => 20.00

convert.fenToYuan(1e21); // Number 科学计数法先展开再转换
// => 10000000000000000000.00

convert.fenToYuan('-0'); // 负零归一化为 0.00
// => 0.00

convert.fenToYuan();
// => 0.00

convert.fenToYuan(undefined, { format: '--' }); // 空数据格式化
// => --

convert.fenToYuan(300000, { toThousands: true }); // 数字千位符分隔
// => 3,000

convert.fenToYuan('num'); // 错误数据
// => ''
```

## yuanToFen(value, [format='0'])
**元->分**

为防止浮点数运算精度丢失，故采用字符串形式解析

```JavaScript
convert.yuanToFen(20);
// => 2000

convert.yuanToFen(0.02);
// => 2

convert.yuanToFen(0.002); // 非正确格式
// => 0

convert.yuanToFen(1e-7); // Number 科学计数法先展开再转换
// => 0

convert.yuanToFen('-0.00'); // 负零归一化为 0
// => 0

convert.yuanToFen();
// => 0

convert.yuanToFen(undefined, '--'); // 空数据格式化
// => --

convert.yuanToFen('num'); // 错误数据
// => ''
```

## numberToCn(value)
**阿拉伯数字转中文**

处理数字小于 1000000000000【壹万亿】

多位数读法原则【按照四位分级的原则】：

1. 四位以内的数，按照数位顺序，从高位读起．
2. 四位以上的数，先从右向左四位分级，然后从最高级起，依次读亿级、万级、个级。
   读出各级里的数和它们的级名。每一级的读法和个级的读法相同。亿级里的数，按照个级的数的读法来读，
   再在后面加上一个“亿”字；万级里的数，按照个级的数的读法来读，再在后面加上一个“万”字；
3. 每级末尾不管有几个“0”，都不读；其他数位上有一个“0”或几个“0”，都只读一个零。

```JavaScript
convert.numberToCn(0.01);
// => 零点零壹

convert.numberToCn(100);
// => 壹佰

convert.numberToCn(1008); // 中间的零只读一个
// => 壹仟零捌

convert.numberToCn(10008000); // 万级末尾的零不读
// => 壹仟万捌仟

convert.numberToCn(100000800); // 万级全为零，级名不读
// => 壹亿零捌佰

convert.numberToCn(100008000); // 个级开头的零要读
// => 壹亿零捌仟

convert.numberToCn('12x');
// => 数据错误

convert.numberToCn(1000000000000); // 达到壹万亿
// => 超大数字
```

## currencyToCn(value, [format='零元整'])
**数字金额转换为中文人民币大写**

最大处理数字：999999999999.99

中文大写金额数字到“元”为止的，在“元”之后、应写“整”(或“正”)字；  
在“角”之后，可以不写“整”(或“正”)字；  
大写金额数字有“分”的，“分”后面不写“整”(或“正”)字。  
阿拉伯数字小写金额数字中有“0”时，中文大写应按照汉语语言规律、金额数字构成和防止涂改的要求进行书写。举例如下：

- 阿拉伯数字中间有“0”时，中文大写要写“零”字，如￥1409.50应写成人民币壹仟肆佰零玖元伍角。
- 阿拉伯数字中间连续有几个“0”时，中文大写金额中间可以只写一个“零”字，如￥6007.14应写成人民币陆仟零柒元壹角肆分。
- 阿拉伯金额数字万位和元位是“0”，或者数字中间连续有几个“0”，万位、元位也是“0”但千位、角位不是“0”时，中文大写金额中可以只写一个零字，
  也可以不写“零”字。如￥1680.32应写成人民币壹仟陆佰捌拾元零叁角贰分，或者写成人民币壹仟陆佰捌拾元叁角贰分。
  又如￥107000.53应写成人民币壹拾万柒仟元零伍角叁分，或者写成人民币壹拾万零柒仟元伍角叁分。
- 阿拉伯金额数字角位是“0”而分位不是“0”时，中文大写金额“元”后面应写“零”字。如￥16409.02应写成人民币壹万陆仟肆佰零玖元零贰分。

```JavaScript
convert.currencyToCn(0);
// => 零元整

convert.currencyToCn();
// => 零元整

convert.currencyToCn('', '--');
// => --

convert.currencyToCn('1x');
// => 数据错误

convert.currencyToCn(100000000);
// => 壹亿元整

convert.currencyToCn(100000001);
// => 壹亿零壹元整

convert.currencyToCn(999999999999.99);
// => 玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分

convert.currencyToCn(1.01);
// => 壹元零壹分

convert.currencyToCn(1.10);
// => 壹元壹角

convert.currencyToCn(1000000000000); // 超出上限
// => 超大金额
```

## combination(arr)
**列出 N 个数组所有组合**

```JavaScript
const arr = [
  ['黑色', '白色'],
  ['64G', '128G'],
  ['国行', '港行'],
  ['全网通'],
];
convert.combination(arr);
// 输出结果
[
  ['黑色', '64G', '国行', '全网通'],
  ['黑色', '64G', '港行', '全网通'],
  ['黑色', '128G', '国行', '全网通'],
  ['黑色', '128G', '港行', '全网通'],
  ['白色', '64G', '国行', '全网通'],
  ['白色', '64G', '港行', '全网通'],
  ['白色', '128G', '国行', '全网通'],
  ['白色', '128G', '港行', '全网通'],
]
```

## toThousands(value)
**数字千位符分隔**

```JavaScript
convert.toThousands('12345678');
// => 12,345,678

convert.toThousands('12345678.90');
// => 12,345,678.90

convert.toThousands(1e+21); // 科学计数法先展开
// => 1,000,000,000,000,000,000,000

convert.toThousands('+2000'); // 前导 + 号规范化
// => 2,000

convert.toThousands('0.5e5'); // 前导零规范化
// => 50,000

convert.toThousands(); // 非法输入返回空串
// => ''
```

## expandNumber(num)
**数字转十进制字符串，展开科学计数法**

```JavaScript
convert.expandNumber(1.5e-7);
// => 0.00000015

convert.expandNumber(-1.5e-7);
// => -0.00000015

convert.expandNumber(1.5e21);
// => 1500000000000000000000

convert.expandNumber(-1.5e21);
// => -1500000000000000000000

convert.expandNumber(1.5); // 非科学计数法原样返回
// => 1.5

convert.expandNumber('12.34e1'); // 字符串科学计数法同样支持
// => 123.4

convert.expandNumber('0.123e2'); // 前导零规范化
// => 12.3
```

## toFixed(value, options)
**格式化数字**

四舍五入保留 N 位小数

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| value | 数字 | number \| string | - |
| options | 配置参数 | Object | - |
| options.digit | 保留小数位数 | number | 2 |
| options.cutZero | 是否去掉小数末尾多余的零 | boolean | false |
| options.toThousands | 是否使用千位分隔符 | boolean | false |
| options.format | 数据错误时返回的占位符 | string | '' |

```JavaScript
convert.toFixed(3.14159);
// => 3.14

convert.toFixed(3.14159, { digit: 3 });
// => 3.142

convert.toFixed(3);
// => 3.00

convert.toFixed('3.10', { cutZero: true }); // 去掉小数末尾多余的零
// => 3.1

convert.toFixed(3, { cutZero: true }); // 小数全为零时连小数点一并去掉
// => 3

convert.toFixed(1234567.89, { toThousands: true }); // 数字千位符分隔
// => 1,234,567.89

convert.toFixed(1.005); // 基于字面量四舍五入【(1.005).toFixed(2) => '1.00'】
// => 1.01

convert.toFixed(9.999); // 连锁进位
// => 10.00

convert.toFixed(-1.005); // 负数按绝对值四舍五入
// => -1.01

convert.toFixed(1e-7); // 科学计数法先展开再转换
// => 0.00

convert.toFixed('-0.004'); // 负数按绝对值四舍五入，负零归一化为 0.00
// => 0.00

convert.toFixed('num'); // 错误数据
// => ''

convert.toFixed('num', { format: '--' }); // 错误数据返回占位符
// => '--'
```

---

[← 返回 API 索引](../../README.md#api)
