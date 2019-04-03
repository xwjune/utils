"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = isNull;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/toConsumableArray"));

/**
 * 空数据校验
 * 空数据集合：undefined, null, ''
 *
 * @param {*} value - The value to check.
 * @param {Array} [others=[]] - The other empty data set.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNull();
 * // => true
 *
 * isNull('null', ['null', '(null)']);
 * // => true
 */
function isNull(value) {
  var others = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var sets = [undefined, null, ''];

  if (others.length > 0) {
    sets.push.apply(sets, (0, _toConsumableArray2.default)(others));
  }

  return sets.includes(value);
}