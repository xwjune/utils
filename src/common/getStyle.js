/**
 * 获取元素样式
 *
 * currentStyle：IE、Opera
 * getComputedStyle：FireFox、Chrome、Safari
 *
 * @param {Element} element - DOM 元素
 * @param {String} name - 样式名称
 * @return {String} 样式值【最终样式优先，都不支持时回退内联 style】
 * @example
 *
 * getStyle(element, 'font-size'); // 读最终样式【含内联、嵌入、外部样式】
 * // => '14px'
 */
export default function getStyle(element, name) {
  if (element.currentStyle) {
    return element.currentStyle[name];
  }
  if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(element, null).getPropertyValue(name);
  }
  return element.style[name];
}

// getComputedStyle 和 element.style 异同
// 1、element.style 读取的只是元素的内联样式，即写在元素的 style 属性上的样式；
//    而 getComputedStyle 读取的样式是最终样式，包括了内联样式、嵌入样式和外部样式。
// 2、element.style 既支持读也支持写，我们通过 element.style 即可改写元素的样式。
//    而 getComputedStyle 仅支持读并不支持写入。我们可以通过使用 getComputedStyle 读取样式，通过 element.style 修改样式
