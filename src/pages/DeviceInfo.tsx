import React, {useCallback} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {useRouteParams, useTitle} from '../hooks/navigation-hooks';
import {RoundView} from "../utils/lib";
import {Item} from "./Setting";
import {IDeviceItem} from "../utils/types";
import {Button} from "@ant-design/react-native";
import {useAppDispatch} from "../store";
import {removeDevice} from "../features/deviceListSlice";
import {useNavigation} from "@react-navigation/native";

export default function DeviceInfo() {
  const device: IDeviceItem = useRouteParams(['device']).device as IDeviceItem;
  useTitle(device.name || '设置页面');
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const removeThisDevice = useCallback(
    () => {
      Alert.alert('','确定要删除此设备吗',  [
        {
          text: '删除',
          onPress: () => {
            dispatch(removeDevice(device))
            // @ts-ignore
            navigation.navigate('/')
          },
          style:'destructive'
        },
        {
          text: '取消',
        }
      ])
    }, [],
  );

  return <ScrollView contentContainerStyle={{flex: 1}}>
    <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 1,}}>
      <RoundView>
        <Item title={'Device Id'} value={device.deviceId} split/>
        <Item title={'设备名称'} value={device.name} split/>
        <Item title={'Product Key'} value={device.productKey}/>
      </RoundView>
      <Button onPress={removeThisDevice} style={{marginBottom: 20, marginHorizontal: 20, borderColor: 'red'}}
      >删除</Button>
    </View>
  </ScrollView>;
}
