'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = function (range, interval) {
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _attributes$key = attributes.key,
      key = _attributes$key === undefined ? 'id' : _attributes$key,
      _attributes$name = attributes.name,
      name = _attributes$name === undefined ? 'name' : _attributes$name,
      _attributes$children = attributes.children,
      children = _attributes$children === undefined ? 'children' : _attributes$children;

  var times = []; // 可预约时间

  var _range = (0, _slicedToArray3.default)(range, 2),
      minTime = _range[0],
      maxTime = _range[1]; // 时间区间


  var hour = new Date().getHours() + 1; // 当前小时
  var timeMap = []; // 时间段
  var timeMapDay1 = []; // 时间段【第一天】
  var firstDay = 0; // 第一天
  var lastDay = interval; // 最后一天
  // 时间戳解析
  var setValue = function setValue(dayValue, time) {
    var t = time.split(':')[0];
    return '' + (Number(dayValue) + t * 60 * 60);
  };
  // 时间段初始化
  for (var i = minTime; i < maxTime; i++) {
    if (i < 9) {
      timeMap.push('0' + i + ':00-0' + (i + 1) + ':00');
    } else if (i === 9) {
      timeMap.push('09:00-10:00');
    } else {
      timeMap.push(i + ':00-' + (i + 1) + ':00');
    }
  }
  timeMapDay1 = [].concat(timeMap);
  if (hour < maxTime) {
    // 未超出最晚时间
    if (hour >= minTime) {
      // 超出最早时间，移除已超时间段
      timeMapDay1 = timeMap.slice(hour - minTime);
    }
  } else {
    // 超出最晚时间，加一天
    firstDay += 1;
    lastDay += 1;
  }
  for (var _i = firstDay; _i <= lastDay; _i++) {
    var _times$push;

    var d = (0, _moment2.default)().add(_i, 'd');
    times.push((_times$push = {}, (0, _defineProperty3.default)(_times$push, name, d.format('MM月DD日')), (0, _defineProperty3.default)(_times$push, key, d.startOf('day').format('X')), _times$push));
  }
  times.forEach(function (day, index) {
    var timeTemp = index === 0 ? [].concat((0, _toConsumableArray3.default)(timeMapDay1)) : [].concat(timeMap);
    (0, _assign2.default)(day, (0, _defineProperty3.default)({}, children, timeTemp.map(function (el) {
      var _ref;

      return _ref = {}, (0, _defineProperty3.default)(_ref, name, el), (0, _defineProperty3.default)(_ref, key, setValue(day[key], el)), _ref;
    })));
  });

  return times;
};

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }