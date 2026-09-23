/**
 * DOM 视口与元素操作
 *
 * 【环境】视口测量（getWin 系列/getElementOffset）依赖浏览器 window/document，SSR/Node 中调用会抛错【引入不受影响】
 * 【兼容】滚动偏移优先 pageYOffset、内容尺寸优先 documentElement，取不到再逐级兜底到 body
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
function getWinHeight() {
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
function getWinWidth() {
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
function getWinScrollHeight() {
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
function getWinScrollWidth() {
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
function getWinScrollTop() {
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
function getWinScrollLeft() {
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
function getElementOffset(element) {
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

/**
 * 获取元素样式
 *
 * currentStyle：IE、Opera（返回未经计算的相对值，如 50%、1em、auto）
 * getComputedStyle：FireFox、Chrome、Safari
 *
 * @param {Element} element - DOM 元素，空值时返回空串
 * @param {string} name - 样式名称，驼峰（fontSize）与连字符（font-size）均支持，非字符串时返回空串
 * @return {string} 样式值【最终样式优先，都不支持时回退内联 style】
 * @example
 *
 * getStyle(element, 'font-size'); // 读最终样式【含内联、嵌入、外部样式】
 * // => '14px'
 * getStyle(element, 'fontSize'); // 驼峰入参，与连字符等价
 */
function getStyle(element, name) {
  // 非字符串 name（如 123、['color']）会在下方 replace 抛 TypeError，统一拦
  if (!element || typeof name !== 'string' || !name) {
    return '';
  }
  // 连字符转驼峰：currentStyle 与内联 style 仅认驼峰
  const camel = name.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
  if (element.currentStyle) {
    return element.currentStyle[camel] || '';
  }
  // typeof 防 SSR：无 document 时退内联 style
  if (typeof document !== 'undefined' && document.defaultView && document.defaultView.getComputedStyle) {
    // 驼峰转连字符：getPropertyValue 仅认 font-size 形式
    const kebab = name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    return document.defaultView.getComputedStyle(element, null).getPropertyValue(kebab);
  }
  return (element.style && element.style[camel]) || '';
}

// getComputedStyle 和 element.style 异同
// 1、element.style 读取的只是元素的内联样式，即写在元素的 style 属性上的样式；
//    而 getComputedStyle 读取的样式是最终样式，来源含内联、嵌入、外部样式表、继承与浏览器默认样式，
//    且相对值（如 2em）会被解析为计算值。
// 2、element.style 既支持读也支持写，我们通过 element.style 即可改写元素的样式。
//    而 getComputedStyle 仅支持读并不支持写入（写入抛 NoModificationAllowedError）。
//    我们可以通过使用 getComputedStyle 读取样式，通过 element.style 修改样式。

/**
 * 选中文本
 *
 * 仅支持 input、textarea；type=number 等无可选文本的 input 类型会抛 InvalidStateError
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} input - 输入框元素
 * @param {number} [start=0] - 起始位置
 * @param {number} [length] - 长度，缺省或传 null 时选中至末尾
 * @returns {boolean} 是否执行了选区，元素非 input/textarea 或 disabled 时为 false
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
function selectText(input, start = 0, length) {
  if (!input) {
    return false;
  }
  // 仅 input/textarea 有选区能力，其余元素（含 contenteditable）静默跳过
  if (input.tagName !== 'INPUT' && input.tagName !== 'TEXTAREA') {
    return false;
  }
  // disabled 无法聚焦，选区不可见
  if (input.disabled) {
    return false;
  }
  // 参数规范化：防字符串拼接（如 1 + '0' === '10'）与负数反选，非数字兜底为 0
  start = Math.max(Number(start) || 0, 0);
  if (length == null) { // 等价 length === undefined || length === null
    // 缺省选中至末尾：按起点截算长度，start 超出末尾时兜底为 0
    length = Math.max(input.value.length - start, 0);
  } else {
    length = Math.max(Number(length) || 0, 0);
  }
  // 先聚焦再设选区：iOS Safari 对未聚焦元素设选区不可靠
  input.focus();
  if (input.setSelectionRange) {
    // 主流浏览器
    input.setSelectionRange(start, start + length);
  } else if (input.createTextRange) {
    // IE 旧版本走 TextRange 回退：collapse 到起点后 moveStart 定起点，moveEnd 以起点为基准取长度
    const range = input.createTextRange();
    range.collapse(true);
    range.moveStart('character', start);
    range.moveEnd('character', length);
    range.select();
  }
  return true;
}

export default {
  getWinHeight,
  getWinWidth,
  getWinScrollHeight,
  getWinScrollWidth,
  getWinScrollTop,
  getWinScrollLeft,
  getElementOffset,
  getStyle,
  selectText,
};
