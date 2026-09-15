<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# cookie
**cookie 操作**

```JavaScript
import { cookie } from 'jun-utils';
```

## getCookie(name)
**读取 cookie**

返回解码后的值；值不是编码产物时原样返回；未命中返回 null。  
同名 cookie 写在多个 path/domain 下时，前端无法枚举区分；  
规范（RFC 6265 §5.4）建议浏览器按 path 长度降序返回（长的优先），但属 SHOULD 级建议，不可依赖。  
此时本函数返回 document.cookie 序列里的第一个命中，不保证是哪个 path/domain 的。

```JavaScript
// 判存在请用 != null 而非真值判断：空值 cookie 命中返回 ''（falsy），真值判断会把「存在但为空」误判成「不存在」
cookie.setCookie('flag', '');
cookie.getCookie('flag');           // => ''（存在，但值为空）
cookie.getCookie('flag') != null;   // => true
Boolean(cookie.getCookie('flag'));  // => false（误判为不存在）

cookie.getCookie('absent');
// => null
```

## setCookie(name, value, [options={}])
**创建 cookie**

name 用 __Host-/__Secure- 前缀时需自行满足浏览器的附加要求（__Host- 需 Secure + Path=/ + 无 Domain；__Secure- 需 Secure），不满足时浏览器会拒绝写入，本库不额外校验

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| name | cookie 名称 | String | - |
| value | cookie 值（仅接受基本类型，对象请先 JSON.stringify） | String \| Number \| Boolean | - |
| options | 配置 | Object | {} |
| options.domain | 域名 | String | - |
| options.path | 路径，默认根路径；显式传入时必须以 / 开头，否则整单拒绝 | String | '/' |
| options.maxAge | 相对过期时间【单位是秒，0 表示立即失效；与 expires 同时传时以 maxAge 为准，建议二选一】 | Number | - |
| options.expires | 绝对失效时间 | Date | - |
| options.secure | 安全标志 | Boolean | - |
| options.sameSite | 跨域安全机制，仅接受 Strict/Lax/None（大小写不敏感） | String | - |

```JavaScript
// 一天后过期
cookie.setCookie('name', 'value', {
  maxAge: 60 * 60 * 24,
});

// 指定域名与路径
cookie.setCookie('name', 'value', { domain: '.example.com', path: '/app' });

// 会话 cookie + 跨域策略
cookie.setCookie('name', 'value', { sameSite: 'Lax' });
```

## delCookie(name, [options={}])
**删除 cookie**

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| name | cookie 名称 | String | - |
| options | 配置，path/domain 需与写入时一致才能删掉 | Object | {} |
| options.domain | 域名 | String | - |
| options.path | 路径（以 / 开头），需与写入时一致才能删掉；不传时删根路径与当前页面目录两处 | String | - |

```JavaScript
cookie.delCookie('name');

cookie.delCookie('name', { domain: '.example.com', path: '/app' });
```

---

[← 返回 API 索引](../../README.md#api)
