/**
 * 文档操作
 *
 * 【环境】依赖浏览器 window/document，SSR/Node 中调用会抛错【引入不受影响】
 * 【兼容】滚动偏移优先 pageYOffset、内容尺寸优先 documentElement，取不到再逐级兜底到 body
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
 * innerHeight 口径含滚动条，回退的 clientHeight 口径不含【桌面端有可见滚动条时两者有差】
 *
 * @returns {number}
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
 * @returns {number}
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
 * @returns {number}
 * @example
 *
 * getWinScrollHeight(); // 内容总高度，长页面大于可视区高度
 * // => 2589
 */
export function getWinScrollHeight() {
  // documentElement 优先，取 0 视为老引擎取值失败，兜底 body
  return document.documentElement.scrollHeight || document.body.scrollHeight;
}

/**
 * 获取窗口可视区内容的总宽度
 *
 * @returns {number}
 * @example
 *
 * getWinScrollWidth(); // 内容总宽度，无横向溢出时等于可视区宽度
 * // => 375
 */
export function getWinScrollWidth() {
  // 同 getWinScrollHeight：documentElement 优先，取 0 兜底 body
  return document.documentElement.scrollWidth || document.body.scrollWidth;
}

/**
 * 获取窗口可视区滚动条垂直偏移
 *
 * @returns {number}
 * @example
 *
 * getWinScrollTop(); // 页面未滚动时
 * // => 0
 *
 * getWinScrollTop(); // 向下滚动 100px 后
 * // => 100
 */
export function getWinScrollTop() {
  // 优先 pageYOffset，老 IE 无此属性再走下方选择链
  if (typeof window.pageYOffset === 'number') {
    return window.pageYOffset;
  }
  // 选择链：标准模式滚动值挂 documentElement；怪异模式 documentElement 恒 0、滚动值挂 body
  return document.documentElement.scrollTop || document.body.scrollTop;
}

/**
 * 获取窗口可视区滚动条水平偏移
 *
 * @returns {number}
 * @example
 *
 * getWinScrollLeft(); // 页面未滚动时
 * // => 0
 */
export function getWinScrollLeft() {
  // 优先 pageXOffset，老 IE 无此属性再走下方选择链
  if (typeof window.pageXOffset === 'number') {
    return window.pageXOffset;
  }
  // 选择链：标准模式滚动值挂 documentElement；怪异模式 documentElement 恒 0、滚动值挂 body
  return document.documentElement.scrollLeft || document.body.scrollLeft;
}

/**
 * 获取元素相对于文档的位置
 *
 * 相对整份文档的坐标【getBoundingClientRect 是相对视口，不含页面滚动偏移】
 *
 * element 为空值或无 getBoundingClientRect 时返回 { top: 0, left: 0 }
 *
 * 返回的是视觉坐标：display:none 元素 rect 全 0，叠加滚动偏移后可能得到非 0；
 * position:fixed / transform 元素的坐标随变换与滚动变化，可能与布局位置不符
 *
 * @param {Element} element - DOM 元素，空值时返回 { top: 0, left: 0 }
 * @returns {Object} { top, left }
 * @example
 *
 * const offset = getElementOffset(element);
 * const left = offset.left;
 * const top = offset.top;
 */
export function getElementOffset(element) {
  // 空值守卫：null/undefined 或无 getBoundingClientRect 的入参（如字符串）返回原点，不抛 TypeError
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return { top: 0, left: 0 };
  }
  // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置（不包含页面看不见的部分）。
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top + getWinScrollTop(),
    left: rect.left + getWinScrollLeft(),
  };
}
