'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bytesToSize = require('./bytesToSize');

var _bytesToSize2 = _interopRequireDefault(_bytesToSize);

var _fenToYuan = require('./fenToYuan');

var _fenToYuan2 = _interopRequireDefault(_fenToYuan);

var _yuanToFen = require('./yuanToFen');

var _yuanToFen2 = _interopRequireDefault(_yuanToFen);

var _currencyToCn = require('./currencyToCn');

var _currencyToCn2 = _interopRequireDefault(_currencyToCn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 数据转换
 *
 * bytesToSize - 数据容量单位换算
 * fenToYuan - 分转化成元
 * yuanToFen - 元转化为分
 * currencyToCn - 数字金额转换为中文人民币大写
 */
exports.default = {
  bytesToSize: _bytesToSize2.default,
  fenToYuan: _fenToYuan2.default,
  yuanToFen: _yuanToFen2.default,
  currencyToCn: _currencyToCn2.default
};