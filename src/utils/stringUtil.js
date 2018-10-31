/**
 * 字符串操作
 *
 * isNull - 空校验
 * isNumber - 数字校验
 * filterNull - 空数据过滤
 * convertFenToYuan - 分转化成元
 * convertYuanToFen - 元转化为分
 */
class StringUtil {
  /**
   * 空校验
   * 空数据集合：undefined,'undefined',null,'null','(null)','NaN',''
   *
   * @param {String} str - 字符串
   * @return {Boolean} true-空，false-非空
   * @example
   *
   * isNull();
   * // => true
   *
   * isNull('undefined');
   * // => true
   */
  isNull = (str) => {
    if (
      typeof str === 'undefined'
      || str === 'undefined'
      || str === null
      || str === 'null'
      || str === '(null)'
      || str === 'NaN'
      || str === ''
    ) {
      return true;
    }
    return false;
  };

  /**
   * 数字校验
   *
   * @param {String} str - 字符串
   * @return {Boolean} true-数字，false-非数字
   * @example
   *
   * isNumber('20');
   * // => true
   *
   * isNumber('-20');
   * // => true
   *
   * isNumber('.2');
   * // => false
   */
  isNumber = (str) => /^-?\d+(\.\d+)?$/.test(str);

  /**
   * 空数据过滤
   *
   * @param {String} str - 字符串
   * @param {String} [format=''] - 格式化
   * @return {String} 过滤后的数据
   * @example
   *
   * filterNull('xxx');
   * // => xxx
   *
   * filterNull();
   * // =>
   *
   * filterNull(null, '--');
   * // => --
   */
  filterNull = (str, format = '') => {
    if (this.isNull(str)) {
      return format;
    }
    return str;
  };

  /**
   * 分->元
   *
   * @param {String} str - 分
   * @param {String} [format='0.00'] - 格式化
   * @return {String} 元
   * @example
   *
   * convertFenToYuan('2000');
   * // => 20.00
   *
   * convertFenToYuan();
   * // => 0.00
   *
   * convertFenToYuan(null, '--');
   * // => --
   */
  convertFenToYuan = (str, format = '0.00') => {
    if (!this.isNumber(str)) {
      return format;
    }
    return (parseInt(str, 10) / 100).toFixed(2);
  };

  /**
   * 元->分
   *
   * @param {String} str - 元
   * @param {String} [format='0'] - 格式化
   * @return {String} 分
   * @example
   *
   * convertYuanToFen('20');
   * // => 2000
   *
   * convertYuanToFen('0.02');
   * // => 2
   *
   * convertYuanToFen('0.002');
   * // => 0
   *
   * convertYuanToFen();
   * // => 0
   *
   * convertYuanToFen(null, '--');
   * // => --
   */
  convertYuanToFen = (str, format = '0') => {
    if (!this.isNumber(str)) {
      return format;
    }
    return parseInt(str * 100, 10).toString();
  };
}

export default new StringUtil();
