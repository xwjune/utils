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

非法入参（target 非对象、type 非字符串或纯空白、handler 非函数）时不动作并返回 false；  
返回 true 仅代表入参合法并完成了挂载调用，不保证监听实际生效（DOM0 分支会覆盖已有监听）

```JavaScript
const handler = () => {
  console.log('onload');
};
common.addEvent(window, 'load', handler);
```

## removeEvent(target, type, handler, [useCapture=false])
**移除事件监听**

非法入参（target 非对象、type 非字符串或纯空白、handler 非函数）时不动作并返回 false；  
返回 true 仅代表入参合法并调用了移除 API，不感知是否命中已挂监听（如 capture 标志不一致时原生为静默 no-op）

```JavaScript
const handler = () => {
  console.log('onload');
};
common.removeEvent(window, 'load', handler);
```

## getWinHeight()
**获取窗口可视区的高度**

innerHeight 口径含滚动条，回退的 clientHeight 口径不含【桌面端有可见滚动条时两者有差】

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

element 为空值或无 getBoundingClientRect 时返回 { top: 0, left: 0 }

返回的是视觉坐标：display:none 元素 rect 全 0，叠加滚动偏移后可能得到非 0；  
position:fixed / transform 元素的坐标随变换与滚动变化，可能与布局位置不符

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
