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
  // 初始值 [[]] 代表"一个空组合"，之后逐组把选项并入
  return arr.reduce(
    // 每个已有组合 × 当前组每个选项，各自生成一个扩展后的新组合
    (combos, options) => combos.flatMap((combo) => options.map((item) => [...combo, item])),
    [[]],
  );
}
