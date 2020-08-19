/* eslint-disable no-console */
/**
 * webSocket
 * @param {string} url - 服务器网址
 * @param {Object} options - 配置参数
 * @param {number} options.timeout - 重连频率【毫秒】
 * @param {number} options.limitConnect - 断线重连次数
 * @param {function} options.onopen - 连接建立回调
 * @param {function} options.onclose - 连接关闭回调
 * @param {function} options.onmessage - 接收数据回调
 * @param {function} options.reconnect - 重连回调
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
      console.log(`【${url}】WebSocket Open.`);
      if (retry && options.reconnect) { // 重连回调
        options.reconnect(ws);
      }
      if (options.onopen) {
        options.onopen(ws);
      }
    };

    ws.onmessage = (event) => {
      if (options.onmessage) {
        options.onmessage(event.data);
      }
    };

    ws.onerror = () => {
      console.warn('WebSocket Error.');
      reconnect();
    };

    ws.onclose = () => {
      console.warn('WebSocket Closed.');
      reconnect();
    };
  }

  function reconnect() {
    if (!lockReconnect) {
      lockReconnect = true;
      if (_limitConnect > 0) {
        _limitConnect--;
        setTimeout(() => {
          console.log(`Reconnect ${limitConnect - _limitConnect} Times.`);
          lockReconnect = false;
          connect(true);
        }, timeout);
      } else if (options.onclose) {
        options.onclose();
      }
    }
  }

  connect();
  return ws;
};

export default createWebSocket;
