<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# common
**通用方法**

```JavaScript
import { common } from 'jun-utils';
```

## generateUUID()
**生成 uuid（RFC 9562 v4 格式）**

按环境随机源能力分层：crypto.randomUUID（现代浏览器安全上下文如 https/localhost、Node 19+）直接委托，密码学安全；  
无 randomUUID 时用 crypto.getRandomValues（同为密码学安全，且不限安全上下文，如纯 http 页面）；  
两者都没有才退回 Math.random——非密码学安全，仅可用作去重 key、trace id 等，不能当 token 或密钥

```JavaScript
common.generateUUID();
// => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
```

## getParameter(name, [url=window.location.search])
**获取 url 中的参数**

在完整链接里取第一个命中的参数（同名取先出现的），hash 段里的 query 同样能取到。  
参数名区分大小写、按字面匹配不解码（?arr%5B%5D=1 需传编码名查询）；无等号的裸参数视为不存在。  
值按 decodeURIComponent 解码：'+' 不转空格；非法 % 序列原样返回、不抛错。  
非浏览器环境（SSR）无 window，不传 url 时抛 ReferenceError，须显式传入。

```JavaScript
// 基础取值
common.getParameter('name', 'http://www.w3school.com?name=xxx');
// => xxx

// 不传 url 则读当前页面地址（SSR 无 window 会抛 ReferenceError，须显式传入）
common.getParameter('name');

// 同名参数取先出现的
common.getParameter('name', 'http://www.w3school.com?name=a&name=b');
// => a

// 参数名区分大小写，'?Name' 与 'name' 是不同参数
common.getParameter('name', 'http://www.w3school.com?Name=xxx');
// => null

// hash 段里的 query 同样能取到（SPA 路由）
common.getParameter('name', 'http://www.w3school.com?age=12#/main?name=xxx');
// => xxx

// 参数名不解码，编码名需传编码形式
common.getParameter('arr%5B%5D', 'http://www.w3school.com?arr%5B%5D=1');
// => 1

// 参数存在但值为空返回 ''（判存在用 != null，'' 是 falsy，真值判断会误判成不存在）
common.getParameter('name', 'http://www.w3school.com?name=');
// => ''

// 链接里没有该参数返回 null
common.getParameter('name', 'http://www.w3school.com');
// => null

// 无等号的裸参数（?flag）同样视为不存在
common.getParameter('flag', 'http://www.w3school.com?flag');
// => null

// 值里的合法编码会被解码
common.getParameter('name', 'http://www.w3school.com?name=a%20b');
// => a b

// '+' 不转空格（区别于 URLSearchParams 语义）
common.getParameter('q', 'http://www.w3school.com?q=a+b');
// => a+b

// 值含非法 % 序列时不抛错，原样返回不解码
common.getParameter('name', 'http://www.w3school.com?name=50%off');
// => 50%off

// name 非字符串抛 TypeError（空串或含 & = # 同样抛）
common.getParameter(123, '?a=1');
// => throw Error（getParameter 的 name 必须是字符串）

// url 非字符串抛 TypeError（显式传 null 不等于不传，同样抛）
common.getParameter('a', null);
// => throw Error（getParameter 的 url 必须是字符串）
```

## loadScript(url, [onSuccess], [onError])
**动态加载 js**

成功加载并执行完后触发 onSuccess，失败（404、网络错误）触发 onError，均不传参；失败节点移出 DOM，成功的保留。  
onSuccess/onError 可选：null/undefined 视为不传，其余非函数抛 TypeError。  
不查重：同 url 重复调用会重复执行；动态插入的 script 默认 async，并发调用不保证顺序，有顺序依赖时在上一个的 onSuccess 里再发起。  
老 IE 分支区分不了失败：出错也照样当成功触发 onSuccess，onError 与失败移除节点不生效；个别版本回调可能早于脚本执行。  
非浏览器环境（SSR/Node）无 document，调用即抛 ReferenceError。

```JavaScript
common.loadScript('https://xxx.js', () => {
 console.log('loaded');
});

// 加载完才有全局可用，初始化放回调里
common.loadScript('https://cdn.example.com/echarts.min.js', () => {
 echarts.init(document.getElementById('chart'));
});

// 主源失败自动回退备用源
common.loadScript('https://primary.cdn.com/lib.js', null, () => {
 common.loadScript('https://backup.cdn.com/lib.js');
});

// 有依赖的脚本链式加载
common.loadScript('https://cdn.example.com/jquery.min.js', () => {
 common.loadScript('https://cdn.example.com/plugin.js');
});
```

---

[← 返回 API 索引](../../README.md#api)
