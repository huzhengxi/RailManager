import React, {useCallback} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {useRouteParams, useTitle} from '../hooks/navigation-hooks';
import {RoundView} from '../utils/lib';
import {Item} from './Setting';
import {IRailway} from '../utils/types';
import {Button, Modal} from '@ant-design/react-native';
import {useAppDispatch, useAppSelector} from '../store';
import {removeDevice, updateDevice} from '../features/deviceListSlice';
import {useNavigation} from '@react-navigation/native';
import {ProductKey} from '../localconfig/config';

export default function DeviceInfo() {
  const deviceTemp: IRailway = useRouteParams(['device']).device as IRailway;
  const devices = useAppSelector<IRailway[]>((state) => state.deviceReducer);
  const device = devices.filter((d) => d.railwayId === deviceTemp.railwayId)?.[0] || {};

  useTitle(device?.name || '设置页面');

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const removeThisDevice = useCallback(() => {
    Alert.alert('', '确定要删除此设备吗', [
      {
        text: '取消',
      },
      {
        text: '确定',
        onPress: () => {
          dispatch(removeDevice(device));
          // @ts-ignore
          navigation.navigate('/');
        },
        style: 'destructive',
      },
    ]);
  }, []);

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 1}}>
        <RoundView>
          <Item
            title={'设备名称'}
            value={device?.name}
            split
            onPress={() => {
              Modal.prompt(
                '请输入设备名称',
                '',
                [
                  {
                    text: '取消',
                  },
                  {
                    text: '确定',
                    onPress: (...arg: any) => {
                      dispatch(
                        updateDevice({
                          ...device,
                          name: arg?.[0],
                        })
                      );
                    },
                  },
                ],
                'default',
                device.name
              );
            }}
          />
          <Item title={'序列号'} value={device.railwayId} split />
          <Item title={'PID'} value={ProductKey} />
        </RoundView>
        <Button onPress={removeThisDevice} style={{marginBottom: 20, marginHorizontal: 20, borderColor: 'red'}}>
          删除
        </Button>
      </View>
    </ScrollView>
  );
}
