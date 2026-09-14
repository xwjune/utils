/**
 * 获取元素样式
 *
 * currentStyle：IE、Opera（返回未经计算的相对值，如 50%、1em、auto）
 * getComputedStyle：FireFox、Chrome、Safari
 *
 * @param {Element} element - DOM 元素，空值时返回空串
 * @param {String} name - 样式名称，驼峰（fontSize）与连字符（font-size）均支持
 * @return {String} 样式值【最终样式优先，都不支持时回退内联 style】
 * @example
 *
 * getStyle(element, 'font-size'); // 读最终样式【含内联、嵌入、外部样式】
 * // => '14px'
 * getStyle(element, 'fontSize'); // 驼峰入参，与连字符等价
 */
export default function getStyle(element, name) {
  if (!element || !name) {
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
