/**
 * 非法字符校验
 * 非法字符集：【",\,\n,\t,\v】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 *
 * illegalChar('123\n123');
 * // => true
 */
export default function illegalChar(value) {
  return /["\\\n\t\v]/.test(value);
}
