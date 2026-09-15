import ws from '../index';

// 可控的 WebSocket 替身：状态与事件由测试手动驱动，便于模拟 close 事件丢失、
// CONNECTING 期重连等真实浏览器难以复现的时序
class MockWebSocket {
  static instances = [];

  static CONNECTING = 0;

  static OPEN = 1;

  static CLOSING = 2;

  static CLOSED = 3;

  constructor(url, protocols) {
    this.url = url;
    this.protocols = protocols;
    this.readyState = MockWebSocket.CONNECTING;
    this.sent = [];
    this.closeCalled = false;
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
    MockWebSocket.instances.push(this);
  }

  send(data) {
    this.sent.push(data);
  }

  close() {
    this.closeCalled = true;
    if (this.readyState !== MockWebSocket.CLOSED) {
      this.readyState = MockWebSocket.CLOSED;
    }
  }
}

// 模拟浏览器派发事件：先迁移状态再触发回调
const emitOpen = (instance) => {
  instance.readyState = MockWebSocket.OPEN;
  instance.onopen();
};
const emitMessage = (instance, data) => instance.onmessage({ data });
const emitClose = (instance, code = 1006) => {
  instance.readyState = MockWebSocket.CLOSED;
  instance.onclose({ code });
};

let warnSpy;
let logSpy;

beforeEach(() => {
  jest.useFakeTimers();
  MockWebSocket.instances = [];
  global.WebSocket = MockWebSocket;
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  delete global.WebSocket;
  jest.restoreAllMocks();
});

describe('环境不支持', () => {
  test('无 WebSocket 时告警并返回 null', () => {
    delete global.WebSocket;

    expect(ws('wss://example.com/socket')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('Sorry, Your Browser Does Not Support WebSocket.');
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe('连接与回调', () => {
  test('首次连接成功触发 onopen 并拿到当前实例', () => {
    const onopen = jest.fn();
    const handle = ws('wss://example.com/socket', { onopen });
    const [instance] = MockWebSocket.instances;

    expect(handle.ws).toBe(instance);
    emitOpen(instance);
    expect(onopen).toHaveBeenCalledTimes(1);
    expect(onopen).toHaveBeenCalledWith(instance);
    expect(logSpy).toHaveBeenCalledWith('wss://example.com/socket', '\nWebSocket Open.');
  });

  test('onmessage 收到 event.data', () => {
    const onmessage = jest.fn();
    const handle = ws('wss://example.com/socket', { onmessage });
    emitMessage(handle.ws, 'hello');

    expect(onmessage).toHaveBeenCalledWith('hello');
  });

  test('options 显式传 null 时按默认配置连接', () => {
    const handle = ws('wss://example.com/socket', null);

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(handle.ws.protocols).toBeUndefined();
    // 未提供回调时事件照常派发不抛错
    emitOpen(handle.ws);
    emitMessage(handle.ws, 'hello');
    emitClose(handle.ws, 1000); // 正常关闭时终态回调缺省，同样不抛错
  });

  test('protocols 子协议透传给构造函数', () => {
    ws('wss://example.com/socket', { protocols: 'v10.stomp' });

    expect(MockWebSocket.instances[0].protocols).toBe('v10.stomp');
  });

  test('onerror 仅告警不触发重连', () => {
    const handle = ws('wss://example.com/socket', {});
    emitOpen(handle.ws);
    handle.ws.onerror(new Error('mock error'));

    jest.advanceTimersByTime(3000);
    expect(MockWebSocket.instances).toHaveLength(1);
  });
});

describe('断线重连', () => {
  test('异常关闭后按时重连，成功触发 reconnect 而非 onopen', () => {
    const onopen = jest.fn();
    const onReconnect = jest.fn();
    const handle = ws('wss://example.com/socket', { timeout: 100, onopen, reconnect: onReconnect });
    emitOpen(handle.ws);
    emitClose(handle.ws);

    jest.advanceTimersByTime(100);
    expect(MockWebSocket.instances).toHaveLength(2);
    const [, second] = MockWebSocket.instances;
    emitOpen(second);

    expect(onReconnect).toHaveBeenCalledTimes(1);
    expect(onReconnect).toHaveBeenCalledWith(second);
    expect(onopen).toHaveBeenCalledTimes(1); // 仅有首次连接那一次
  });

  test('未提供 reconnect 时重连成功回退触发 onopen', () => {
    const onopen = jest.fn();
    const handle = ws('wss://example.com/socket', { timeout: 100, onopen });
    emitOpen(handle.ws);
    emitClose(handle.ws);

    jest.advanceTimersByTime(100);
    emitOpen(handle.ws);

    expect(onopen).toHaveBeenCalledTimes(2);
  });

  test('连接稳定一个周期后剩余重连次数回满', () => {
    const handle = ws('wss://example.com/socket', { timeout: 100, limitConnect: 2 });
    const reconnectLogs = () => warnSpy.mock.calls
      .filter(([, second]) => String(second).includes('Reconnect'))
      .map(([, second]) => second);

    // 第一轮：断开后重连成功并稳定一个周期，剩余次数应回满为 2
    emitOpen(handle.ws);
    emitClose(handle.ws);
    jest.advanceTimersByTime(100);
    emitOpen(handle.ws);
    jest.advanceTimersByTime(100);
    expect(reconnectLogs()).toEqual(['WebSocket Reconnect 1 Times.']);

    // 第二轮：次数已回满，重连序号重新从 1 计（未回满则应为 2）
    emitClose(handle.ws);
    jest.advanceTimersByTime(100);
    emitOpen(handle.ws);
    expect(reconnectLogs()).toEqual(['WebSocket Reconnect 1 Times.', 'WebSocket Reconnect 1 Times.']);
  });

  test('连上又立刻断开不回满次数，耗尽后触发 onclose', () => {
    const onclose = jest.fn();
    const handle = ws('wss://example.com/socket', { timeout: 100, limitConnect: 1, onclose });

    emitOpen(handle.ws);
    emitClose(handle.ws);
    jest.advanceTimersByTime(100);
    expect(MockWebSocket.instances).toHaveLength(2);

    // 重连成功但未稳定满一个周期再次断开，延迟回满次数的定时器发现连接已关闭
    emitOpen(handle.ws);
    emitClose(handle.ws);
    expect(onclose).toHaveBeenCalledTimes(1);
    expect(onclose).toHaveBeenCalledWith('exhausted');

    jest.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(2); // 次数未回满，不再重连
  });

  test('limitConnect: 3 时恰好重连 3 次（首连之外）后进入终态', () => {
    const onclose = jest.fn();
    const handle = ws('wss://example.com/socket', { timeout: 100, limitConnect: 3, onclose });
    emitOpen(handle.ws);

    // 服务端持续不可用：每次连接立刻失败，剩余重连次数逐一扣至 0
    for (let round = 0; round < 3; round += 1) {
      emitClose(handle.ws);
      jest.advanceTimersByTime(100);
    }
    expect(MockWebSocket.instances).toHaveLength(4); // 首次连接 + 3 次重连
    expect(onclose).not.toHaveBeenCalled();

    // 第 4 次连接失败剩余次数已为 0，直接终态且不再重连
    emitClose(MockWebSocket.instances[3]);
    expect(onclose).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(4);

    const reconnectLogs = warnSpy.mock.calls
      .filter(([, second]) => String(second).includes('Reconnect'))
      .map(([, second]) => second);
    expect(reconnectLogs).toEqual([
      'WebSocket Reconnect 1 Times.',
      'WebSocket Reconnect 2 Times.',
      'WebSocket Reconnect 3 Times.',
    ]);
  });

  test('服务端正常关闭（code 1000）触发 onclose 且不重连', () => {
    const onclose = jest.fn();
    const handle = ws('wss://example.com/socket', { timeout: 100, onclose });

    emitOpen(handle.ws);
    emitClose(handle.ws, 1000);

    jest.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(1);
    expect(onclose).toHaveBeenCalledTimes(1);
    expect(onclose).toHaveBeenCalledWith('normal');
  });

  test('重连次数耗尽且未提供 onclose 时静默停止', () => {
    const handle = ws('wss://example.com/socket', { timeout: 100, limitConnect: 1 });

    emitClose(handle.ws);
    jest.advanceTimersByTime(100);
    emitClose(handle.ws);
    jest.advanceTimersByTime(1000);

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  test('心跳兜底耗尽后迟到的 close 事件不重复触发 onclose', () => {
    const onclose = jest.fn();
    const handle = ws('wss://example.com/socket', {
      timeout: 100,
      limitConnect: 1,
      heartbeat: true,
      heartbeatInterval: 50,
      onclose,
    });

    emitOpen(handle.ws);
    emitClose(handle.ws); // 剩余次数 1 → 0，排队重连
    jest.advanceTimersByTime(100);
    emitOpen(handle.ws); // 重连成功，心跳重启，但剩余次数已耗尽

    // close 事件丢失，心跳发现死连接，剩余次数耗尽走终态
    handle.ws.readyState = MockWebSocket.CLOSED;
    jest.advanceTimersByTime(50);
    expect(onclose).toHaveBeenCalledTimes(1);
    expect(onclose).toHaveBeenCalledWith('exhausted');

    // 迟到的 close 事件不再重复触发终态回调
    handle.ws.onclose({ code: 1006 });
    expect(onclose).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(2);
  });

  test('重连前解绑旧实例事件，残余事件不再触发重连', () => {
    const handle = ws('wss://example.com/socket', { timeout: 100 });

    emitOpen(handle.ws);
    const first = handle.ws;
    emitClose(first);
    jest.advanceTimersByTime(100);
    expect(MockWebSocket.instances).toHaveLength(2);

    expect(first.onopen).toBeNull();
    expect(first.onmessage).toBeNull();
    expect(first.onerror).toBeNull();
    expect(first.onclose).toBeNull();
    expect(first.closeCalled).toBe(false); // 已关闭的旧实例无需再次 close
  });

  test('旧连接仍在 CONNECTING 时重连会主动关闭它', () => {
    const handle = ws('wss://example.com/socket', { timeout: 100 });

    // 未 open 即异常关闭（close 事件先于状态迁移的特殊时序），旧实例仍处 CONNECTING
    handle.ws.onclose({ code: 1006 });
    jest.advanceTimersByTime(100);

    const [first] = MockWebSocket.instances;
    expect(first.closeCalled).toBe(true);
    expect(first.readyState).toBe(MockWebSocket.CLOSED);
    expect(MockWebSocket.instances).toHaveLength(2);
  });
});

describe('心跳', () => {
  test('默认不启用心跳', () => {
    const handle = ws('wss://example.com/socket', {});

    emitOpen(handle.ws);
    jest.advanceTimersByTime(180000);
    expect(handle.ws.sent).toHaveLength(0);
  });

  test('按间隔发送心跳并回调 ok', () => {
    const onHeartbeat = jest.fn();
    const handle = ws('wss://example.com/socket', {
      heartbeat: true,
      heartbeatInterval: 50,
      heartbeatMessage: 'PING',
      onHeartbeat,
    });

    emitOpen(handle.ws);
    jest.advanceTimersByTime(50);
    expect(handle.ws.sent).toEqual(['PING']);
    expect(onHeartbeat).toHaveBeenCalledWith({ ok: true });

    jest.advanceTimersByTime(50);
    expect(handle.ws.sent).toEqual(['PING', 'PING']);
    expect(onHeartbeat).toHaveBeenCalledTimes(2);
  });

  test('心跳默认消息为 ping JSON', () => {
    const handle = ws('wss://example.com/socket', { heartbeat: true, heartbeatInterval: 50 });

    emitOpen(handle.ws);
    jest.advanceTimersByTime(50);
    expect(handle.ws.sent).toEqual(['{"type":"ping"}']);
  });

  test('心跳发送失败回调 send_failed 并兜底重连', () => {
    const onHeartbeat = jest.fn();
    const handle = ws('wss://example.com/socket', {
      timeout: 100,
      heartbeat: true,
      heartbeatInterval: 50,
      onHeartbeat,
    });

    emitOpen(handle.ws);
    handle.ws.send = () => {
      throw new Error('send failed');
    };
    jest.advanceTimersByTime(50);

    expect(onHeartbeat).toHaveBeenCalledWith({ ok: false, reason: 'send_failed' });
    expect(warnSpy).toHaveBeenCalledWith('wss://example.com/socket', '\nHeartbeat send failed.');

    jest.advanceTimersByTime(50); // 心跳已清停，不再回调
    expect(onHeartbeat).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(50); // 满 timeout 自动重连
    expect(MockWebSocket.instances).toHaveLength(2);
  });

  test('发现连接已关闭时兜底触发重连，且与 close 事件去重', () => {
    const onHeartbeat = jest.fn();
    const handle = ws('wss://example.com/socket', {
      timeout: 100,
      heartbeat: true,
      heartbeatInterval: 50,
      onHeartbeat,
    });

    emitOpen(handle.ws);
    jest.advanceTimersByTime(50); // 先完成一次正常心跳

    // close 事件丢失：状态已 CLOSED 但 onclose 未派发
    handle.ws.readyState = MockWebSocket.CLOSED;
    jest.advanceTimersByTime(50);
    expect(onHeartbeat).toHaveBeenCalledWith({ ok: false, reason: 'disconnected' });

    // 迟到的 close 事件到达时重连已排队，只重连一次
    handle.ws.onclose({ code: 1006 });
    jest.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(2);
  });

  test('连接正在关闭（CLOSING）时同样兜底重连', () => {
    const handle = ws('wss://example.com/socket', {
      timeout: 100,
      heartbeat: true,
      heartbeatInterval: 50,
    });

    emitOpen(handle.ws);
    handle.ws.readyState = MockWebSocket.CLOSING;
    jest.advanceTimersByTime(50);
    jest.advanceTimersByTime(100);

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  test('连接正在建立（CONNECTING）时跳过当次心跳且不中断定时器', () => {
    const onHeartbeat = jest.fn();
    const handle = ws('wss://example.com/socket', {
      heartbeat: true,
      heartbeatInterval: 50,
      onHeartbeat,
    });

    emitOpen(handle.ws);
    handle.ws.readyState = MockWebSocket.CONNECTING;
    jest.advanceTimersByTime(50);

    expect(handle.ws.sent).toHaveLength(0);
    expect(onHeartbeat).not.toHaveBeenCalled();
    expect(MockWebSocket.instances).toHaveLength(1);

    // 状态恢复后心跳继续
    handle.ws.readyState = MockWebSocket.OPEN;
    jest.advanceTimersByTime(50);
    expect(handle.ws.sent).toHaveLength(1);
  });

  test('未提供 onHeartbeat 时心跳与断线兜底均不抛错', () => {
    const handle = ws('wss://example.com/socket', {
      timeout: 100,
      heartbeat: true,
      heartbeatInterval: 50,
    });

    emitOpen(handle.ws);
    handle.ws.send = () => {
      throw new Error('send failed');
    };
    jest.advanceTimersByTime(50); // 发送失败无回调，仅告警并自动排重连
    jest.advanceTimersByTime(100); // 重连建立新实例，自带可用的 send
    expect(MockWebSocket.instances).toHaveLength(2);

    emitOpen(handle.ws); // 新连接重启心跳
    jest.advanceTimersByTime(50);
    expect(handle.ws.sent).toHaveLength(1);

    handle.ws.readyState = MockWebSocket.CLOSED;
    jest.advanceTimersByTime(50); // 断线兜底路径同样无回调不抛错
    jest.advanceTimersByTime(100);
    expect(MockWebSocket.instances).toHaveLength(3);
  });

  test('断连期间心跳清停，重连成功后随新连接重启', () => {
    const handle = ws('wss://example.com/socket', {
      timeout: 100,
      heartbeat: true,
      heartbeatInterval: 200,
    });

    emitOpen(handle.ws);
    jest.advanceTimersByTime(200);
    const first = handle.ws;
    expect(first.sent).toHaveLength(1);

    emitClose(first);
    jest.advanceTimersByTime(100); // 走 close 事件路径重连（心跳间隔更长，不应插手）
    const second = handle.ws;
    expect(second).not.toBe(first);
    emitOpen(second);
    jest.advanceTimersByTime(200);

    expect(first.sent).toHaveLength(1); // 旧连接不再发心跳
    expect(second.sent).toHaveLength(1); // 新连接心跳已启动
  });
});

describe('销毁', () => {
  test('销毁后排队的重连不再执行，句柄 ws 置空', () => {
    const handle = ws('wss://example.com/socket', { timeout: 100 });

    emitOpen(handle.ws);
    emitClose(handle.ws);
    handle.destroy();
    jest.advanceTimersByTime(1000);

    expect(handle.ws).toBeNull();
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  test('连接打开时销毁会主动关闭并停止心跳', () => {
    const handle = ws('wss://example.com/socket', {
      heartbeat: true,
      heartbeatInterval: 50,
    });

    emitOpen(handle.ws);
    const instance = handle.ws;
    handle.destroy();
    jest.advanceTimersByTime(1000);

    expect(instance.closeCalled).toBe(true);
    expect(instance.readyState).toBe(MockWebSocket.CLOSED);
    expect(instance.sent).toHaveLength(0); // 心跳已清停
    expect(handle.ws).toBeNull();
  });

  test('重连成功后销毁，延迟回满次数的定时器不再生效', () => {
    const handle = ws('wss://example.com/socket', { timeout: 100, limitConnect: 2 });

    emitClose(handle.ws);
    jest.advanceTimersByTime(100);
    emitOpen(handle.ws); // 重连成功，回满次数的定时器已排队
    handle.destroy();
    jest.advanceTimersByTime(1000);

    expect(MockWebSocket.instances).toHaveLength(2); // 销毁后次数回满也无济于事，不再重连
  });
});
