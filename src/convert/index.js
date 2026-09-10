/**
 * 数据转换
 *
 * bytesToSize - 数据容量单位换算
 * fenToYuan - 分转化成元
 * yuanToFen - 元转化为分
 * numberToCn - 阿拉伯数字转中文
 * currencyToCn - 数字金额转换为中文人民币大写
 * combination - 列出n个数组所有组合
 * toThousands - 数字千位符分隔
 * expandNumber - 科学计数法展开为十进制字符串
 * toFixed - 格式化数字保留N位小数
 */
import bytesToSize from './bytesToSize';
import fenToYuan from './fenToYuan';
import yuanToFen from './yuanToFen';
import numberToCn from './numberToCn';
import currencyToCn from './currencyToCn';
import combination from './combination';
import toThousands from './toThousands';
import expandNumber from './expandNumber';
import toFixed from './toFixed';

export default {
  bytesToSize,
  fenToYuan,
  yuanToFen,
  numberToCn,
  currencyToCn,
  combination,
  toThousands,
  expandNumber,
  toFixed,
};
