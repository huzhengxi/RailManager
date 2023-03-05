import {Alert, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useEffect} from 'react';
import {AccessKey, AccessKeySecret, AliIoTAPIClient, IAliApiConfig} from '../utils/aliIotApiClient';

function testHistoryApi() {
  const config: IAliApiConfig = {
    accessKeyId: AccessKey,
    accessKeySecret: AccessKeySecret,
    regionId: 'cn-shanghai',
    format: 'JSON',
  };

  const client = new AliIoTAPIClient(config);

  const deviceId = 'test1';
  const productKey = 'a1os1PNbFqf';
  const startTime = new Date('2023-02-18T00:00:00.000Z').getTime();
  const endTime = new Date('2023-02-24T00:00:00.000Z').getTime();

  client
    .queryDeviceData(deviceId, productKey, startTime, endTime)
    .then((data) => {
      console.log(JSON.stringify(data));
      Alert.alert('请求成功', JSON.stringify(data));
      console.log('请求成功');
    })
    .catch((err) => {
      console.error(err);
      Alert.alert('请求失败');
      console.warn('请求失败');
    });
}

function mqttTest() {
  console.log('start...');

  const mqttModule = require('mqtt/dist/mqtt');

  const productKey = 'a1Qho6rSEgo';
  const productSecret = 'YHfLTLdzLsqH0a2t';
  const deviceName = 'app_android';
  const deviceSecret = 'd5cad71b7a7cde0536c2c3c8327ea6b7';
  const subTopic = `/${productKey}/${deviceName}/user/get`;

  const client = mqttModule.connect('wss://a1Qho6rSEgo.iot-as-mqtt.cn-shanghai.aliyuncs.com/mqtt', {
    username: 'app_android&a1Qho6rSEgo',
    password: 'd8bd6ec4dfb2002be9d0ccbc47a2e8a468e0f78ddc200e214fd55b332c9595f2',
    clientId: 'a1Qho6rSEgo.app_android|securemode=2,signmethod=hmacsha256,timestamp=1677679772403|',
  });
  client.on('connect', () => {
    console.log('连接成功');
    client.subscribe(subTopic);
  });
  client.on('message', (topic: string, payload: any) => {
    console.log('接收到数据：', topic, payload.toString());
  });
}

export default function TestPage() {
  useTitle('测试页面');
  useEffect(() => {
    testHistoryApi();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
