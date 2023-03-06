/**
 * Created by jason on 2022/9/12.
 */

import helper from './helper';
import {MqttDeviceData, IDeviceItem} from './types';

// eslint-disable-next-line no-unused-vars
type UpdateDataFunc = (data: IDeviceItem) => void;

export default class MqttClient {
  private static productKey = 'a1GjE0EIQfA';
  private static deviceName = 'android_app';
  private static subTopic = `/${MqttClient.productKey}/${MqttClient.deviceName}/user/get`;
  private static url = `wss://${MqttClient.productKey}.iot-as-mqtt.cn-shanghai.aliyuncs.com/mqtt`;
  private static userName = 'android_app&a1GjE0EIQfA';
  private static password = 'c306a5b75cd1299910d16f823bf1e54943d910625b9d6831cee6a7becfd43bd8';
  private static clientId = 'a1GjE0EIQfA.android_app|securemode=2,signmethod=hmacsha256,timestamp=1678072991906|';

  private static isConnected = false;

  static connect(updateData: UpdateDataFunc) {
    if (MqttClient.isConnected) {
      helper.writeLog('mqtt已经连接，直接返回');
      return;
    }
    const mqttModule = require('mqtt/dist/mqtt');

    const client = mqttModule.connect(MqttClient.url, {
      username: MqttClient.userName,
      password: MqttClient.password,
      clientId: MqttClient.clientId,
    });

    helper.writeLog('开始链接');
    client.on('connect', (mqtt: unknown) => {
      MqttClient.isConnected = true;
      helper.writeLog('mqtt 连接成功', mqtt);
      client.subscribe(MqttClient.subTopic);
    });
    client.on('error', (error: unknown) => {
      helper.writeLog('mqtt 发生错误：', error);
    });
    client.on('close', (mqtt: unknown) => {
      MqttClient.isConnected = false;
      helper.writeLog('mqtt 断开连接', mqtt);
    });

    client.on('message', (topic: string, payload: any) => {
      helper.writeLog('接收到数据：', topic, payload.toString());
      try {
        const mqttData = JSON.parse(payload.toString()) as MqttDeviceData;
        updateData({
          deviceId: mqttData.deviceName,
          name: mqttData.deviceName,
          productKey: mqttData.productKey,
          timestamp: mqttData.items.railway_state.value.timestamp,
          status: mqttData.items.railway_state.value.broken_state,
          temperature: mqttData.items.railway_state.value.temperature,
          isUse: mqttData.items.railway_state.value.occupy_state === 'busy',
        });
      } catch (e: unknown) {
        helper.writeLog('jason数据转换失败：', e, payload.toString());
      }
    });
  }
}
