"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.getWinHeight = getWinHeight;
exports.getWinWidth = getWinWidth;
exports.getWinScrollHeight = getWinScrollHeight;
exports.getWinScrollWidth = getWinScrollWidth;
exports.getWinScrollTop = getWinScrollTop;
exports.getWinScrollLeft = getWinScrollLeft;

/**
 * 文档操作
 *
 * getWinHeight - 获取窗口可视区的高度
 * getWinWidth - 获取窗口可视区的宽度
 * getWinScrollHeight - 获取窗口可视区内容的总高度
 * getWinScrollWidth - 获取窗口可视区内容的总宽度
 * getWinScrollTop - 获取窗口可视区滚动条垂直偏移
 * getWinScrollLeft - 获取窗口可视区滚动条水平偏移
 */

/**
 * 获取窗口可视区的高度
 *
 * @returns {Number}
 */
function getWinHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
/**
 * 获取窗口可视区的宽度
 *
 * @returns {Number}
 */


function getWinWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}
/**
 * 获取窗口可视区内容的总高度
 *
 * @returns {Number}
 */


function getWinScrollHeight() {
  return document.documentElement.scrollHeight || document.body.scrollHeight;
}
/**
 * 获取窗口可视区内容的总宽度
 *
 * @returns {Number}
 */


function getWinScrollWidth() {
  return document.documentElement.scrollWidth || document.body.scrollWidth;
}
/**
 * 获取窗口可视区滚动条垂直偏移
 *
 * @returns {Number}
 */


function getWinScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}
/**
 * 获取窗口可视区滚动条水平偏移
 *
 * @returns {Number}
 */


function getWinScrollLeft() {
  return document.documentElement.scrollLeft || document.body.scrollLeft;
}