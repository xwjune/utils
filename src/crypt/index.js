/**
 * base64加密/解密【用于暴露在url中的重要参数】
 * 索引表已做特殊处理
 *
 * encode - 加密
 * decode - 解密
 */
/* eslint-disable no-bitwise */

// 索引表
// ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
const keyStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_=';

// UTF-8 encoding
function utf8Encode(value) {
  let utftext = '';
  const string = value.replace(/\r\n/g, '\n');

  for (let n = 0, len = string.length; n < len; n++) {
    const c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
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

// UTF-8 decoding
function utf8Decode(utftext) {
  let string = '';
  let i = 0;
  let c = 0;
  let c2 = 0;
  let c3 = 0;

  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
}

class Crypt {
  /**
   * 加密
   *
   * @param {String} value - 需要加密的数据
   * @return {String} 已加密的数据
   * @example
   *
   * encode('123456');
   * // => CJ8pD3Ks
   */
  encode = (value) => {
    let output = '';
    let chr1;
    let chr2;
    let chr3;
    let enc1;
    let enc2;
    let enc3;
    let enc4;
    let i = 0;
    const input = utf8Encode(value);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (Number.isNaN(chr2)) {
        enc3 = 64;
        enc4 = 64;
      } else if (Number.isNaN(chr3)) {
        enc4 = 64;
      }
      output = output
        + keyStr.charAt(enc1)
        + keyStr.charAt(enc2)
        + keyStr.charAt(enc3)
        + keyStr.charAt(enc4);
    }
    return output;
  };

  /**
   * 解密
   *
   * @param {String} value - 需要解密的数据
   * @return {String} 已解密的数据
   * @example
   *
   * decode('CJ8pD3Ks');
   * // => 123456
   */
  decode = (value) => {
    let output = '';
    let chr1;
    let chr2;
    let chr3;
    let enc1;
    let enc2;
    let enc3;
    let enc4;
    let i = 0;
    const input = value.replace(/[^A-Za-z0-9\-_=]/g, '');

    while (i < input.length) {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output += String.fromCharCode(chr1);
      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }
    output = utf8Decode(output);
    return output;
  };
}

export default new Crypt();
