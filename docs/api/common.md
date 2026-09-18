<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# common
**通用方法**

```JavaScript
import { common } from 'jun-utils';
```

## generateUUID()
**生成 uuid**

```JavaScript
common.generateUUID();
// => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
```

## getParameter(name, [url=window.location.search])
**获取 url 中的参数**

```JavaScript
common.getParameter('name', 'http://www.w3school.com?name=xxx');
// => xxx

common.getParameter('name', 'http://www.w3school.com?name=');
// => ''

common.getParameter('name', 'http://www.w3school.com');
// => null
```

## loadScript(url, [callback])
**动态加载 js**

```JavaScript
common.loadScript('https://xxx.js', () => {
 console.log('loaded');
});
```

---

[← 返回 API 索引](../../README.md#api)
