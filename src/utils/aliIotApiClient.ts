import crypto from 'react-native-quick-crypto';
import querystring from 'querystring';
import axios, {AxiosInstance} from 'axios';

// TODO
export const AccessKey = 'LTAI5t7Zvibao5xtT6Lp8Nbj';
export const AccessKeySecret = 'cweG5e47ccss8lpGPmhnoNm0X7qcgg';

export interface IAliApiConfig {
  accessKeyId: string;
  accessKeySecret: string;
  regionId: string;
  format: 'JSON' | 'hex';
}

export class AliIoTAPIClient {
  config: IAliApiConfig;
  client: AxiosInstance;

  constructor(config: IAliApiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `https://iot.${config.regionId}.aliyuncs.com`,
    });
  }

  async queryDeviceData(deviceId: string, productKey: string, startTime: number, endTime: number) {
    const action = 'QueryDevicePropertyData';
    const identifier = 'temperature'; // 查询的属性名称

    const params = {
      Action: action,
      Format: this.config.format,
      Asc: '1',
      StartTime: startTime,
      EndTime: endTime,
      Identifier: identifier,
      PageSize: '50',
      DeviceName: deviceId,
      ProductKey: productKey,
      RegionId: this.config.regionId,
    };

    const url = this.buildRequestURL(params);
    const response = await this.client.get(url);

    return response.data;
  }

  private buildRequestURL(params: Record<string, any>) {
    params.SignatureMethod = 'HMAC-SHA1';
    params.SignatureNonce = String(Date.now() + Math.floor(Math.random() * 1000));
    params.SignatureVersion = '1.0';
    params.AccessKeyId = this.config.accessKeyId;
    params.Timestamp = new Date().toISOString();
    params.Version = '2018-01-20';
    const keys = Object.keys(params).sort();

    const canonicalizedQueryString = keys
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const stringToSign = `GET&%2F&${encodeURIComponent(canonicalizedQueryString)}`;
    const signature = crypto
      .createHmac('sha1', `${this.config.accessKeySecret}&`)
      .update(stringToSign)
      .digest('base64');
    params.Signature = signature;

    const qs = querystring.stringify(params);
    return `/?${qs}`;
  }
}
