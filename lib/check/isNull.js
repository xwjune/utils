'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = isNull;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    sets.push.apply(sets, (0, _toConsumableArray3.default)(others));
  }

  return sets.includes(value);
}