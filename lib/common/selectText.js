"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = selectText;

/**
 * 选中文本
 *
 * @param {Element} textNode
 * @param {Number} [start=0] - 起始位置
 * @param {Number} [length] - 长度
 * @example
 *
 * 鼠标停留在‘元’前面
 * <input type="text" value="12元" />
 * selectText(document.querySelector('input'), 2, 0);
 *
 * 选中所有
 * <input type="text" value="123456" />
 * selectText(document.querySelector('input'));
 */
function selectText(textNode) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var length = arguments.length > 2 ? arguments[2] : undefined;

  if (typeof length === 'undefined') {
    length = textNode.value.length;
  }

  if (textNode.setSelectionRange) {
    // 非IE
    textNode.setSelectionRange(start, start + length);
  } else if (textNode.createTextRange) {
    // IE
    var range = textNode.createTextRange();
    range.collapse(true);
    range.moveStart('character', start);
    range.moveEnd('character', length);
    range.select();
  }

  textNode.focus();
}