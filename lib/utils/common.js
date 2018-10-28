'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var Common = function Common() {
  (0, _classCallCheck3.default)(this, Common);

  this.generateUUID = function () {
    /* eslint-disable no-bitwise */
    /* eslint-disable no-mixed-operators */
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  };

  this.getParameter = function (name) {
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.search;

    var regexp = new RegExp('[?&]' + name + '=([^&]*)', 'ig');
    var result = regexp.exec(url);
    return result === null ? '' : decodeURIComponent(result[1]);
  };

  this.loadScript = function (url, callback) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
    if (script.readyState) {
      // IE
      script.onreadystatechange = function () {
        if (/loaded|complete/.test(script.readyState)) {
          script.onreadystatechange = null;
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      };
    } else {
      script.onload = function () {
        script.onload = null;
        if (callback && typeof callback === 'function') {
          callback();
        }
      };
    }
  };

  this.stopPropagation = function (evt) {
    if (!evt) return;
    if (evt.stopPropagation) {
      evt.stopPropagation();
    } else {
      // IE
      window.event.cancelBubble = true;
    }
  };

  this.preventDefault = function (evt) {
    if (!evt) return;
    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      // IE
      window.event.returnValue = false;
    }
  };

  this.addEvent = function (target, type, handler) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (target.addEventListener) {
      // DOM2.0
      target.addEventListener(type, handler, useCapture);
    } else if (target.attachEvent) {
      // IE5+
      target.attachEvent('on' + type, handler);
    } else {
      // DOM 0
      target['on' + type] = handler;
    }
  };

  this.removeEvent = function (target, type, handler) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (target.removeEventListener) {
      // DOM2.0
      target.removeEventListener(type, handler, useCapture);
    } else if (target.detachEvent) {
      // IE5+
      target.detachEvent('on' + type, handler);
    } else {
      // DOM 0
      target['on' + type] = null;
    }
  };
}
/**
 * 生成uuid
 *
 * @return uuid
 * @example
 *
 * generateUUID();
 * // => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
 */


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


/**
 * 动态加载js
 *
 * @param {String} url - js链接地址
 * @param {Function} [callback] - 回调
 */


/**
 * 阻止事件冒泡
 *
 * @param {Object} evt - event
 */


/**
 * 阻止事件默认行为
 *
 * @param {Object} evt - event
 */


/**
 * 添加事件监听
 *
 * @param {Element} target - DOM元素
 * @param {String} type - 事件类型
 * @param {Function} handler - 事件触发时执行的函数
 * @param {Boolean} [useCapture=false] - 指定事件是否在捕获或冒泡阶段执行【true-捕获，false-冒泡】
 */


/**
 * 移除事件监听
 *
 * @param {Element} target - DOM元素
 * @param {String} type - 事件类型
 * @param {Function} handler - 事件触发时执行的函数
 * @param {Boolean} [useCapture=false] - 指定事件是否在捕获或冒泡阶段执行【true-捕获，false-冒泡】
 */
;

exports.default = new Common();