/**
 * 通用方法
 *
 * generateUUID - 生成uuid
 * getParameter - 获取url中的参数
 * loadScript - 动态加载js
 * stopPropagation - 阻止事件冒泡
 * preventDefault - 阻止事件默认行为
 * addEvent - 添加事件监听
 * removeEvent - 移除事件监听
 */
class Common {
  /**
   * 生成uuid
   *
   * @return uuid
   * @example
   *
   * generateUUID();
   * // => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
   */
  generateUUID = () => {
    /* eslint-disable no-bitwise */
    /* eslint-disable no-mixed-operators */
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  /**
   * 获取url中的参数
   *
   * @param {String} name - 参数名
   * @param {String} [url=window.location.search] - 链接
   * @return {String} 参数值
   * @example
   *
   * getParameter('name', 'http://www.w3school.com?name=xxx');
   * // => xxx
   */
  getParameter = (name, url = window.location.search) => {
    const regexp = new RegExp(`[?&]${name}=([^&]*)`, 'ig');
    const result = regexp.exec(url);
    return result === null ? '' : decodeURIComponent(result[1]);
  };

  /**
   * 动态加载js
   *
   * @param {String} url - js链接地址
   * @param {Function} [callback] - 回调
   * @example
   *
   * loadScript('https://xxx.js', () => {
   *  console.log('loaded');
   * });
   */
  loadScript = (url, callback) => {
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
  };

  /**
   * 阻止事件冒泡
   *
   * @param {Object} evt - event
   * @example
   *
   * stopPropagation(event);
   */
  stopPropagation = (evt) => {
    if (!evt) return;
    if (evt.stopPropagation) {
      evt.stopPropagation();
    } else {
    // IE
      window.event.cancelBubble = true;
    }
  };

  /**
   * 阻止事件默认行为
   *
   * @param {Object} evt - event
   * @example
   *
   * preventDefault(event);
   */
  preventDefault = (evt) => {
    if (!evt) return;
    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
    // IE
      window.event.returnValue = false;
    }
  };

  /**
   * 添加事件监听
   *
   * @param {Element} target - DOM元素
   * @param {String} type - 事件类型
   * @param {Function} handler - 事件触发时执行的函数
   * @param {Boolean} [useCapture=false] - 指定事件是否在捕获或冒泡阶段执行【true-捕获，false-冒泡】
   * @example
   *
   * const handler = () => {
   *   console.log('onload');
   * };
   * addEvent(window, 'load', handler);
   */
  addEvent = (target, type, handler, useCapture = false) => {
    if (target.addEventListener) {
    // DOM2.0
      target.addEventListener(type, handler, useCapture);
    } else if (target.attachEvent) {
    // IE5+
      target.attachEvent(`on${type}`, handler);
    } else {
    // DOM 0
      target[`on${type}`] = handler;
    }
  };

  /**
   * 移除事件监听
   *
   * @param {Element} target - DOM元素
   * @param {String} type - 事件类型
   * @param {Function} handler - 事件触发时执行的函数
   * @param {Boolean} [useCapture=false] - 指定事件是否在捕获或冒泡阶段执行【true-捕获，false-冒泡】
   * @example
   *
   * const handler = () => {
   *   console.log('onload');
   * };
   * removeEvent(window, 'load', handler);
   */
  removeEvent = (target, type, handler, useCapture = false) => {
    if (target.removeEventListener) {
    // DOM2.0
      target.removeEventListener(type, handler, useCapture);
    } else if (target.detachEvent) {
    // IE5+
      target.detachEvent(`on${type}`, handler);
    } else {
    // DOM 0
      target[`on${type}`] = null;
    }
  };
}

export default new Common();
