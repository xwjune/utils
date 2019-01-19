/**
 * 汉字与拼音互转
 *
 * getPinyin - 根据汉字获取拼音
 * getCityPinyin - 获取城市拼音【城市多音字已处理】
 * getHanzi - 单个拼音转汉字
 */
import dictionary from './dictionary';
import dictCity from './dict_city_polyphone';

// 汉字与拼音映射表
const dictWithtone = {};
// 拼音与汉字映射表
const dictPy2hz = {};
// 声调映射表
const toneMap = {
  ā: 'a1',
  á: 'a2',
  ǎ: 'a3',
  à: 'a4',
  ō: 'o1',
  ó: 'o2',
  ǒ: 'o3',
  ò: 'o4',
  ē: 'e1',
  é: 'e2',
  ě: 'e3',
  è: 'e4',
  ī: 'i1',
  í: 'i2',
  ǐ: 'i3',
  ì: 'i4',
  ū: 'u1',
  ú: 'u2',
  ǔ: 'u3',
  ù: 'u4',
  ü: 'v0',
  ǖ: 'v1',
  ǘ: 'v2',
  ǚ: 'v3',
  ǜ: 'v4',
  ń: 'n2',
  ň: 'n3',
  '': 'm2'
};

/**
 * 去除拼音中的声调
 *
 * @param {String} pinyin - 需要转换的拼音
 * @returns {String} 去除声调的拼音
 * @example
 *
 * removeTone('xiǎo míng tóng xué');
 * // => xiao ming tong xue
 */
function removeTone(pinyin) {
  return pinyin.replace(/[āáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜńň]/g, (m) => toneMap[m][0]);
}

/**
 * 初始化
 */
function parseDict() {
  const temp = dictionary.split(',');
  for (let i = 0, len = temp.length; i < len; i++) {
    Object.assign(dictWithtone, {
      [String.fromCharCode(i + 19968)]: temp[i],
    });
  }
  // 将字典文件解析成拼音->汉字的结构
  const notone = removeTone(dictionary).split(',');
  for (let i = 0, len = notone.length; i < len; i++) {
    Object.assign(dictPy2hz, {
      [notone[i]]: (dictPy2hz[notone[i]] || '') + String.fromCharCode(i + 19968),
    });
  }
}

/**
 * 根据汉字获取拼音，如果不是汉字直接返回原字符
 * Unicode字符中4E00(19968)-9FA5(40869)共计20902
 *
 * @param {String} chinese - 汉字
 * @param {String} [splitter=''] - 分隔符
 * @param {Boolean} [withtone=false] - 是否包含声调
 * @returns {String} 汉字对应的拼音
 * @example
 *
 * getPinyin('小明', ' ');
 * // => xiao ming
 *
 * getPinyin('小明', ' ', true);
 * // => xiǎo míng
 *
 * getPinyin('小明plus', ' ');
 * // => xiao ming plus
 */
function getPinyin(chinese, splitter = '', withtone = false) {
  chinese = chinese.trim();
  const result = [];
  let noChinese = '';
  for (let i = 0, len = chinese.length; i < len; i++) {
    let pinyin = dictWithtone[chinese[i]];
    if (pinyin) {
      // 声调判断
      if (!withtone) pinyin = removeTone(pinyin);
      // 非汉字判断
      if (noChinese !== '') {
        result.push(noChinese);
        noChinese = '';
      }
      result.push(pinyin);
    } else {
      noChinese += chinese[i];
    }
  }
  if (noChinese !== '') {
    result.push(noChinese);
    noChinese = '';
  }

  return result.join(splitter);
}

/**
 * 单个拼音转汉字
 *
 * @param {String} pinyin - 单个汉字的拼音，可以包含声调
 * @returns {String} 拼音对应的汉字
 * @example
 *
 * getHanzi('diu');
 * // => 丟丢銩铥颩
 */
function getHanzi(pinyin) {
  return dictPy2hz[removeTone(pinyin)] || '';
}

/**
 * 获取城市拼音【城市多音字已处理】
 *
 * @param {String} city - 城市
 * @param {String} [splitter=''] - 分隔符
 * @param {Boolean} [withtone=false] - 是否包含声调
 * @returns {String} 城市对应的拼音
 * @example
 *
 * getCityPinyin('重庆市');
 * // => chongqingshi
 *
 * getCityPinyin('西藏', ' ', true);
 * // => xī zhàng
 */
function getCityPinyin(city, splitter = '', withtone = false) {
  const cityName = city.split(/(省|特别行政区|自治[区州县]|市|区|县)$/);
  let polyphone = dictCity[cityName[0]];
  if (polyphone) {
    polyphone = polyphone.replace(/,/g, splitter);
    // 不包含声调
    if (!withtone) {
      polyphone = removeTone(polyphone);
    }
    city = `${polyphone}${cityName[1] || ''}`;
  }
  return getPinyin(city, splitter, withtone);
}

parseDict();

export default {
  getPinyin,
  getCityPinyin,
  getHanzi,
};
