/**
 * 通用方法
 *
 * generateUUID - 生成 uuid
 * getParameter - 获取 url 中的参数
 * loadScript - 动态加载 js
 * stopPropagation - 阻止事件冒泡
 * preventDefault - 阻止事件默认行为
 * addEvent - 添加事件监听
 * removeEvent - 移除事件监听
 * getWinHeight - 获取窗口可视区的高度
 * getWinWidth - 获取窗口可视区的宽度
 * getWinScrollHeight - 获取窗口可视区内容的总高度
 * getWinScrollWidth - 获取窗口可视区内容的总宽度
 * getWinScrollTop - 获取窗口可视区滚动条垂直偏移
 * getWinScrollLeft - 获取窗口可视区滚动条水平偏移
 * getElementOffset - 获取元素相对于文档的位置
 * selectText - 选中文本
 * getStyle - 获取元素样式
 */
import {
  addEvent,
  removeEvent,
} from './event';
import {
  getWinHeight,
  getWinWidth,
  getWinScrollHeight,
  getWinScrollWidth,
  getWinScrollTop,
  getWinScrollLeft,
  getElementOffset,
} from './document';
import selectText from './selectText';
import getStyle from './getStyle';

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

/**
 * 阻止事件冒泡
 *
 * @param {Object} evt - event
 * @example
 *
 * addEvent(button, 'click', (evt) => {
 *   stopPropagation(evt); // 只响应本层，不再冒泡到父级
 * });
 */
function stopPropagation(evt) {
  if (!evt) return;
  if (evt.stopPropagation) {
    evt.stopPropagation();
  } else {
  // IE
    window.event.cancelBubble = true;
  }
}

/**
 * 阻止事件默认行为
 *
 * @param {Object} evt - event
 * @example
 *
 * addEvent(form, 'submit', (evt) => {
 *   preventDefault(evt); // 拦截默认提交，改走自定义逻辑
 * });
 */
function preventDefault(evt) {
  if (!evt) return;
  if (evt.preventDefault) {
    evt.preventDefault();
  } else {
  // IE
    window.event.returnValue = false;
  }
}

export default {
  generateUUID,
  getParameter,
  loadScript,
  stopPropagation,
  preventDefault,
  addEvent,
  removeEvent,
  getWinHeight,
  getWinWidth,
  getWinScrollHeight,
  getWinScrollWidth,
  getWinScrollTop,
  getWinScrollLeft,
  getElementOffset,
  selectText,
  getStyle,
};
