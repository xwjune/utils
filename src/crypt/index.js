/**
 * base64加密/解密【用于暴露在url中的重要参数】
 * 索引表已做特殊处理，非标准 base64【仅本模块 encode/decode 可互解，勿跨系统使用】
 * 特殊处理的用意：字符顺序相对标准表整体重排、+/ 替换为 url 安全的 -_，
 *  标准 atob/base64 解本模块密文只会得到乱码，避免 url 中的重要参数被轻易识别、解码
 *  【字符表混淆而非加密：索引表明文在源码中，防的是随手解码，不防有心人】
 * 代理对（emoji 等）按 CESU-8 式拆分编码，自编自解 round-trip 无损
 *
 * encode - 加密
 * decode - 解密
 */
/* eslint-disable no-bitwise */

// 索引表（62 个有效字符 + 末位 = 作填充符），全部为 URL 安全字符
// 标准 base64 索引表：ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
const keyStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_=';
// 填充符 = 在索引表中的下标
const PAD = 64;

// 反查表：字符编码 -> 索引【decode 用，免去逐字符 indexOf 的 O(64) 线性扫描】
const keyMap = {};
for (let i = 0; i < keyStr.length; i++) {
  keyMap[keyStr.charCodeAt(i)] = i;
}

// UTF-8 encoding【按 UTF-16 代码单元逐个处理，与下方 utf8Decode 对称】
function utf8Encode(string) {
  let utftext = '';

  for (let n = 0, len = string.length; n < len; n++) {
    const c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c < 2048) {
      utftext += String.fromCharCode((c >> 6) | 192);
      utftext += String.fromCharCode((c & 63) | 128);
    } else {
      utftext += String.fromCharCode((c >> 12) | 224);
      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
      utftext += String.fromCharCode((c & 63) | 128);
    }
  }
  return utftext;
}

// UTF-8 decoding【畸形序列（截断、孤立延续字节）以 U+FFFD 替换，不产出 NaN 拼接的乱码】
function utf8Decode(utftext) {
  let string = '';
  let i = 0;

  while (i < utftext.length) {
    const c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i += 1;
    } else if (c > 191 && c < 224) {
      const c2 = utftext.charCodeAt(i + 1);
      // 延续字节缺失（charCodeAt 越界得 NaN，位运算按 0 处理）或非 10xxxxxx 开头，按坏序列处理
      if ((c2 & 192) === 128) {
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        string += '�';
        i += 1;
      }
    } else if (c > 223) {
      const c2 = utftext.charCodeAt(i + 1);
      const c3 = utftext.charCodeAt(i + 2);
      if ((c2 & 192) === 128 && (c3 & 192) === 128) {
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      } else {
        string += '�';
        i += 1;
      }
    } else {
      // 128-191：孤立的延续字节
      string += '�';
      i += 1;
    }
  }
  return string;
}

/**
 * 加密
 *
 * @param {String} value - 需要加密的数据；非字符串抛 TypeError
 * @return {String} 已加密的数据（round-trip 无损，换行等控制字符原样保留）
 * @example
 *
 * encode('123456');
 * // => CJ8pD3Ks
 */
function encode(value) {
  // 非字符串（数字、null 等）没有可编码的字面量，不隐式转换，显式拦截
  if (typeof value !== 'string') {
    throw new TypeError('encode 只接受字符串');
  }
  let output = '';
  let i = 0;
  const input = utf8Encode(value);

  while (i < input.length) {
    const chr1 = input.charCodeAt(i++);
    const chr2 = input.charCodeAt(i++);
    const chr3 = input.charCodeAt(i++);
    // 末组不足 3 字节时，charCodeAt 越界得 NaN（位运算按 0 处理），低两位补填充符
    const enc3 = Number.isNaN(chr2) ? PAD : ((chr2 & 15) << 2) | (chr3 >> 6);
    const enc4 = Number.isNaN(chr3) ? PAD : chr3 & 63;
    output += keyStr.charAt(chr1 >> 2)
      + keyStr.charAt(((chr1 & 3) << 4) | (chr2 >> 4))
      + keyStr.charAt(enc3)
      + keyStr.charAt(enc4);
  }
  return output;
}

/**
 * 解密
 *
 * @param {String} value - 需要解密的数据；非字符串抛 TypeError。
 *  非法字符（空白等）会被剔除，但剔除后须为合法密文：
 *  长度为 4 的倍数、= 仅作末尾 1-2 位填充，否则抛 Error【残缺密文静默解出乱码更危险】
 * @return {String} 已解密的数据【密文结构合法但字节流畸形时，坏序列以 U+FFFD 替换，不抛错】
 * @example
 *
 * decode('CJ8pD3Ks');
 * // => 123456
 */
function decode(value) {
  // 非字符串显式拦截，避免 replace 抛裸 TypeError
  if (typeof value !== 'string') {
    throw new TypeError('decode 只接受字符串');
  }
  // 只保留索引表字符（URL 传输混入的空白、+、% 等 URL 痕迹直接剔除）
  const input = value.replace(/[^0-9A-Za-z\-_=]/g, '');

  // 缺失位若继续解，会被 indexOf('') === 0 当作 '0' 解出 NUL 等乱码，这里主动拦截；
  // encode 的填充只出现在末组，至多 2 个 =
  const body = input.replace(/=+$/, '');
  if (input.length % 4 !== 0 || body.indexOf('=') !== -1 || input.length - body.length > 2) {
    throw new Error('decode 收到非法密文');
  }

  let output = '';
  let i = 0;

  while (i < input.length) {
    const enc1 = keyMap[input.charCodeAt(i++)];
    const enc2 = keyMap[input.charCodeAt(i++)];
    const enc3 = keyMap[input.charCodeAt(i++)];
    const enc4 = keyMap[input.charCodeAt(i++)];
    output += String.fromCharCode((enc1 << 2) | (enc2 >> 4));
    if (enc3 !== PAD) {
      output += String.fromCharCode(((enc2 & 15) << 4) | (enc3 >> 2));
    }
    if (enc4 !== PAD) {
      output += String.fromCharCode(((enc3 & 3) << 6) | enc4);
    }
  }
  return utf8Decode(output);
}

export default { encode, decode };
