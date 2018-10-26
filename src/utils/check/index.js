/**
 * 校验库
 *
 * cellphone - 手机
 * telphone - 固定电话
 * phone - 电话【手机和固定电话】
 * email - 邮箱
 * postcode - 邮编
 * isNull - 空判断
 * isNumber - 数字判断
 * hasChinese - 中文
 */
class Check {
  /**
   * 手机
   * 格式：11位数字，首位1
   *
   * @param {*} value - The value to check
   * @return {Boolean} true-是，false-否
   * @example
   *
   * cellphone('13456789012');
   * // => true
   */
  cellphone = (value) => {
    return /^1\d{10}$/.test(value);
  };

  /**
   * 固定电话
   * 格式：3-4位区号，7-8位直拨号码
   *
   * @param {*} value - The value to check
   * @return {Boolean} true-是，false-否
   * @example
   *
   * telphone('0576-85735299');
   * // => true
   *
   * telphone('057685735299');
   * // => true
   */
  telphone = (value) => {
    return /^(\d{3,4}-?)?\d{7,8}$/.test(value);
  };

  /**
   * 电话【手机和固定电话】
   *
   * @param {*} vlaue - The value to check
   * @return {Boolean} true-是，false-否
   * @example
   *
   * phone('0576-85735299');
   * // => true
   *
   * phone('13456789012');
   * // => true
   */
  phone(value) {
    return this.cellphone(value) || this.telphone(value);
  }

  /**
   * 邮箱
   * 格式：登录名@主机名.域名
   *
   * @param {*} value - The value to check
   * @return {Boolean} true-是，false-否
   *
   * email('june@163.com');
   * // => true
   */
  email(value) {
    return /^[0-9a-zA-Z_]+@.+\..+(\..+)*/.test(value);
  }

  /**
   * 邮编
   * 格式：6位数字
   *
   * @param {*} value - The value to check
   * @return {Boolean} true-是，false-否
   *
   * postcode('310000');
   * // => true
   */
  postcode(value) {
    return /^\d{6}$/.test(value);
  }

  /**
   * 空校验
   * 空数据集合：undefined,'undefined',null,'null','(null)','NaN',''
   *
   * @param {*} value - The value to check
   * @return {Boolean} true-是，false-否
   * @example
   *
   * isNull();
   * // => true
   *
   * isNull('undefined');
   * // => true
   */
  isNull(value) {
    if (
      typeof value === 'undefined'
      || value === 'undefined'
      || value === null
      || value === 'null'
      || value === '(null)'
      || value === 'NaN'
      || value === ''
    ) {
      return true;
    }
    return false;
  }

  /**
   * 数字校验
   *
   * @param {*} value - The value to check
   * @return {Boolean} true-数字，false-非数字
   * @example
   *
   * isNumber('20');
   * // => true
   *
   * isNumber('.2');
   * // => false
   */
  isNumber(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
  }

  /**
   * 中文判断(常用字)
   *
   * @param {*} value - The value to check
   * @return {Boolean} true-是，false-否
   * @example
   *
   * hasChinese('中文');
   * // => true
   *
   * hasChinese('。');
   * // => true
   */
  hasChinese(value) {
    const pattern = [
      '\u2E80-\u2EFF', // CJK 部首补充
      '\u2F00-\u2FDF', // 康熙字典部首
      '\u2FF0-\u2FFF', // 表意文字描述符
      '\u3000-\u303F', // CJK 符号和标点
      '\u31C0-\u31EF', // CJK 笔画
      '\u3300-\u33FF', // CJK 兼容
      '\u3400-\u4DBF', // CJK 统一表意符号扩展 A
      '\u4E00-\u9FBF', // CJK 统一表意符号
      '\uF900-\uFAFF', // CJK 兼容象形文字
      '\uFE30-\uFE4F', // CJK 兼容形式
    ];
    const regexp = new RegExp(`[${pattern.join('')}]`);
    return regexp.test(value);
  }

  /**
   * 身份证
   * @param {boolean} strict 是否严格校验
   *
   * 非严格校验：18位，最后一位为数字或X
   *
   * 严格校验：
   * 地区码：
   *  11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
   *  21:"辽宁",22:"吉林",23:"黑龙江",
   *  31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
   *  41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",
   *  50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
   *  61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",
   *  71:"台湾",81:"香港",82:"澳门"
   * 加权因子：[ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
   *
   */
  // idCard(strict) {
  //   if (strict) {
  //     // 地区码
  //     const district = /(1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|(71|81|82)[1-9]{4}/;
  //   } else {
  //     // 非严格校验
  //     return /^\d{17}(\d|X)$/i.test(v);
  //   }
  // }
}

export default new Check();
