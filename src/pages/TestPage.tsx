import {useEffect} from 'react';
import {View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';

function test() {
  // BackgroundService.updateNotification({
  //   ...notificationOptions,
  //   taskTitle: '轨道状态变化',
  //   taskDesc: 'tt',
  // });
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
