# common
**通用方法**

```JavaScript
import { common } from 'jun-utils';
```

## generateUUID()
生成uuid

```JavaScript
common.generateUUID(); // cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
```

## getParameter(name, [url=window.location.search])
获取url中的参数

```JavaScript
common.getParameter('name', 'http://www.w3school.com?name=xxx'); // xxx

common.getParameter('name', 'http://www.w3school.com?name='); // ''

common.getParameter('name', 'http://www.w3school.com'); // null
```

## loadScript(url, [callback])
动态加载js

```JavaScript
common.loadScript('https://xxx.js', () => {
  console.log('loaded');
});
```

## stopPropagation(evt)
阻止事件冒泡

## preventDefault(evt);
阻止事件默认行为

## addEvent(target, type, handler, [useCapture=false]);
添加事件监听

```JavaScript
const handler = () => {
  console.log('onload');
};
common.addEvent(window, 'load', handler);
```

## removeEvent(target, type, handler, [useCapture=false]);
移除事件监听

```JavaScript
const handler = () => {
  console.log('onload');
};
common.removeEvent(window, 'load', handler);
```

## getCookie(name)
读取cookie

- 返回解码后的值；值不是编码产物时原样返回；未命中返回 `null`
- 空值 cookie 命中返回 `''`（falsy），判存在请用 `!= null` 而非真值判断

```JavaScript
common.setCookie('flag', '');
common.getCookie('flag');           // => ''（存在，但值为空）
common.getCookie('flag') != null;   // => true
Boolean(common.getCookie('flag'));  // => false（真值判断会把「存在但为空」误判成「不存在」）
common.getCookie('absent');         // => null
```

## setCookie(name, value, [options={}])
创建cookie

- `value` 仅接受基本类型，对象请先 `JSON.stringify`
- 默认写入 `Path=/`（不是浏览器默认的当前页面目录），保证读写删三处路径一致
- `name/value/domain/path` 非法时整条跳过不写；`maxAge/expires/sameSite` 非法时仅忽略该项，均不抛错
- `sameSite: 'None'` 时自动补 `Secure`（Chrome 80+/Firefox/Safari 的强制要求）

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| name | cookie名称 | string | - |
| value | cookie值，仅接受基本类型 | string/number/boolean | - |
| options | 配置参数 | object | {} |
| options.domain | 域名 | string | - |
| options.path | 路径，需以 / 开头 | string | '/' |
| options.maxAge | 相对过期时间【秒】，0 表示立即失效；与 expires 同时传时以 maxAge 为准 | number | - |
| options.expires | 绝对失效时间 | Date | - |
| options.secure | 安全标志 | boolean | - |
| options.sameSite | 跨域安全机制，仅接受 Strict/Lax/None（大小写不敏感） | string | - |

```JavaScript
// 一天后过期
common.setCookie('name', 'value', {
  maxAge: 60 * 60 * 24,
});

// 指定域名与路径
common.setCookie('name', 'value', { domain: '.example.com', path: '/app' });

// 会话 cookie + 跨域策略
common.setCookie('name', 'value', { sameSite: 'Lax' });
```

## delCookie(name, [options={}])
删除cookie

- `domain/path` 需与写入时一致才能删掉（cookie 的身份是 name + domain + path）
- 不传 `path` 时删两处：根路径 `/` 与当前页面目录（兜底旧版按浏览器默认路径写入的存量 cookie）

```JavaScript
common.delCookie('name');
common.delCookie('name', { domain: '.example.com', path: '/app' });
```

## getWinHeight()
获取窗口可视区的高度

## getWinWidth()
获取窗口可视区的宽度

## getWinScrollHeight()
获取窗口可视区内容的总高度

## getWinScrollWidth()
获取窗口可视区内容的总宽度

## getWinScrollTop()
获取窗口可视区滚动条垂直偏移

## getWinScrollLeft()
获取窗口可视区滚动条水平偏移

## getElementOffset(element)
获取元素相对于窗口可视区的位置

## selectText(textNode, [start=0], [length])
选中文本

```JavaScript
<input type="text" value="12元" />

// 鼠标停留在’元‘前面
common.selectText(document.querySelector('input'), 2, 0);

// 选中所有
common.selectText(document.querySelector('input'));
```

## getStyle(element, name)
获取元素样式

---

[← 返回 API 索引](../../README.md#api)
