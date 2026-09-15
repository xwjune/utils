<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# ws
**webSocket【断线重连】**

```JavaScript
import { ws } from 'jun-utils';
```

## ws(url, [options={}])
断线自动重连：重连成功触发 reconnect（未提供时回退 onopen），连接终止时触发 onclose。  
返回连接句柄：ws 始终指向当前连接实例（重连后自动更新），destroy 销毁连接并清理心跳与重连定时器，阻止后续重连。

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| url | 服务器网址 | string | - |
| options | 配置参数 | Object | {} |
| options.timeout | 重连频率【毫秒】 | number | 3000 |
| options.limitConnect | 断线重连次数 | number | 3 |
| options.heartbeat | 是否启用心跳 | boolean | false |
| options.heartbeatInterval | 心跳间隔【毫秒】 | number | 60000 |
| options.heartbeatMessage | 心跳消息内容 | string | '{"type":"ping"}' |
| options.protocols | WebSocket 子协议（如 'v10.stomp'） | string \| string[] | - |
| options.onopen | 连接建立回调【重连成功时若未提供 reconnect 则同样触发】 | Function | - |
| options.onclose | 连接终止回调【主动 destroy 不触发】，参数为 'exhausted'（重连次数耗尽）或 'normal'（服务端正常关闭 code 1000） | Function | - |
| options.onmessage | 接收数据回调 | Function | - |
| options.reconnect | 重连成功回调【未提供时回退触发 onopen】 | Function | - |
| options.onHeartbeat | 心跳回调，参数为 { ok: boolean, reason?: string }；ok 仅代表本端发送成功，无 pong 应答校验；发送失败会自动重连 | Function | - |

```JavaScript
const socket = ws('wss://example.com/socket', {
  heartbeat: true,
  onopen(instance) { console.log('opened', instance); },
  onmessage(data) { console.log(data); },
});

socket.destroy(); // 组件卸载时销毁，停止心跳与重连
```

---

[← 返回 API 索引](../../README.md#api)
