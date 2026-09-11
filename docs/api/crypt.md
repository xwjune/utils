# crypt
**加密解密【用于暴露在url中的重要参数】**

非标准 base64【索引表已重排，标准 base64 工具解不出，避免 url 参数被轻易识别解码】，仅本库 encode/decode 可互解；round-trip 无损

```JavaScript
import { crypt } from 'jun-utils';
```

## encode(value)
加密，非字符串抛 TypeError

```JavaScript
crypt.encode('123456'); // CJ8pD3Ks
```

## decode(value)
解密，非字符串抛 TypeError；残缺或填充符错位的密文抛 Error【非法字符自动剔除】

```JavaScript
crypt.decode('CJ8pD3Ks'); // 123456

crypt.decode(' CJ8+pD3Ks'); // 123456（非法字符自动剔除）

crypt.decode('CJ8pD3K'); // 抛 Error（密文残缺）
```

---

[← 返回 API 索引](../../README.md#api)
