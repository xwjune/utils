/**
 * 身份证校验
 * 一代身份证【15位】：地址码【六位】出生日期码【六位】数字顺序码【三位】
 * 二代身份证【18位】：地址码【六位】出生日期码【八位】数字顺序码【三位】数字校验码【一位】
 *
 * 地址码 [1-9]\d{5}
 * 出生年份 [1-9]\d{3}
 * 出生月份 0[1-9]|1[0-2]
 * 出生日期 0[1-9]|[1-2]\d|3[0-1]
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * idCard('330000199001017865');
 * // => true
 *
 * idCard('33000019900101786X');
 * // => true
 *
 * idCard('330000900101786');
 * // => true
 */
export default function idCard(value) {
  const pattern = '^[1-9]\\d{7}(0[1-9]|1[0-2])(0[1-9]|[1-2]\\d|3[0-1])\\d{3}$'; // 一代身份证
  const pattern2 = '^[1-9]\\d{5}[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\\d|3[0-1])\\d{3}(\\d|X)$'; // 二代身份证
  const regexp = new RegExp(`${pattern}|${pattern2}`, 'i');
  return regexp.test(value);
}
