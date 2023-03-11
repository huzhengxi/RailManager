import {View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useEffect} from 'react';
import BackgroundService from 'react-native-background-actions';
import {notificationOptions} from '../services/notificationService';

function test() {
  BackgroundService.updateNotification({
    ...notificationOptions,
    taskTitle: '轨道状态变化',
    taskDesc: 'tt',
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
