# floatUtil
**浮点数运算【解决精度问题】**

仅接受十进制字面量（`1e-7`、`1e+21` 等以科学计数法表示的数字除外）；运算中间值超出 `Number.MAX_SAFE_INTEGER`、除法除数为 `0` 或输入非法时，返回 `format` 兜底值

```JavaScript
import { floatUtil } from 'jun-utils';
```

## add(arg1, arg2, [format=''])
加法

```JavaScript
floatUtil.add(0.1, 0.2); // 0.3

floatUtil.add(2.22, 0.1); // 2.32

floatUtil.add(2.22, 'xx', '--'); // --

floatUtil.add(999999999999999, 0.1, '--'); // --【放大后的整数超出安全整数范围】
```

## subtract(arg1, arg2, [format=''])
减法

```JavaScript
floatUtil.subtract(1.5, 1.2); // 0.3

floatUtil.subtract(0.3, 0.2); // 0.1
```

## multiply(arg1, arg2, [format=''])
乘法

```JavaScript
floatUtil.multiply(19.9, 100); // 1990

floatUtil.multiply(0.7, 180); // 126
```

## divide(arg1, arg2, [format=''])
除法

```JavaScript
floatUtil.divide(0.3, 0.1); // 3

floatUtil.divide(0.69, 10); // 0.069
```

---

[← 返回 API 索引](../../README.md#api)
