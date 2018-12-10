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
export function getWinHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

/**
 * 获取窗口可视区的宽度
 *
 * @returns {Number}
 */
export function getWinWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

/**
 * 获取窗口可视区内容的总高度
 *
 * @returns {Number}
 */
export function getWinScrollHeight() {
  return document.documentElement.scrollHeight || document.body.scrollHeight;
}

/**
 * 获取窗口可视区内容的总宽度
 *
 * @returns {Number}
 */
export function getWinScrollWidth() {
  return document.documentElement.scrollWidth || document.body.scrollWidth;
}

/**
 * 获取窗口可视区滚动条垂直偏移
 *
 * @returns {Number}
 */
export function getWinScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

/**
 * 获取窗口可视区滚动条水平偏移
 *
 * @returns {Number}
 */
export function getWinScrollLeft() {
  return document.documentElement.scrollLeft || document.body.scrollLeft;
}
