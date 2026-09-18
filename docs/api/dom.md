<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# dom
**DOM 视口与元素操作**

【环境】视口测量（getWin 系列/getElementOffset）依赖浏览器 window/document，SSR/Node 中调用会抛错【引入不受影响】  
【兼容】滚动偏移优先 pageYOffset、内容尺寸优先 documentElement，取不到再逐级兜底到 body

```JavaScript
import { dom } from 'jun-utils';
```

## getWinHeight()
**获取窗口可视区的高度**

innerHeight 口径含滚动条，回退的 clientHeight 口径不含【桌面端有可见滚动条时两者有差】

```JavaScript
dom.getWinHeight(); // 可视区高度【像素，随窗口大小变化】
// => 667
```

## getWinWidth()
**获取窗口可视区的宽度**

```JavaScript
dom.getWinWidth(); // 可视区宽度【像素，随窗口大小变化】
// => 375
```

## getWinScrollHeight()
**获取窗口可视区内容的总高度**

```JavaScript
dom.getWinScrollHeight(); // 内容总高度，长页面大于可视区高度
// => 2589
```

## getWinScrollWidth()
**获取窗口可视区内容的总宽度**

```JavaScript
dom.getWinScrollWidth(); // 内容总宽度，无横向溢出时等于可视区宽度
// => 375
```

## getWinScrollTop()
**获取窗口可视区滚动条垂直偏移**

```JavaScript
dom.getWinScrollTop(); // 页面未滚动时
// => 0

dom.getWinScrollTop(); // 向下滚动 100px 后
// => 100
```

## getWinScrollLeft()
**获取窗口可视区滚动条水平偏移**

```JavaScript
dom.getWinScrollLeft(); // 页面未滚动时
// => 0
```

## getElementOffset(element)
**获取元素相对于文档的位置**

相对整份文档的坐标【getBoundingClientRect 是相对视口，不含页面滚动偏移】

element 为空值或无 getBoundingClientRect 时返回 { top: 0, left: 0 }

返回的是视觉坐标：display:none 元素 rect 全 0，叠加滚动偏移后可能得到非 0；  
position:fixed / transform 元素的坐标随变换与滚动变化，可能与布局位置不符

```JavaScript
const offset = dom.getElementOffset(element);
const left = offset.left;
const top = offset.top;
```

## getStyle(element, name)
**获取元素样式**

currentStyle：IE、Opera（返回未经计算的相对值，如 50%、1em、auto）  
getComputedStyle：FireFox、Chrome、Safari

```JavaScript
dom.getStyle(element, 'font-size'); // 读最终样式【含内联、嵌入、外部样式】
// => '14px'
dom.getStyle(element, 'fontSize'); // 驼峰入参，与连字符等价
```

## selectText(input, [start=0], [length])
**选中文本**

仅支持 input、textarea；type=number 等无可选文本的 input 类型会抛 InvalidStateError

```JavaScript
鼠标停留在‘元’前面
<input type="text" value="12元" />
dom.selectText(document.querySelector('input'), 2, 0);

选中所有
<input type="text" value="123456" />
dom.selectText(document.querySelector('input'));
```

---

[← 返回 API 索引](../../README.md#api)
