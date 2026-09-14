/**
 * 文档操作
 *
 * getWinHeight - 获取窗口可视区的高度
 * getWinWidth - 获取窗口可视区的宽度
 * getWinScrollHeight - 获取窗口可视区内容的总高度
 * getWinScrollWidth - 获取窗口可视区内容的总宽度
 * getWinScrollTop - 获取窗口可视区滚动条垂直偏移
 * getWinScrollLeft - 获取窗口可视区滚动条水平偏移
 * getElementOffset - 获取元素相对于文档的位置
 */

/**
 * 获取窗口可视区的高度
 *
 * @returns {Number}
 * @example
 *
 * getWinHeight(); // 可视区高度【像素，随窗口大小变化】
 * // => 667
 */
export function getWinHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

/**
 * 获取窗口可视区的宽度
 *
 * @returns {Number}
 * @example
 *
 * getWinWidth(); // 可视区宽度【像素，随窗口大小变化】
 * // => 375
 */
export function getWinWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

/**
 * 获取窗口可视区内容的总高度
 *
 * @returns {Number}
 * @example
 *
 * getWinScrollHeight(); // 内容总高度，长页面大于可视区高度
 * // => 2589
 */
export function getWinScrollHeight() {
  return document.documentElement.scrollHeight || document.body.scrollHeight;
}

/**
 * 获取窗口可视区内容的总宽度
 *
 * @returns {Number}
 * @example
 *
 * getWinScrollWidth(); // 内容总宽度，无横向溢出时等于可视区宽度
 * // => 375
 */
export function getWinScrollWidth() {
  return document.documentElement.scrollWidth || document.body.scrollWidth;
}

/**
 * 获取窗口可视区滚动条垂直偏移
 *
 * @returns {Number}
 * @example
 *
 * getWinScrollTop(); // 页面未滚动时
 * // => 0
 *
 * getWinScrollTop(); // 向下滚动 100px 后
 * // => 100
 */
export function getWinScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

/**
 * 获取窗口可视区滚动条水平偏移
 *
 * @returns {Number}
 * @example
 *
 * getWinScrollLeft(); // 页面未滚动时
 * // => 0
 */
export function getWinScrollLeft() {
  return document.documentElement.scrollLeft || document.body.scrollLeft;
}

/**
 * 获取元素相对于文档的位置
 *
 * 相对整份文档的坐标【getBoundingClientRect 是相对视口，不含页面滚动偏移】
 *
 * @param {Element} element - DOM 元素
 * @returns {Object} { top, left }
 * @example
 *
 * const offset = getElementOffset(element);
 * const left = offset.left;
 * const top = offset.top;
 */
export function getElementOffset(element) {
  // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置（不包含页面看不见的部分）。
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
  };
}
