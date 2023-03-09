import crypto from 'react-native-quick-crypto';
import querystring from 'querystring';
import axios, {AxiosInstance} from 'axios';
import {AccessKey, AccessKeySecret} from '../localconfig/config';

interface IAliApiConfig {
  accessKeyId: string;
  accessKeySecret: string;
  regionId: string;
  format: 'JSON' | 'hex';
}

export class AliIoTAPIClient {
  private static instance: AliIoTAPIClient | undefined;

  static getInstance() {
    if (!this.instance) {
      this.instance = new AliIoTAPIClient();
    }
    return this.instance;
  }

  private config: IAliApiConfig = {
    accessKeyId: AccessKey,
    accessKeySecret: AccessKeySecret,
    regionId: 'cn-shanghai',
    format: 'JSON',
  };
  private action = 'QueryDevicePropertyData';
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: `https://iot.${this.config.regionId}.aliyuncs.com`,
    });
  }

  async queryDeviceData(deviceId: string, productKey: string, startTime: number, endTime: number, identifier: string) {
    const params = {
      Action: this.action,
      Format: this.config.format,
      Asc: '0',
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
