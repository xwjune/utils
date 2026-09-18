<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# event
**事件操作**

```JavaScript
import { event } from 'jun-utils';
```

## addEvent(target, type, handler, [useCapture=false])
**添加事件监听**

非法入参（target 非对象、type 非字符串或纯空白、handler 非函数）时不动作并返回 false；  
返回 true 仅代表入参合法并完成了挂载调用，不保证监听实际生效（DOM0 分支会覆盖已有监听）

```JavaScript
const handler = () => {
  console.log('onload');
};
event.addEvent(window, 'load', handler);
```

## removeEvent(target, type, handler, [useCapture=false])
**移除事件监听**

非法入参（target 非对象、type 非字符串或纯空白、handler 非函数）时不动作并返回 false；  
返回 true 仅代表入参合法并调用了移除 API，不感知是否命中已挂监听（如 capture 标志不一致时原生为静默 no-op）

```JavaScript
const handler = () => {
  console.log('onload');
};
event.removeEvent(window, 'load', handler);
```

## stopPropagation(evt)
**阻止事件冒泡**

IE8- 下 attachEvent 挂载的回调不接收 event 参数，可不传，未传时自动取 window.event；  
两者均取不到时抛 TypeError（如非事件分发期调用），不静默吞掉

```JavaScript
event.addEvent(button, 'click', (evt) => {
  event.stopPropagation(evt); // 只响应本层，不再冒泡到父级
});
```

## preventDefault(evt)
**阻止事件默认行为**

IE8- 下 attachEvent 挂载的回调不接收 event 参数，可不传，未传时自动取 window.event；  
两者均取不到时抛 TypeError（如非事件分发期调用），不静默吞掉

Chrome 等对 window/document 上的 touchstart/touchmove/wheel 默认按 passive 处理：此函数无法取消其滚动等默认行为，仅 console 出现一条警告

```JavaScript
event.addEvent(form, 'submit', (evt) => {
  event.preventDefault(evt); // 拦截默认提交，改走自定义逻辑
});

// 反例：window 上的 touchmove 被 Chrome 默认按 passive 处理，无法取消滚动
event.addEvent(window, 'touchmove', (evt) => {
  event.preventDefault(evt); // 不生效，仅 console 一条警告；需原生 { passive: false } 挂载才可取消
});
```

---

[← 返回 API 索引](../../README.md#api)
