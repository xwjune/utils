/**
 * app 交互
 *
 * isIos - IOS 环境判断
 * isAndroid - Android 环境判断
 * isMobile - 移动端【手机、平板设备】环境判断
 * isWeChat - 微信客户端判断
 * isAliPay - 支付宝客户端判断
 * isTaobao - 淘宝客户端判断
 * alipayJSBridgeReady - 监听 alipay 容器初始化
 * alipayTitle - 支付宝设置标题
 * alipayPopWindow - 支付宝关闭当前页面
 * alipayExitApp - 支付宝退出当前应用
 */

// iPadOS 13+ Safari 默认请求桌面 UA（Macintosh; Intel Mac OS X），不含 CPU/iPad 字样；
// 桌面 Mac 触点数为 0、iPad 报 5，借 maxTouchPoints 区分
const isIpadDesktopUa = () => /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1;

class App {
  /**
   * IOS 环境判断
   *
   * iPadOS 13+ 默认请求的桌面 UA 同样识别为 IOS
   *
   * @return {boolean} true-是，false-否
   * @example
   *
   * isIos(); // iPhone Safari
   * // => true
   *
   * isIos(); // iPad Safari（iPadOS 13+ 桌面 UA）
   * // => true
   *
   * isIos(); // Android Chrome
   * // => false
   */
  isIos = () => /CPU.+Mac OS X/i.test(navigator.userAgent) || isIpadDesktopUa();

  /**
   * Android 环境判断
   *
   * @return {boolean} true-是，false-否
   * @example
   *
   * isAndroid(); // Android Chrome
   * // => true
   *
   * isAndroid(); // iPhone Safari
   * // => false
   */
  // Adr 补 \b 边界，防误匹配 Adreno 等 GPU 名
  isAndroid = () => /Android|Adr\b/i.test(navigator.userAgent);

  /**
   * 移动端【手机、平板设备】环境判断
   *
   * iPadOS 13+ 默认请求的桌面 UA 同样识别为移动端
   *
   * @return {boolean} true-是，false-否
   * @example
   *
   * isMobile(); // iPhone Safari
   * // => true
   *
   * isMobile(); // iPad Safari（iPadOS 13+ 桌面 UA）
   * // => true
   *
   * isMobile(); // 桌面 Chrome
   * // => false
   */
  isMobile = () => /iPhone|iPad|iPod|Android|Mobile|SymbianOS|Windows Phone|BlackBerry|webOS/i.test(navigator.userAgent) || isIpadDesktopUa();

  /**
   * 微信客户端判断
   *
   * PC/Mac 微信内置浏览器同样返回 true，需限定移动端时配合 isMobile 使用
   *
   * @return {boolean} true-是，false-否
   * @example
   *
   * isWeChat(); // 微信内置浏览器
   * // => true
   *
   * isWeChat(); // 系统浏览器
   * // => false
   */
  isWeChat = () => /MicroMessenger/i.test(navigator.userAgent);

  /**
   * 支付宝客户端判断
   *
   * @return {boolean} true-是，false-否
   * @example
   *
   * isAliPay(); // 支付宝内置浏览器
   * // => true
   *
   * isAliPay(); // 系统浏览器
   * // => false
   */
  isAliPay = () => /AlipayClient/i.test(navigator.userAgent);

  /**
   * 淘宝客户端判断
   *
   * @return {boolean} true-是，false-否
   * @example
   *
   * isTaobao(); // 淘宝内置浏览器
   * // => true
   *
   * isTaobao(); // 系统浏览器
   * // => false
   */
  isTaobao = () => /AliApp\(TB/i.test(navigator.userAgent);

  /**
   * 监听 alipay 容器初始化
   *
   * 容器已注入时同步触发回调，否则监听 AlipayJSBridgeReady 事件后触发，两条路径均不传参，监听为 once 触发一次后自动移除。
   * 非支付宝容器中该事件不会触发，回调永不执行；callback 非函数抛 TypeError
   *
   * @param {Function} callback - 回调
   * @example
   *
   * alipayJSBridgeReady(() => {
   *   alipayTitle('标题'); // 容器就绪后再调用容器 API
   * });
   *
   * alipayJSBridgeReady(); // 非函数抛 TypeError
   * // => throw Error（alipayJSBridgeReady 只接受函数）
   */
  alipayJSBridgeReady = (callback) => {
    // 非函数回调在两条路径下均静默失效，显式拦截
    if (typeof callback !== 'function') {
      throw new TypeError('alipayJSBridgeReady 只接受函数');
    }
    if (window.AlipayJSBridge) {
      // jsbridge 已注入则直接调用
      callback();
    } else {
      // 未注入则监听注入完成事件；包一层避免把事件对象透传给回调，once 触发后自动移除
      document.addEventListener('AlipayJSBridgeReady', () => callback(), { once: true });
    }
  };

  /**
   * 支付宝设置标题
   *
   * title 非字符串不做隐式转换，直接抛 TypeError；subtitle 未传时不携带该键
   *
   * @param {string} title - 标题；非字符串抛 TypeError
   * @param {string} [subtitle] - 副标题；未传时不发送该字段
   * @example
   *
   * alipayTitle('标题', '副标题');
   *
   * alipayTitle(123); // 非字符串抛 TypeError
   * // => throw Error（alipayTitle 的 title 必须是字符串）
   */
  alipayTitle = (title, subtitle) => {
    // 非字符串（数字、null 等）没有可设置的标题，不隐式转换，显式拦截
    if (typeof title !== 'string') {
      throw new TypeError('alipayTitle 的 title 必须是字符串');
    }
    this.alipayJSBridgeReady(() => {
      // subtitle 未传时不携带该键，避免桥端把 undefined 序列化成 null 覆盖已有副标题
      const params = { title };
      if (subtitle !== undefined) {
        params.subtitle = subtitle;
      }
      window.AlipayJSBridge.call('setTitle', params);
    });
  };

  /**
   * 支付宝关闭当前页面
   *
   * @example
   *
   * alipayPopWindow(); // 关闭当前页面
   */
  alipayPopWindow = () => {
    this.alipayJSBridgeReady(() => {
      window.AlipayJSBridge.call('popWindow');
    });
  };

  /**
   * 支付宝退出当前应用
   *
   * @example
   *
   * alipayExitApp(); // 退出当前应用
   */
  alipayExitApp = () => {
    this.alipayJSBridgeReady(() => {
      window.AlipayJSBridge.call('exitApp');
    });
  };
}

export default new App();
