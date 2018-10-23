/**
 * 通用方法
 *
 * generateUUID - 生成uuid
 * getParameter - 获取url中的参数
 */
class Common {
  /**
   * 生成uuid
   *
   * @return uuid
   * @example
   *
   * generateUUID()
   * // => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
   */
  generateUUID() {
    /* eslint-disable no-bitwise */
    /* eslint-disable no-mixed-operators */
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  /**
   * 获取url中的参数
   *
   * @param {String} name - 参数名
   * @param {String} [url=window.location.search] - 链接
   * @return {String} 参数值
   * @example
   *
   * getParameter('name', 'http://www.w3school.com?name=xxx')
   * // => xxx
   */
  getParameter(name, url = window.location.search) {
    const reg = new RegExp(`[?&]${name}=([^&]*)`, 'ig');
    const r = reg.exec(url);
    return r === null ? '' : decodeURIComponent(r[1]);
  }
}

export default new Common();
