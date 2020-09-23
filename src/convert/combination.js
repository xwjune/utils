/**
 * 列出n个数组所有组合
 *
 * @param {array} arr - 原始数组
 * @returns {array}
 * @example
 *
 * const arr = [
 *   ['黑色', '白色'],
 *   ['64G', '128G'],
 *   ['国行', '港行'],
 *   ['全网通'],
 * ];
 * combination(arr);
 * // => [
 *  ['黑色', '64G', '国行', '全网通'],
 *  ['黑色', '64G', '港行', '全网通'],
 *  ['黑色', '128G', '国行', '全网通'],
 *  ['黑色', '128G', '港行', '全网通'],
 *  ['白色', '64G', '国行', '全网通'],
 *  ['白色', '64G', '港行', '全网通'],
 *  ['白色', '128G', '国行', '全网通'],
 *  ['白色', '128G', '港行', '全网通'],
 * ]
 */
export default function combination(arr) {
  return arr.reduce((total, cur) => {
    const res = [];
    total.forEach((_total) => {
      cur.forEach((_cur) => {
        res.push([..._total, _cur]);
      });
    });
    return res;
  }, [[]]);
}
