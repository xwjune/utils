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
class App {
  /**
   * IOS 环境判断
   *
   * @return {Boolean} true-是，false-否
   * @example
   *
   * isIos(); // iPhone Safari
   * // => true
   *
   * isIos(); // Android Chrome
   * // => false
   */
  isIos = () => /CPU.+Mac OS X/i.test(navigator.userAgent);

  /**
   * Android 环境判断
   *
   * @return {Boolean} true-是，false-否
   * @example
   *
   * isAndroid(); // Android Chrome
   * // => true
   *
   * isAndroid(); // iPhone Safari
   * // => false
   */
  isAndroid = () => /Android|Adr/i.test(navigator.userAgent);

  /**
   * 移动端【手机、平板设备】环境判断
   *
   * @return {Boolean} true-是，false-否
   * @example
   *
   * isMobile(); // iPhone Safari
   * // => true
   *
   * isMobile(); // 桌面 Chrome
   * // => false
   */
  isMobile = () => /iPhone|iPad|iPod|Android|Mobile|SymbianOS|Windows Phone|BlackBerry|webOS/i.test(navigator.userAgent);

  /**
   * 微信客户端判断
   *
   * @return {Boolean} true-是，false-否
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
   * @return {Boolean} true-是，false-否
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
   * @return {Boolean} true-是，false-否
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
   * @param {Function} [callback] - 回调
   * @example
   *
   * alipayJSBridgeReady(() => {
   *   alipayTitle('标题'); // 容器就绪后再调用容器 API
   * });
   */
  alipayJSBridgeReady = (callback) => {
    if (window.AlipayJSBridge) {
    // 如果 jsbridge 已经注入则直接调用
      if (callback) {
        callback();
      }
    } else {
    // 如果没有注入则监听注入的事件
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  };

  /**
   * 支付宝设置标题
   *
   * @param {String} title - 标题
   * @param {String} [subtitle] - 副标题
   * @example
   *
   * alipayTitle('标题', '副标题');
   */
  alipayTitle = (title, subtitle) => {
    this.alipayJSBridgeReady(() => {
      window.AlipayJSBridge.call('setTitle', {
        title,
        subtitle,
      });
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
