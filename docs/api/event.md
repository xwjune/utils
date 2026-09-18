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

```JavaScript
event.addEvent(button, 'click', (evt) => {
  event.stopPropagation(evt); // 只响应本层，不再冒泡到父级
});
```

## preventDefault(evt)
**阻止事件默认行为**

```JavaScript
event.addEvent(form, 'submit', (evt) => {
  event.preventDefault(evt); // 拦截默认提交，改走自定义逻辑
});
```

---

[← 返回 API 索引](../../README.md#api)
