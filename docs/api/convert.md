<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# convert
**数据转换**

```JavaScript
import { convert } from 'jun-utils';
```

## bytesToSize(bytes, options)
**数据容量单位换算**

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| bytes | 数据容量 | number \| string | - |
| options | 配置参数 | Object | - |
| options.fractionDigits | 保留小数位数 | number | 1 |
| options.format | 空数据格式化，缺省按保留位数渲染零值 | string | - |

```JavaScript
convert.bytesToSize(10240);
// => 10.0KB

convert.bytesToSize(1024 * 1024, { fractionDigits: 2 });
// => 1.00MB

convert.bytesToSize(1024 * 1023); // 未达 1MB 仍用 KB 计
// => 1023.0KB

convert.bytesToSize(''); // 空数据缺省占位，按保留位数渲染零值
// => 0.0B

convert.bytesToSize('', { fractionDigits: 2 }); // 占位随保留位数
// => 0.00B

convert.bytesToSize(null, { format: '--' }); // 空数据显式占位
// => --

convert.bytesToSize('32g');
// => 数据错误

convert.bytesToSize(-10); // 负数是错误数据
// => 数据错误

convert.bytesToSize(0); // 0 是有效容量，不取占位
// => 0.0B

convert.bytesToSize(0.5); // 小数是错误数据【容量按字节计数必为整数】
// => 数据错误

convert.bytesToSize(NaN); // 非有限数字
// => 数据错误
```

## fenToYuan(value, options)
**分->元**

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| value | 分 | number \| string | - |
| options | 配置参数 | Object | - |
| options.format | 空数据格式化，缺省按其余配置渲染零值 | string | - |
| options.trimZeros | 是否去掉小数末尾多余的零 | boolean | false |
| options.toThousands | 是否使用千位分隔符 | boolean | false |

```JavaScript
convert.fenToYuan(2000);
// => 20.00

convert.fenToYuan(2000, { trimZeros: true }); // 去掉小数末尾多余的零
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

convert.fenToYuan(undefined, { trimZeros: true }); // 缺省占位随 trimZeros 去零
// => 0

convert.fenToYuan(300000, { toThousands: true }); // 数字千位符分隔
// => 3,000

convert.fenToYuan('num'); // 错误数据
// => ''

convert.fenToYuan([2000]); // 隐式转换字符串的类数组不纳入
// => ''
```

## yuanToFen(value, [format='0'])
**元->分**

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

convert.yuanToFen([20]); // 隐式转换字符串的类数组不纳入
// => ''
```

## numberToCn(value, [format='零'])
**阿拉伯数字转中文**

处理数字小于 1000000000000【壹万亿】；小数「点」后逐位读，末尾 0 原样保留。读法规则：

- 分级：按个/万/亿数级分段，每级按个级读法读出后缀级名
- 读「零」：数位中间的 0 读一个「零」（连续 0 合并）
- 省「零」：数级末尾的 0 不读；万级全为 0 时连级名「万」一并省略

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

convert.numberToCn([1008]); // 隐式转换字符串的类数组不纳入
// => 数据错误

convert.numberToCn(1000000000000); // 达到壹万亿
// => 超大数字

convert.numberToCn(); // 空数据按零展示
// => 零

convert.numberToCn(undefined, '--'); // 空数据格式化
// => --
```

## currencyToCn(value, [format='零元整'])
**数字金额转换为中文人民币大写**

最大处理数字 999999999999.99；分位以下小数直接截断。书写规则：

- 补「整」：无角无分时以「整」收尾，有角或有分不缀
- 读「零」：数位中间的 0 读一个「零」（连续 0 合并）；角位为 0 而分位非 0 时补「零」衔接元与分（不足一元时该「零」即为开头）
- 省「零」：数级（个/万/亿）末尾的 0 不读；万级全为 0 时连级名「万」一并省略

```JavaScript
convert.currencyToCn(0);
// => 零元整

convert.currencyToCn();
// => 零元整

convert.currencyToCn('', '--');
// => --

convert.currencyToCn('1x');
// => 数据错误

convert.currencyToCn([1.1]); // 隐式转换字符串的类数组不纳入
// => 数据错误

convert.currencyToCn(1.00);
// => 壹元整

convert.currencyToCn(1.01);
// => 壹元零壹分

convert.currencyToCn(1.10);
// => 壹元壹角

convert.currencyToCn(1.11);
// => 壹元壹角壹分

convert.currencyToCn(100000000);
// => 壹亿元整

convert.currencyToCn(100000001);
// => 壹亿零壹元整

convert.currencyToCn(999999999999.99);
// => 玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分

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

convert.combination('x12'); // 非数组直接抛 TypeError
```

## toThousands(value, [format=''])
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

convert.toThousands(); // 空数据返回空串
// => ''

convert.toThousands(undefined, '--'); // 空数据格式化
// => --

convert.toThousands('x12'); // 错误数据返回空串
// => ''
```

## expandNumber(value)
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

convert.expandNumber(Symbol('x')); // 非数字/字符串直接抛 TypeError
```

## toFixed(value, options)
**格式化数字**

四舍五入保留 N 位小数

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| value | 数字 | number \| string | - |
| options | 配置参数 | Object | - |
| options.fractionDigits | 保留小数位数 | number | 2 |
| options.trimZeros | 是否去掉小数末尾多余的零 | boolean | false |
| options.toThousands | 是否使用千位分隔符 | boolean | false |
| options.format | 空数据格式化 | string | '' |

```JavaScript
convert.toFixed(3.14159);
// => 3.14

convert.toFixed(3.14159, { fractionDigits: 3 });
// => 3.142

convert.toFixed(3);
// => 3.00

convert.toFixed('3.10', { trimZeros: true }); // 去掉小数末尾多余的零
// => 3.1

convert.toFixed(3, { trimZeros: true }); // 小数全为零时连小数点一并去掉
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

convert.toFixed(undefined, { format: '--' }); // 空数据格式化
// => '--'
```

---

[← 返回 API 索引](../../README.md#api)
