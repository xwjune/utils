/**
 * 事件操作
 *
 * addEvent - 添加事件监听
 * removeEvent - 移除事件监听
 * stopPropagation - 阻止事件冒泡
 * preventDefault - 阻止事件默认行为
 */

/**
 * 事件入参校验：addEvent/removeEvent 共用，保证两函数契约一致
 *
 * @param {*} target - 待校验的事件目标
 * @param {*} type - 待校验的事件类型（应传入 trim 后的值）
 * @param {*} handler - 待校验的回调
 * @returns {boolean} 三参均合法时为 true
 */
function isValidEventArgs(target, type, handler) {
  // target 必须是对象：原始类型（数字/字符串等）上挂属性会抛 TypeError
  if (!target || typeof target !== 'object') {
    return false;
  }
  // type 需为非空字符串，纯空白（'  '）视同未传
  if (typeof type !== 'string' || !type) {
    return false;
  }
  // handler 仅接受函数：{handleEvent} 监听对象 spec 合法但 IE8-/DOM0 分支不可用，从紧不支持
  return typeof handler === 'function';
}

/**
 * 添加事件监听
 *
 * 非法入参（target 非对象、type 非字符串或纯空白、handler 非函数）时不动作并返回 false；
 * 返回 true 仅代表入参合法并完成了挂载调用，不保证监听实际生效（DOM0 分支会覆盖已有监听）
 *
 * @param {EventTarget} target - 事件目标（元素、document、window 等）
 * @param {string} type - 事件类型，不带 on 前缀且区分大小写（'click' 而非 'onclick'/'Click'），首尾空白自动截去
 * @param {Function} handler - 事件触发时执行的函数，仅接受函数形式
 * @param {boolean} [useCapture=false] - 指定事件是否在捕获或冒泡阶段执行【true-捕获，false-冒泡】，仅 DOM2 分支生效
 * @returns {boolean} 是否执行了挂载调用
 * @example
 *
 * const handler = () => {
 *   console.log('onload');
 * };
 * addEvent(window, 'load', handler);
 */
function addEvent(target, type, handler, useCapture = false) {
  // 参数规范化：事件名截去首尾空白，' click ' 与 'click' 等价
  const evtType = typeof type === 'string' ? type.trim() : type;
  if (!isValidEventArgs(target, evtType, handler)) {
    return false;
  }
  if (typeof target.addEventListener === 'function') {
    // DOM2.0
    target.addEventListener(evtType, handler, useCapture);
  } else if (typeof target.attachEvent === 'function') {
    // IE8-：无捕获阶段，useCapture 不生效；回调内 this 指向 window、事件对象需取 window.event
    target.attachEvent(`on${evtType}`, handler);
  } else {
    // DOM 0：属性赋值，会顶掉该事件已有的 DOM0 handler
    target[`on${evtType}`] = handler;
  }
  return true;
}

/**
 * 移除事件监听
 *
 * 非法入参（target 非对象、type 非字符串或纯空白、handler 非函数）时不动作并返回 false；
 * 返回 true 仅代表入参合法并调用了移除 API，不感知是否命中已挂监听（如 capture 标志不一致时原生为静默 no-op）
 *
 * @param {EventTarget} target - 事件目标（元素、document、window 等）
 * @param {string} type - 事件类型，不带 on 前缀且区分大小写（'click' 而非 'onclick'/'Click'），首尾空白自动截去
 * @param {Function} handler - 事件触发时执行的函数，仅接受函数形式
 * @param {boolean} [useCapture=false] - 指定事件是否在捕获或冒泡阶段执行【true-捕获，false-冒泡】，需与挂载时一致
 * @returns {boolean} 是否执行了移除调用
 * @example
 *
 * const handler = () => {
 *   console.log('onload');
 * };
 * removeEvent(window, 'load', handler);
 */
function removeEvent(target, type, handler, useCapture = false) {
  // 参数规范化：事件名截去首尾空白，' click ' 与 'click' 等价
  const evtType = typeof type === 'string' ? type.trim() : type;
  if (!isValidEventArgs(target, evtType, handler)) {
    return false;
  }
  if (typeof target.removeEventListener === 'function') {
    // DOM2.0
    target.removeEventListener(evtType, handler, useCapture);
  } else if (typeof target.detachEvent === 'function') {
    // IE8-：useCapture 不生效
    target.detachEvent(`on${evtType}`, handler);
  } else {
    // DOM 0：置空会清掉该事件当前所有 DOM0 handler，无法只移除传入的这个
    target[`on${evtType}`] = null;
  }
  return true;
}

/**
 * 阻止事件冒泡
 *
 * IE8- 下 attachEvent 挂载的回调不接收 event 参数，可不传，未传时自动取 window.event；
 * 两者均取不到时抛 TypeError（如非事件分发期调用），不静默吞掉
 *
 * @param {Event} evt - 事件对象
 * @example
 *
 * addEvent(button, 'click', (evt) => {
 *   stopPropagation(evt); // 只响应本层，不再冒泡到父级
 * });
 */
function stopPropagation(evt) {
  // 参数归一化：IE8- attachEvent 回调无参，事件对象挂在 window.event 上
  const e = evt || window.event;
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    // IE8- 事件对象无 stopPropagation，置 cancelBubble 等效阻止冒泡
    e.cancelBubble = true;
  }
}

/**
 * 阻止事件默认行为
 *
 * IE8- 下 attachEvent 挂载的回调不接收 event 参数，可不传，未传时自动取 window.event；
 * 两者均取不到时抛 TypeError（如非事件分发期调用），不静默吞掉
 *
 * Chrome 等对 window/document 上的 touchstart/touchmove/wheel 默认按 passive
 * 处理：此函数无法取消其滚动等默认行为，仅 console 出现一条警告
 *
 * @param {Event} evt - 事件对象
 * @example
 *
 * addEvent(form, 'submit', (evt) => {
 *   preventDefault(evt); // 拦截默认提交，改走自定义逻辑
 * });
 *
 * // 反例：window 上的 touchmove 被 Chrome 默认按 passive 处理，无法取消滚动
 * addEvent(window, 'touchmove', (evt) => {
 *   preventDefault(evt); // 不生效，仅 console 一条警告；需原生 { passive: false } 挂载才可取消
 * });
 */
function preventDefault(evt) {
  // 参数归一化：IE8- attachEvent 回调无参，事件对象挂在 window.event 上
  const e = evt || window.event;
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    // IE8- 事件对象无 preventDefault，置 returnValue 为 false 等效取消默认行为
    e.returnValue = false;
  }
}

export default { addEvent, removeEvent, stopPropagation, preventDefault };
