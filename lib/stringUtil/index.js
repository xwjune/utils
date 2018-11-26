'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter = require('./filter');

var _money = require('./money');

var _convertCurrency = require('./convertCurrency');

var _convertCurrency2 = _interopRequireDefault(_convertCurrency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 字符串操作
 *
 * filterNull - 空数据过滤
 * convertFenToYuan - 分转化成元
 * convertYuanToFen - 元转化为分
 * convertCurrency - 数字金额转换为大写人民币汉字
 */
exports.default = {
  filterNull: _filter.filterNull,
  convertFenToYuan: _money.convertFenToYuan,
  convertYuanToFen: _money.convertYuanToFen,
  convertCurrency: _convertCurrency2.default
};