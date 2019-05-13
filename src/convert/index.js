/**
 * 数据转换
 *
 * bytesToSize - 数据容量单位换算
 * fenToYuan - 分转化成元
 * yuanToFen - 元转化为分
 * numberToCn - 阿拉伯数字转中文
 * currencyToCn - 数字金额转换为中文人民币大写
 */
import bytesToSize from './bytesToSize';
import fenToYuan from './fenToYuan';
import yuanToFen from './yuanToFen';
import numberToCn from './numberToCn';
import currencyToCn from './currencyToCn';

export default {
  bytesToSize,
  fenToYuan,
  yuanToFen,
  numberToCn,
  currencyToCn,
};
