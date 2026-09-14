import appUtil from '../index';

const UA = {
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  // iPadOS 13+ 桌面 UA 与桌面 Mac Safari 完全同串，只能靠触点数区分
  ipadDesktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  android: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  desktopChrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  weChatAndroid: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.40',
  weChatWindows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/8.0.40',
  aliPay: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 AlipayClient/10.5.16',
  taobao: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 AliApp(TB/10.3.20)',
  aliAppNotTb: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 AliApp(AP/10.5.16)',
  // 含 Adreno GPU 名不含 Android，防 /Adr/i 误命中
  adreno: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Adreno (TM) 660',
  // 部分第三方 WebView 用 Adr 简写替代 Android
  adrShort: 'Mozilla/5.0 (Linux; Adr 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
};

const setEnv = (userAgent, maxTouchPoints = 0) => {
  Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true });
  Object.defineProperty(window.navigator, 'maxTouchPoints', { value: maxTouchPoints, configurable: true });
};

describe('环境判断', () => {
  test('isIos iPhone 真、Android 假', () => {
    setEnv(UA.iphone);
    expect(appUtil.isIos()).toBe(true);
    setEnv(UA.android);
    expect(appUtil.isIos()).toBe(false);
  });

  test('isIos iPadOS 13+ 桌面 UA 借触点数识别，桌面 Mac 不误判', () => {
    setEnv(UA.ipadDesktop, 5);
    expect(appUtil.isIos()).toBe(true);
    setEnv(UA.ipadDesktop, 0);
    expect(appUtil.isIos()).toBe(false);
  });

  test('isAndroid Android 真、iPhone 假', () => {
    setEnv(UA.android);
    expect(appUtil.isAndroid()).toBe(true);
    setEnv(UA.iphone);
    expect(appUtil.isAndroid()).toBe(false);
  });

  test('isAndroid 命中 Adr 简写、不误命中 Adreno GPU 名', () => {
    setEnv(UA.adrShort);
    expect(appUtil.isAndroid()).toBe(true);
    setEnv(UA.adreno);
    expect(appUtil.isAndroid()).toBe(false);
  });

  test('isMobile iPhone 真、iPad 桌面 UA 真、桌面 Chrome 假', () => {
    setEnv(UA.iphone);
    expect(appUtil.isMobile()).toBe(true);
    setEnv(UA.ipadDesktop, 5);
    expect(appUtil.isMobile()).toBe(true);
    setEnv(UA.desktopChrome);
    expect(appUtil.isMobile()).toBe(false);
  });

  test('isWeChat 移动端与 PC 微信内置浏览器均真、系统浏览器假', () => {
    setEnv(UA.weChatAndroid);
    expect(appUtil.isWeChat()).toBe(true);
    setEnv(UA.weChatWindows);
    expect(appUtil.isWeChat()).toBe(true);
    setEnv(UA.desktopChrome);
    expect(appUtil.isWeChat()).toBe(false);
  });

  test('isAliPay 支付宝内置浏览器真、系统浏览器假', () => {
    setEnv(UA.aliPay);
    expect(appUtil.isAliPay()).toBe(true);
    setEnv(UA.desktopChrome);
    expect(appUtil.isAliPay()).toBe(false);
  });

  test('isTaobao 仅命中 AliApp(TB，其余 AliApp 前缀不命中', () => {
    setEnv(UA.taobao);
    expect(appUtil.isTaobao()).toBe(true);
    setEnv(UA.aliAppNotTb);
    expect(appUtil.isTaobao()).toBe(false);
  });
});

describe('alipay 容器交互', () => {
  afterEach(() => {
    window.AlipayJSBridge = undefined;
  });

  test('alipayJSBridgeReady 非函数抛 TypeError', () => {
    expect(() => appUtil.alipayJSBridgeReady()).toThrow(TypeError);
    expect(() => appUtil.alipayJSBridgeReady(null)).toThrow(TypeError);
  });

  test('容器已注入时同步直调且不传参', () => {
    window.AlipayJSBridge = { call: jest.fn() };
    const callback = jest.fn();
    appUtil.alipayJSBridgeReady(callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith();
  });

  test('容器未注入时监听 AlipayJSBridgeReady，触发后回调不透传事件对象', () => {
    const callback = jest.fn();
    appUtil.alipayJSBridgeReady(callback);
    expect(callback).not.toHaveBeenCalled();
    document.dispatchEvent(new Event('AlipayJSBridgeReady'));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith();
  });

  test('监听为 once，事件重复触发回调只执行第一次', () => {
    const callback = jest.fn();
    appUtil.alipayJSBridgeReady(callback);
    document.dispatchEvent(new Event('AlipayJSBridgeReady'));
    document.dispatchEvent(new Event('AlipayJSBridgeReady'));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('alipayTitle/alipayPopWindow/alipayExitApp 在容器就绪后转发对应指令', () => {
    const call = jest.fn();
    window.AlipayJSBridge = { call };
    appUtil.alipayTitle('标题', '副标题');
    appUtil.alipayPopWindow();
    appUtil.alipayExitApp();
    expect(call.mock.calls).toEqual([
      ['setTitle', { title: '标题', subtitle: '副标题' }],
      ['popWindow'],
      ['exitApp'],
    ]);
  });

  test('alipayTitle 未传 subtitle 时参数不携带该键', () => {
    const call = jest.fn();
    window.AlipayJSBridge = { call };
    appUtil.alipayTitle('标题');
    const [command, params] = call.mock.calls[0];
    expect(command).toBe('setTitle');
    expect(params).toEqual({ title: '标题' });
    // toEqual 会忽略值为 undefined 的键，键是否携带须用 in 单独断言
    expect('subtitle' in params).toBe(false);
  });

  test('alipayTitle 非字符串 title 抛 TypeError', () => {
    expect(() => appUtil.alipayTitle(123)).toThrow(TypeError);
    expect(() => appUtil.alipayTitle()).toThrow(TypeError);
  });
});
