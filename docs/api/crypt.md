<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# crypt
**加密解密【用于暴露在 url 中的重要参数】**

基于 base64 变体：索引表已做特殊处理，非标准 base64【仅本模块 encode/decode 可互解，勿跨系统使用】  
特殊处理的用意：字符顺序相对标准表整体重排、+/ 替换为 url 安全的 -_，标准 atob/base64 解本模块密文只会得到乱码，避免 url 中的重要参数被轻易识别、解码【字符表混淆而非加密：索引表明文在源码中，防的是随手解码，不防有心人】  
代理对（emoji 等）按 CESU-8 式拆分编码，自编自解 round-trip 无损

```JavaScript
import { crypt } from 'jun-utils';
```

## encode(value)
**加密**

非字符串不做隐式转换，直接抛 TypeError

```JavaScript
crypt.encode('123456');
// => CJ8pD3Ks

crypt.encode(null); // 非字符串抛 TypeError
// => throw Error（encode 只接受字符串）
```

## decode(value)
**解密**

非字符串不做隐式转换，直接抛 TypeError。  
非法字符（空白等）会被剔除，但剔除后须为合法密文，否则抛 Error【残缺密文静默解出乱码更危险】

```JavaScript
crypt.decode('CJ8pD3Ks');
// => 123456

crypt.decode(' CJ8+pD3Ks'); // 非法字符（空白、+）自动剔除
// => 123456

crypt.decode(123); // 非字符串抛 TypeError
// => throw Error（decode 只接受字符串）

crypt.decode('CJ8pD3K'); // 密文残缺
// => throw Error（decode 收到非法密文）
```

---

[← 返回 API 索引](../../README.md#api)
