/**
 * app交互
 *
 * isIos - iOS环境判断
 * isAndroid - Android环境判断
 * isWeChat - 微信客户端判断
 * isAliPay - 支付宝客户端判断
 * isTaobao - 淘宝客户端判断
 * isPc - PC环境判断
 */
class App {
  /**
   * iOS环境判断
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
   * PC环境判断
   *
   * @return {Boolean} true-是，false-否
   */
  isPc = () => !/Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/i.test(navigator.userAgent);
}

export default new App();
