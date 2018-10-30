/**
 * app交互
 *
 * isIos - IOS环境判断
 * isAndroid - Android环境判断
 * isMobile - 移动端【手机、平板设备】环境判断
 * isWeChat - 微信客户端判断
 * isAliPay - 支付宝客户端判断
 * isTaobao - 淘宝客户端判断
 * alipayJSBridgeReady - 监听alipay容器初始化
 * alipayTitle - 支付宝设置标题
 * alipayPopWindow - 支付宝关闭当前页面
 * alipayExitApp - 支付宝退出当前应用
 */
class App {
  /**
   * IOS环境判断
   *
   * @return {Boolean} true-是，false-否
   */
  isIos = () => /CPU.+Mac OS X/i.test(navigator.userAgent);

  /**
   * Android环境判断
   *
   * @return {Boolean} true-是，false-否
   */
  isAndroid = () => /Android|Adr/i.test(navigator.userAgent);

  /**
   * 移动端【手机、平板设备】环境判断
   *
   * @return {Boolean} true-是，false-否
   */
  isMobile = () => /iPhone|iPad|iPod|Android|Mobile|SymbianOS|Windows Phone|BlackBerry|webOS/i.test(navigator.userAgent);

  /**
   * 微信客户端判断
   *
   * @return {Boolean} true-是，false-否
   */
  isWeChat = () => /MicroMessenger/i.test(navigator.userAgent);

  /**
   * 支付宝客户端判断
   *
   * @return {Boolean} true-是，false-否
   */
  isAliPay = () => /AlipayClient/i.test(navigator.userAgent);

  /**
   * 淘宝客户端判断
   *
   * @return {Boolean} true-是，false-否
   */
  isTaobao= () => /AliApp\(TB/i.test(navigator.userAgent);

  /**
   * 监听alipay容器初始化
   *
   * @param {Function} [callback] - 回调
   */
  alipayJSBridgeReady = (callback) => {
    if (window.AlipayJSBridge) {
    // 如果jsbridge已经注入则直接调用
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
   */
  alipayPopWindow = () => {
    this.alipayJSBridgeReady(() => {
      window.AlipayJSBridge.call('popWindow');
    });
  };

  /**
   * 支付宝退出当前应用
   */
  alipayExitApp = () => {
    this.alipayJSBridgeReady(() => {
      window.AlipayJSBridge.call('exitApp');
    });
  };
}

export default new App();
