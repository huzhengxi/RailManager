import crypto from 'react-native-quick-crypto';
import querystring from 'querystring';
import axios, {AxiosInstance} from 'axios';
import {AccessKey, AccessKeySecret, ProductKey} from '../localconfig/config';
import {Identifier} from './types';

interface IAliApiConfig {
  accessKeyId: string;
  accessKeySecret: string;
  regionId: string;
  format: 'JSON' | 'hex';
}

type Actions =
  | 'QueryDevicePropertyData' //查询设备的属性历史数据
  | 'QueryDevicePropertiesData' //批量查询指定设备的多个属性的历史数据
  | 'QueryDeviceDetail' //查询设备详情
  | 'BatchUpdateDeviceNickname'; //更新设备名称

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
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: `https://iot.${this.config.regionId}.aliyuncs.com`,
    });
  }

  async updateNickname(deviceId: string, nickName: string) {
    const url = this.buildRequestURL({
      Action: 'BatchUpdateDeviceNickname',
      DeviceNicknameInfo: [
        {
          ProductKey,
          DeviceName: deviceId,
          Nickname: nickName,
        },
      ],
    });
    const response = await this.client.get(url, {});
    return response.data;
  }

  /**
   * 获取单个属性的历史数据
   * @param productKey
   * @param startTime
   * @param endTime
   * @param identifier
   */
  async queryDeviceHistoryData(startTime: number, endTime: number, identifier: Identifier, pageSize = 50) {
    return this.queryData('QueryDevicePropertyData', {
      Asc: 0,
      StartTime: startTime,
      EndTime: endTime,
      Identifier: identifier,
      PageSize: pageSize,
    });
  }

  private async queryData(action: Actions, params: Record<string, unknown> = {}) {
    const url = this.buildRequestURL({
      DeviceName: ProductName,
      Action: action,
      ProductKey,
      ...params,
    });
    const response = await this.client.get(url);
    // console.log('response', JSON.stringify( response.data))
    return response.data;
  }

  private buildRequestURL(params: Record<string, any>, method: 'GET' | 'POST' = 'GET') {
    params.SignatureMethod = 'HMAC-SHA1';
    params.SignatureNonce = String(Date.now() + Math.floor(Math.random() * 1000));
    params.SignatureVersion = '1.0';
    params.AccessKeyId = this.config.accessKeyId;
    params.Timestamp = new Date().toISOString();
    params.Version = '2018-01-20';
    params.RegionId = this.config.regionId;
    params.Format = this.config.format;
    const keys = Object.keys(params).sort();

    const canonicalizedQueryString = keys
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const stringToSign = `${method}&%2F&${encodeURIComponent(canonicalizedQueryString)}`;
    const signature = crypto
      .createHmac('sha1', `${this.config.accessKeySecret}&`)
      .update(stringToSign)
      .digest('base64');
    params.Signature = signature;

    const qs = querystring.stringify(params);
    return `/?${qs}`;
  }
}
