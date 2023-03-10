import {NativeModules, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useEffect} from 'react';
import {AliIoTAPIClient} from '../utils/aliIotApiClient';
import {Button, Modal} from "@ant-design/react-native";

const {NotificationModule} = NativeModules;

function test() {
  // NotificationModule.startService();
  const client = AliIoTAPIClient.getInstance();
  client
    .updateNickname('865714066701756', '区段1-1')
    .then((result) => {
      console.log('更新设备名称结果：', result);
    })
    .catch((error) => {
      console.log('更新设备名称失败：', error);
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
    >
      <Button onPress={()=> {
        Modal.prompt(
          '修改设备名称',
          '',
          [
            {
              text:'确定',
              onPress:(...e:any)=> console.log('hello', e)
            },
            {
              text:'取掉',
              onPress:(e: any)=> console.log('取消', e)
            }
          ],
          'default',
          'hello',
          ['hello', 'world']
        )
      }}>
        Name
      </Button>
    </View>
  );
}
