/* eslint-disable no-console */
/**
 * webSocket【断线重连】
 * @param {string} url - 服务器网址
 * @param {object} [options={}] - 配置参数
 * @param {number} [options.timeout=3000] - 重连频率【毫秒】
 * @param {number} [options.limitConnect=3] - 断线重连次数
 * @param {function} [options.onopen] - 连接建立回调
 * @param {function} [options.onclose] - 连接关闭回调
 * @param {function} [options.onmessage] - 接收数据回调
 * @param {function} [options.reconnect] - 重连回调
 */
const createWebSocket = (url, options = {}) => {
  const {
    timeout = 3000,
    limitConnect = 3,
  } = options;
  if (typeof WebSocket === 'undefined') {
    console.warn('Sorry, Your Browser Does Not Support WebSocket.');
    return null;
  }

  let ws = null;
  let _limitConnect = limitConnect;
  let lockReconnect = false; // reconnect加锁，防止onclose、onerror两次重连

  function connect(retry) {
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log(`'${url}' WebSocket Open.`);
      if (retry) {
        _limitConnect = limitConnect; // 重连次数重置
        if (options.reconnect) {
          options.reconnect(ws); // 重连回调
        }
      }
      if (options.onopen) {
        options.onopen(ws); // 连接建立回调
      }
    };

    ws.onmessage = (event) => {
      if (options.onmessage) {
        options.onmessage(event.data); // 接收数据回调
      }
    };

    ws.onerror = () => {
      console.warn(`'${url}' WebSocket Error.`);
      reconnect();
    };

    ws.onclose = () => {
      console.warn(`'${url}' WebSocket Closed.`);
      reconnect();
    };
  }

  function reconnect() {
    if (!lockReconnect) {
      lockReconnect = true; // 加锁
      if (_limitConnect > 0) {
        _limitConnect--;
        setTimeout(() => {
          lockReconnect = false; // 解锁
          console.log(`WebSocket Reconnect ${limitConnect - _limitConnect} Times.`);
          connect(true);
        }, timeout);
      } else if (options.onclose) {
        options.onclose(); // 连接关闭回调
      }
    }
  }

  connect();
  return ws;
};

export default createWebSocket;
