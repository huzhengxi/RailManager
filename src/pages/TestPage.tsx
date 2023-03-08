import {View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useEffect} from 'react';

function  test() {
}

export default function TestPage() {
  useTitle('测试页面');
  useEffect(() => {
    test()
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





