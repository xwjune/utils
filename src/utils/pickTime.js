import moment from 'moment';

/**
 * 预约时间解析
 * 根据对应的时间区间和间隔天数，推算出可选的时间范围，可用于快递上门取件等场景
 *
 * @param {Array} range 时间区间
 * @param {Number} interval 间隔天数
 * @param {Object} [attributes] - 配置参数
 * @param {String} [attributes.key='id'] - 主键key
 * @param {String} [attributes.name='name'] - 名称key
 * @param {String} [attributes.children='children'] - 子集合key
 * @return {Object[]} 可预约时间【主键键值为时间戳】
 * @example
 *
 * 9:00~13:00 T+2 当前时间：08/11 10:10
 * pickTime([9, 13], 2, { key: 'value', name: 'label' });
 * // => [{
 *   label: '08月11日',
 *   value: '1533916800',
 *   children: [
 *     { label: '11:00-12:00', value: '1533956400' },
 *     { label: '12:00-13:00', value: '1533960000' },
 *   ],
 * }, {
 *   label: '08月12日',
 *   value: '1534003200',
 *   children: [
 *     { label: '09:00-10:00', value: '1534035600' },
 *     { label: '10:00-11:00', value: '1534039200' },
 *     { label: '11:00-12:00', value: '1534042800' },
 *     { label: '12:00-13:00', value: '1534046400' },
 *   ],
 * }, {
 *   label: '08月13日',
 *   value: '1534089600',
 *   children: [
 *     { label: '09:00-10:00', value: '1534122000' },
 *     { label: '10:00-11:00', value: '1534125600' },
 *     { label: '11:00-12:00', value: '1534129200' },
 *     { label: '12:00-13:00', value: '1534132800' },
 *   ],
 * }];
 */
export default function (range, interval, attributes = {}) {
  const {
    key = 'id', // 主键key
    name = 'name', // 名称key
    children = 'children', // 子集合key
  } = attributes;
  const times = []; // 可预约时间
  const [minTime, maxTime] = range; // 时间区间
  const hour = new Date().getHours() + 1; // 当前小时
  const timeMap = []; // 时间段
  let timeMapDay1 = []; // 时间段【第一天】
  let firstDay = 0; // 第一天
  let lastDay = interval; // 最后一天
  // 时间戳解析
  const setValue = (dayValue, time) => {
    const t = time.split(':')[0];
    return `${Number(dayValue) + (t * 60 * 60)}`;
  };
  // 时间段初始化
  for (let i = minTime; i < maxTime; i++) {
    if (i < 9) {
      timeMap.push(`0${i}:00-0${i + 1}:00`);
    } else if (i === 9) {
      timeMap.push('09:00-10:00');
    } else {
      timeMap.push(`${i}:00-${i + 1}:00`);
    }
  }
  timeMapDay1 = [...timeMap];
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
  for (let i = firstDay; i <= lastDay; i++) {
    const d = moment().add(i, 'd');
    times.push({
      [name]: d.format('MM月DD日'),
      [key]: d.startOf('day').format('X'), // 时间戳【秒】
    });
  }
  times.forEach((day, index) => {
    const timeTemp = index === 0 ? [...timeMapDay1] : [...timeMap];
    Object.assign(day, {
      [children]: timeTemp.map(el => ({
        [name]: el,
        [key]: setValue(day[key], el), // 时间戳【秒】
      })),
    });
  });

  return times;
}
