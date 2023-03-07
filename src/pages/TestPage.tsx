import {Alert, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useEffect} from 'react';
import {AliIoTAPIClient} from '../utils/aliIotApiClient';
import {ONE_DAY} from '../utils/define';

function testHistoryApi() {
  const client = AliIoTAPIClient.getInstance();

  const deviceId = '865714066701756';
  const productKey = 'a1xjcOCd61A';
  const endTime = Date.now();
  const startTime = endTime - ONE_DAY * 7;

  client
    .queryDeviceData(deviceId, productKey, startTime, endTime, 'temperature')
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
