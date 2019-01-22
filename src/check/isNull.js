/**
 * 空数据校验
 * 空数据集合：undefined, null, ''
 *
 * @param {*} value - The value to check.
 * @param {Array} [others=[]] - The other empty data set.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNull();
 * // => true
 *
 * isNull('null', ['null', '(null)']);
 * // => true
 */
export default function isNull(value, others = []) {
  const sets = [undefined, null, ''];
  if (others.length > 0) {
    sets.push(...others);
  }

  return sets.includes(value);
}
