"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bytesToSize = _interopRequireDefault(require("./bytesToSize"));

var _fenToYuan = _interopRequireDefault(require("./fenToYuan"));

var _yuanToFen = _interopRequireDefault(require("./yuanToFen"));

var _currencyToCn = _interopRequireDefault(require("./currencyToCn"));

/**
 * 数据转换
 *
 * bytesToSize - 数据容量单位换算
 * fenToYuan - 分转化成元
 * yuanToFen - 元转化为分
 * currencyToCn - 数字金额转换为中文人民币大写
 */
var _default = {
  bytesToSize: _bytesToSize.default,
  fenToYuan: _fenToYuan.default,
  yuanToFen: _yuanToFen.default,
  currencyToCn: _currencyToCn.default
};
exports.default = _default;