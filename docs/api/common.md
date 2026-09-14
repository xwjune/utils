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

## stopPropagation(evt)
**阻止事件冒泡**

```JavaScript
common.addEvent(button, 'click', (evt) => {
  common.stopPropagation(evt); // 只响应本层，不再冒泡到父级
});
```

## preventDefault(evt)
**阻止事件默认行为**

```JavaScript
common.addEvent(form, 'submit', (evt) => {
  common.preventDefault(evt); // 拦截默认提交，改走自定义逻辑
});
```

## addEvent(target, type, handler, [useCapture=false])
**添加事件监听**

```JavaScript
const handler = () => {
  console.log('onload');
};
common.addEvent(window, 'load', handler);
```

## removeEvent(target, type, handler, [useCapture=false])
**移除事件监听**

```JavaScript
const handler = () => {
  console.log('onload');
};
common.removeEvent(window, 'load', handler);
```

## getCookie(name)
**读取 cookie**

返回解码后的值；值不是编码产物时原样返回；未命中返回 null。  
同名 cookie 写在多个 path/domain 下时，前端无法枚举区分；  
规范（RFC 6265 §5.4）建议浏览器按 path 长度降序返回（长的优先），但属 SHOULD 级建议，不可依赖。  
此时本函数返回 document.cookie 序列里的第一个命中，不保证是哪个 path/domain 的。

```JavaScript
// 判存在请用 != null 而非真值判断：空值 cookie 命中返回 ''（falsy），真值判断会把「存在但为空」误判成「不存在」
common.setCookie('flag', '');
common.getCookie('flag');           // => ''（存在，但值为空）
common.getCookie('flag') != null;   // => true
Boolean(common.getCookie('flag'));  // => false（误判为不存在）

common.getCookie('absent');
// => null
```

## setCookie(name, value, [options={}])
**创建 cookie**

name 用 __Host-/__Secure- 前缀时需自行满足浏览器的附加要求（__Host- 需 Secure + Path=/ + 无 Domain；__Secure- 需 Secure），不满足时浏览器会拒绝写入，本库不额外校验

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| name | cookie 名称 | string | - |
| value | cookie 值（仅接受基本类型，对象请先 JSON.stringify） | string \| number \| boolean | - |
| options | 配置 | object | {} |
| options.domain | 域名 | string | - |
| options.path | 路径，默认根路径；显式传入时必须以 / 开头，否则整单拒绝 | string | '/' |
| options.maxAge | 相对过期时间【单位是秒，0 表示立即失效；与 expires 同时传时以 maxAge 为准，建议二选一】 | number | - |
| options.expires | 绝对失效时间 | date | - |
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
**删除 cookie**

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| name | cookie 名称 | string | - |
| options | 配置，path/domain 需与写入时一致才能删掉 | object | {} |
| options.domain | 域名 | string | - |
| options.path | 路径（以 / 开头），需与写入时一致才能删掉；不传时删根路径与当前页面目录两处 | string | - |

```JavaScript
common.delCookie('name');

common.delCookie('name', { domain: '.example.com', path: '/app' });
```

## getWinHeight()
**获取窗口可视区的高度**

```JavaScript
common.getWinHeight(); // 可视区高度【像素，随窗口大小变化】
// => 667
```

## getWinWidth()
**获取窗口可视区的宽度**

```JavaScript
common.getWinWidth(); // 可视区宽度【像素，随窗口大小变化】
// => 375
```

## getWinScrollHeight()
**获取窗口可视区内容的总高度**

```JavaScript
common.getWinScrollHeight(); // 内容总高度，长页面大于可视区高度
// => 2589
```

## getWinScrollWidth()
**获取窗口可视区内容的总宽度**

```JavaScript
common.getWinScrollWidth(); // 内容总宽度，无横向溢出时等于可视区宽度
// => 375
```

## getWinScrollTop()
**获取窗口可视区滚动条垂直偏移**

```JavaScript
common.getWinScrollTop(); // 页面未滚动时
// => 0

common.getWinScrollTop(); // 向下滚动 100px 后
// => 100
```

## getWinScrollLeft()
**获取窗口可视区滚动条水平偏移**

```JavaScript
common.getWinScrollLeft(); // 页面未滚动时
// => 0
```

## getElementOffset(element)
**获取元素相对于文档的位置**

相对整份文档的坐标【getBoundingClientRect 是相对视口，不含页面滚动偏移】

```JavaScript
const offset = common.getElementOffset(element);
const left = offset.left;
const top = offset.top;
```

## selectText(input, [start=0], [length])
**选中文本**

仅支持 input、textarea；type=number 等无可选文本的 input 类型会抛 InvalidStateError

```JavaScript
鼠标停留在‘元’前面
<input type="text" value="12元" />
common.selectText(document.querySelector('input'), 2, 0);

选中所有
<input type="text" value="123456" />
common.selectText(document.querySelector('input'));
```

## getStyle(element, name)
**获取元素样式**

currentStyle：IE、Opera（返回未经计算的相对值，如 50%、1em、auto）  
getComputedStyle：FireFox、Chrome、Safari

```JavaScript
common.getStyle(element, 'font-size'); // 读最终样式【含内联、嵌入、外部样式】
// => '14px'
common.getStyle(element, 'fontSize'); // 驼峰入参，与连字符等价
```

---

[← 返回 API 索引](../../README.md#api)
