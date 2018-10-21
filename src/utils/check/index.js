/**
 * 校验库
 *
 * phone【手机】、telPhone【座机】、email【邮箱】、postcode【邮编】、isNull【空判断】
 * hasChinese【中文】、hasFullChar【全角符号】、noChinese【非中文】、url、ip
 * idCard【身份证】
 */
class Check {
  /**
   * 手机
   * 格式：11位数字，首位非0
   */
  phone(v) {
    return /^1\d{10}$/.test(v);
  }

  /**
   * 座机
   * 格式：3-4位区号，7-8位直拨号码
   */
  telPhone(v) {
    return /^(\d{3,4}-?)?\d{7,8}$/.test(v);
  }

  /**
   * 邮箱
   * 格式：登录名@主机名.域名
   */
  email(v) {
    return /^.+@.+\..+/.test(v);
  }

  /**
   * 邮编
   * 格式：6位数字
   */
  postcode(v) {
    return /^\d{6}$/.test(v);
  }

  /**
   * 空校验
   * 格式：null/undefined/空字符串/'undefined'/'null'
   */
  isNull(v) {
    if (
      typeof v === 'undefined'
            || v === 'undefined'
            || v === null
            || v === 'null'
            || v === ''
    ) {
      return true;
    }
    return false;
  }

  /**
   * 判断中【日、韩】文字符（不包括标点符号）
   * u4e00-u9fbf: unicode CJK(中日韩)统一表意字符，u9fa5后至u9fbf为空
   * uF900-uFAFF: unicode CJK兼容象形文字，uFA2D后至uFAFF为空
   *
   */
  hasChinese(v) {
    return /[\u4e00-\u9fa5\uF900-\uFA2D]/.test(v);
  }

  /**
   * 是否含有全角符号
   *
   */
  hasFullChar(v) {
    return /[\uFF00-\uFFEF]/.test(v);
  }

  /**
   * 非中文
   *
   */
  // noChinese(v) {
  //   return /[^\u0000-\u00FF]/.test(v);
  // }

  /**
   * url
   *
   */
  url() {

  }

  /**
   * ip
   */
  ip() {

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
