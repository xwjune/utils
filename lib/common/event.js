"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 事件监听
 *
 * addEvent - 添加事件监听
 * removeEvent - 移除事件监听
 */

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
function addEvent(target, type, handler) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (target.addEventListener) {
    // DOM2.0
    target.addEventListener(type, handler, useCapture);
  } else if (target.attachEvent) {
    // IE5+
    target.attachEvent("on" + type, handler);
  } else {
    // DOM 0
    target["on" + type] = handler;
  }
}

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
function removeEvent(target, type, handler) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (target.removeEventListener) {
    // DOM2.0
    target.removeEventListener(type, handler, useCapture);
  } else if (target.detachEvent) {
    // IE5+
    target.detachEvent("on" + type, handler);
  } else {
    // DOM 0
    target["on" + type] = null;
  }
}

exports.default = {
  addEvent: addEvent,
  removeEvent: removeEvent
};