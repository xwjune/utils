/**
 * 通用方法
 *
 * generateUUID - 生成 uuid
 * getParameter - 获取 url 中的参数
 * loadScript - 动态加载 js
 */

/**
 * 生成 uuid
 *
 * @return {string} uuid
 * @example
 *
 * generateUUID();
 * // => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
 */
function generateUUID() {
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
 * 获取 url 中的参数
 *
 * @param {string} name - 参数名
 * @param {string} [url=window.location.search] - 链接
 * @return {string} 参数值
 * @example
 *
 * getParameter('name', 'http://www.w3school.com?name=xxx');
 * // => xxx
 *
 * getParameter('name', 'http://www.w3school.com?name=');
 * // => ''
 *
 * getParameter('name', 'http://www.w3school.com');
 * // => null
 */
function getParameter(name, url = window.location.search) {
  const regexp = new RegExp(`[?&]${name}=([^&#]*)`, 'i');
  const result = regexp.exec(url);
  return result === null ? null : decodeURIComponent(result[1]);
}

/**
 * 动态加载 js
 *
 * @param {string} url - js 链接地址
 * @param {Function} [callback] - 回调
 * @example
 *
 * loadScript('https://xxx.js', () => {
 *  console.log('loaded');
 * });
 */
function loadScript(url, callback) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('charset', 'utf-8');
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script);
  if (script.readyState) {
  // IE
    script.onreadystatechange = () => {
      if (/loaded|complete/.test(script.readyState)) {
        script.onreadystatechange = null;
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    };
  } else {
    script.onload = () => {
      script.onload = null;
      if (callback && typeof callback === 'function') {
        callback();
      }
    };
  }
}

export default {
  generateUUID,
  getParameter,
  loadScript,
};
