import md5 from 'md5';

/**
 * 请求头
 */
class Header {
  constructor() {
    this.common = {
      appId: '', // app唯一标识
      deviceId: '', // 设备唯一标识
      userId: '', // 用户唯一标识
      OSVersion: '', // 设备系统版本号
      timestamp: '', // 时间戳(秒)
      signature: '', // 签名
      token: '', // token【登录后设置】
    };
    this.password = ''; // 秘钥
  }

  // 设置秘钥
  setPassword = (v = '') => {
    this.password = v;
  };

  // 设置公共请求参数-单个
  setCommon = (key, value = '') => {
    Object.assign(this.common, {
      [key]: value,
    });
  };

  // 设置公共请求参数-多个
  setCommons = (params) => {
    // 没有值的属性默认设为空字符串，以防签名出现key=undefined，导致签名出错
    Object.keys(params).forEach((key) => {
      Object.assign(this.common, {
        [key]: params[key] || '',
      });
    });
  };

  // 获取公共请求参数
  getCommon = key => this.common[key];

  // 签名
  signature = () => {
    const { common } = this;
    const timestamp = (new Date().getTime() / 1000).toFixed();
    let sign = [
      `${common.appId}=appId`,
      `${common.userId}=userId`,
      `${common.deviceId}=deviceId`,
      `${common.OSVersion}=OSVersion`,
      `${this.password}=password`,
      `${timestamp}=timestamp`,
    ];
    sign.sort();
    sign = sign.join('&');
    sign = md5(sign);
    Object.assign(common, {
      timestamp,
      signature: sign,
    });
  };
}

export default new Header();
