/**
 * 数据容量单位换算
 *
 * @param {number|string} bytes - 数据容量
 * @param {Object} options - 配置参数
 * @param {number} [options.fractionDigits=1] - 保留小数位数
 * @param {string} [options.format] - 空数据格式化，缺省按保留位数渲染零值
 * @returns {string}
 * @example
 *
 * bytesToSize(10240);
 * // => 10.0KB
 *
 * bytesToSize(1024 * 1024, { fractionDigits: 2 });
 * // => 1.00MB
 *
 * bytesToSize(1024 * 1023); // 未达 1MB 仍用 KB 计
 * // => 1023.0KB
 *
 * bytesToSize(''); // 空数据缺省占位，按保留位数渲染零值
 * // => 0.0B
 *
 * bytesToSize('', { fractionDigits: 2 }); // 占位随保留位数
 * // => 0.00B
 *
 * bytesToSize(null, { format: '--' }); // 空数据显式占位
 * // => --
 *
 * bytesToSize('32g');
 * // => 数据错误
 *
 * bytesToSize(-10); // 负数是错误数据
 * // => 数据错误
 *
 * bytesToSize(0); // 0 是有效容量，不取占位
 * // => 0.0B
 *
 * bytesToSize(0.5); // 小数是错误数据【容量按字节计数必为整数】
 * // => 数据错误
 *
 * bytesToSize(NaN); // 非有限数字
 * // => 数据错误
 */
import isNull from '../check/isNull';
import { isNumber } from '../check/number';

const k = 1024; // 单位进率
const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB']; // 容量单位表

export default function bytesToSize(bytes, options = {}) {
  const {
    fractionDigits, // 保留小数位数
    format, // 空数据格式化
  } = options || {}; // options 显式传 null 时解构会抛 TypeError，兜底为空对象

  if (isNull(bytes)) {
    // 缺省占位与零值同款渲染，复用自身转换【fractionDigits 原样透传】
    return format !== undefined ? format : bytesToSize(0, { fractionDigits });
  }
  // 仅接受数字与数字字面量字符串
  if (!isNumber(bytes)) {
    return '数据错误';
  }
  // 字符串入参先归一为数字，后续统一按数字处理
  const num = Number(bytes);
  // 错误数据：负数、非整数【容量按字节计数必为整数；0 是有效容量】
  if (!Number.isInteger(num) || num < 0) {
    return '数据错误';
  }

  // 保留位数仅接受 0-100 的整数【原生 toFixed 合法区间，越界其抛 RangeError】，非法值回退默认 1
  const decimal = Number.isInteger(fractionDigits)
    && fractionDigits >= 0 && fractionDigits <= 100 ? fractionDigits : 1;

  // 单位指数不用对数商 Math.log(bytes) / Math.log(k) 求：舍入误差会把边界下方几个 ulp 的值越级抬一档，
  // 如 1024 ** 5 - 2 得指数 5、显示 1.0PB【实差 2 字节到 1PB】；逐级除以 1024 是 2 的幂除法，精确无舍入
  let size = num;
  let i = 0;
  while (size >= k && i < units.length - 1) {
    size /= k;
    i += 1;
  }
  return `${size.toFixed(decimal)}${units[i]}`;
}
