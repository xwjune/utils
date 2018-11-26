import { filterNull } from './filter';
import {
  convertFenToYuan,
  convertYuanToFen,
} from './money';
import convertCurrency from './convertCurrency';

/**
 * 字符串操作
 *
 * filterNull - 空数据过滤
 * convertFenToYuan - 分转化成元
 * convertYuanToFen - 元转化为分
 * convertCurrency - 数字金额转换为大写人民币汉字
 */
export default {
  filterNull,
  convertFenToYuan,
  convertYuanToFen,
  convertCurrency,
};
