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
export default function selectText(input, start = 0, length) {
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
