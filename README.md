# jun-utils

前端通用工具函数库：校验、数据转换、浮点数运算、树结构操作等 9 个模块，提供 ES module 与 UMD 两种产物。

## Installation

Install with npm:

```bash
npm install --save-dev jun-utils
```

Install with yarn:

```bash
yarn add jun-utils --dev
```

## 浏览器支持

面向现代浏览器（Chrome 69+ / Safari 12+ / Firefox 62+ / Edge 79+，2018-09 起的全量版本），不支持 IE。

- `dist`【UMD】：`Number.isFinite` 等内建已由构建链内置 core-js@2 兜底
- `lib`【ESM】：不做 polyfill，需运行环境或消费方 polyfill 方案支持 ES2019 内建【如 `Array.prototype.flatMap`】

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

| 模块 | 说明 |
| :--- | :--- |
| [check](docs/api/check.md) | 校验库：手机/固话/邮箱/身份证/金额/日期/IP 等 18 个校验 |
| [stringUtil](docs/api/stringUtil.md) | 字符串处理 |
| [floatUtil](docs/api/floatUtil.md) | 浮点数运算【解决精度问题】 |
| [treeUtil](docs/api/treeUtil.md) | 树结构数据操作：平铺转树、提取、查找 |
| [appUtil](docs/api/appUtil.md) | app 交互：环境判断、支付宝容器 API |
| [convert](docs/api/convert.md) | 数据转换：金额/容量/千位符/中文大写等 9 个函数 |
| [common](docs/api/common.md) | 通用方法：cookie、事件、窗口尺寸等 18 个函数 |
| [crypt](docs/api/crypt.md) | 加密解密【用于暴露在url中的重要参数】 |
| [ws](docs/api/ws.md) | webSocket【断线重连】 |

> 各函数的参数、返回值与示例见对应模块文档；安装后在 IDE 中悬停函数名可查看同样内容的 JSDoc。改函数行为时以 `src/` 内 JSDoc 为契约来源，文档同步更新。
