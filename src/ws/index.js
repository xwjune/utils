/* eslint-disable no-console */
/**
 * webSocket【断线重连】
 *
 * 断线自动重连：重连成功触发 reconnect（未提供时回退 onopen），连接终止时触发 onclose。
 * 返回连接句柄：ws 始终指向当前连接实例（重连后自动更新），
 * destroy 销毁连接并清理心跳与重连定时器，阻止后续重连。
 *
 * @param {string} url - 服务器网址
 * @param {Object} [options={}] - 配置参数
 * @param {number} [options.timeout=3000] - 重连频率【毫秒】
 * @param {number} [options.limitConnect=3] - 断线重连次数
 * @param {boolean} [options.heartbeat=false] - 是否启用心跳
 * @param {number} [options.heartbeatInterval=60000] - 心跳间隔【毫秒】
 * @param {string} [options.heartbeatMessage='{"type":"ping"}'] - 心跳消息内容
 * @param {string | string[]} [options.protocols] - WebSocket 子协议（如 'v10.stomp'）
 * @param {Function} [options.onopen] - 连接建立回调【重连成功时若未提供 reconnect 则同样触发】
 * @param {Function} [options.onclose] - 连接终止回调【主动 destroy 不触发】，参数为
 * 'exhausted'（重连次数耗尽）或 'normal'（服务端正常关闭 code 1000）
 * @param {Function} [options.onmessage] - 接收数据回调
 * @param {Function} [options.reconnect] - 重连成功回调【未提供时回退触发 onopen】
 * @param {Function} [options.onHeartbeat] - 心跳回调，参数为 { ok: boolean, reason?: string }；ok
 * 仅代表本端发送成功，无 pong 应答校验；发送失败会自动重连
 * @returns {Object | null} 连接句柄 { ws, destroy }；环境不支持 WebSocket 时告警并返回 null
 * @example
 *
 * const socket = ws('wss://example.com/socket', {
 *   heartbeat: true,
 *   onopen(instance) { console.log('opened', instance); },
 *   onmessage(data) { console.log(data); },
 * });
 *
 * socket.destroy(); // 组件卸载时销毁，停止心跳与重连
 */
const createWebSocket = (url, options = {}) => {
  const {
    timeout = 3000, // 重连频率【毫秒】
    limitConnect = 3, // 断线重连次数
    heartbeat = false, // 是否启用心跳
    heartbeatInterval = 60000, // 心跳间隔【毫秒】
    heartbeatMessage = JSON.stringify({ type: 'ping' }), // 心跳消息内容
    protocols, // WebSocket 子协议
    onopen, // 连接建立回调
    onclose, // 连接终止回调
    onmessage, // 接收数据回调
    reconnect: onReconnect, // 重连成功回调
    onHeartbeat, // 心跳回调
  } = options || {}; // options 显式传 null 时解构会抛 TypeError，兜底为空对象
  let ws = null;
  let connectTimes = limitConnect; // 剩余重连次数
  let reconnectExhausted = false; // 剩余重连次数是否已耗尽：置位即终态，不再自动重连
  let heartbeatTimer = null; // 心跳定时器
  let reconnectTimer = null; // 排队中的重连定时器
  let stableTimer = null; // 重连稳定期定时器：重连成功且稳定存活一个周期后，把剩余重连次数回满

  if (typeof WebSocket === 'undefined') {
    console.warn('Sorry, Your Browser Does Not Support WebSocket.');
    return null;
  }

  function clearHeartbeat() {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  function startHeartbeat() {
    if (!heartbeat) return; // 未启用心跳
    clearHeartbeat();
    heartbeatTimer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(heartbeatMessage);
          if (onHeartbeat) {
            onHeartbeat({ ok: true });
          }
        } catch (error) {
          console.warn(url, '\nHeartbeat send failed.');
          if (onHeartbeat) {
            onHeartbeat({ ok: false, reason: 'send_failed' });
          }
          // OPEN 态 send 仍抛错多见于厂商 webview 的半死连接，与发现死连接一样兜底重连
          clearHeartbeat();
          reconnect();
        }
      } else if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        // close 事件丢失或延迟到达时，由心跳发现死连接并兜底触发重连
        console.warn(url, '\nWebSocket Disconnected, Reconnecting...');
        if (onHeartbeat) {
          onHeartbeat({ ok: false, reason: 'disconnected' });
        }
        clearHeartbeat();
        reconnect();
      }
    }, heartbeatInterval);
  }

  // 解绑旧连接的事件并在未关闭时主动关闭，防止旧实例的残余事件再次触发重连
  function cleanupWs() {
    if (!ws) return;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  }

  // 连接
  function connect(retry) {
    cleanupWs();
    ws = new WebSocket(url, protocols);

    ws.onopen = () => {
      console.log(url, '\nWebSocket Open.');
      startHeartbeat();
      if (retry) {
        // 连接稳定保持一个重连周期后再把剩余重连次数回满，避免「连上又立刻断开」
        // （握手 / 认证失败）的每次 onopen 都立即回满次数，导致无限重连。
        stableTimer = setTimeout(() => {
          stableTimer = null;
          // ws 为 null 是 destroy 后的残余触发；非 OPEN 是稳定期内又断开，次数不回满
          if (ws && ws.readyState === WebSocket.OPEN) {
            connectTimes = limitConnect;
          }
        }, timeout);
        if (onReconnect) {
          onReconnect(ws); // 重连成功回调
        } else if (onopen) {
          onopen(ws); // 未提供重连回调时回退到 onopen
        }
      } else if (onopen) {
        onopen(ws); // 首次连接回调
      }
    };

    ws.onmessage = (event) => {
      if (onmessage) {
        onmessage(event.data); // 接收数据回调
      }
    };

    ws.onerror = (event) => {
      // onerror 后必定跟随 onclose，重连统一由 onclose 触发，避免双重连
      console.warn(url, '\nWebSocket Error.', event);
    };

    ws.onclose = (event) => {
      console.warn(url, `\nWebSocket Closed. Code: ${event.code}`, event);
      clearHeartbeat();
      // 正常关闭（如服务端主动断开、登出踢出）不重连，但与耗尽一样进入终态，让调用方可感知
      if (event.code === 1000) {
        if (onclose) {
          onclose('normal'); // 连接终止回调
        }
        return;
      }
      reconnect();
    };
  }

  // 重连
  function reconnect() {
    // close 事件与心跳兜底并发抵达时去重；次数耗尽置位后为终态，迟到的 close 事件不再重入
    if (reconnectTimer || reconnectExhausted) return;
    if (connectTimes > 0) {
      connectTimes--;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        console.warn(url, `WebSocket Reconnect ${limitConnect - connectTimes} Times.`);
        connect(true);
      }, timeout);
    } else {
      // 次数耗尽即终态：先置闩锁再通知，防心跳兜底与随后迟到的 close 事件重复触发 onclose；
      // 终态下不再排重连、不会再有 onopen，闩锁永不重置
      reconnectExhausted = true;
      if (onclose) {
        onclose('exhausted'); // 连接终止回调
      }
    }
  }

  // 销毁连接：清理心跳与重连相关定时器、解绑事件并关闭连接，阻止后续重连
  function destroy() {
    clearHeartbeat();
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
    clearTimeout(stableTimer); // 稳定期定时器一并清理，销毁后零残余定时器
    stableTimer = null;
    cleanupWs();
    ws = null;
  }

  connect();

  return {
    // 重连会替换 ws 指向，getter 保证调用方始终拿到当前连接实例
    get ws() {
      return ws;
    },
    destroy,
  };
};

export default createWebSocket;
