import {View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useEffect} from 'react';
import store from '../store';
import {ONE_DAY} from '../utils/define';
import {IDevice} from '../utils/types';
import {AliIoTAPIClient} from '../utils/aliIotApiClient';

function test() {
  const endTime = Date.now();
  const startTime = endTime - ONE_DAY * 7;
  const deviceList = store.getState().deviceReducer as IDevice[];
  const aliApiClient = AliIoTAPIClient.getInstance();
  aliApiClient.queryDeviceHistoryData(deviceList[0].deviceId, endTime, endTime + 10, 'railway_state', 1).then((res) => {
    console.log('result:', JSON.stringify(res));
  });
}

export default function TestPage() {
  useTitle('测试页面');
  useEffect(() => {
    test();
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
