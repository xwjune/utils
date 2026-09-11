# ws
**webSocket【断线重连】**

```JavaScript
import { ws } from 'jun-utils';
```

## ws(url, [options])

| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| url | 服务器网址 | string | - |
| options | 配置参数 | object | {} |
| options.timeout | 重连频率【毫秒】 | number  | 3000 |
| options.limitConnect | 断线重连次数 | number | 3 |
| options.onopen | 连接建立回调 | function(ws) | - |
| options.onclose | 连接关闭回调 | function | - |
| options.onmessage | 接收数据回调 | function(data) | - |
| options.reconnect | 重连回调 | function(ws) | - |

---

[← 返回 API 索引](../../README.md#api)
