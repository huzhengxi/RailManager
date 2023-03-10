/**
 * Created by jason on 2022/9/10.
 */

import {useNavigation} from '@react-navigation/native';
import {AppState, FlatList, ListRenderItem, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTitle, useUpdateOptions} from '../hooks/navigation-hooks';
import {useAppDispatch, useAppSelector} from '../store';
import AppUtil from '../utils/AppUtil';
import {EmptyView, HeaderRightButton, RoundView} from '../utils/lib';
import {AppColor, AppStyles} from '../utils/styles';
import {IDevice, StatusProps} from '../utils/types';
import {updateDevice} from '../features/deviceListSlice';
import {useCallback, useEffect} from 'react';
import MqttClient from '../utils/mqttClient';
import {timeFormat} from '../utils/TimeUtil';
import Helper from '../utils/helper';
import {refreshRecentlyDataFromServer} from '../services/notificationService';
import {throttle} from 'lodash';

export default function Home() {
  useTitle('轨道监测系统');
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const devices = useAppSelector<IDevice[]>((state) => state.deviceReducer);

  useEffect(() => {
    const freshData = () => {
      MqttClient.connect((deviceData) => {
        dispatch(updateDevice(deviceData));
      });
      refreshRecentlyDataFromServer();
    };
    freshData();
    AppState.addEventListener('change', (state) => {
      Helper.writeLog('App change:', state);
      if (state === 'active') {
        freshData();
      } else if (state === 'background') {
        MqttClient.close();
      }
    });
  }, []);

  useUpdateOptions(
    {
      headerRight: () => {
        if (devices.length === 0) {
          return null;
        }
        return (
          <HeaderRightButton
            source={require('../../assets/add_green.png')}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('/AddDevice');
            }}
          />
        );
      },
    },
    [devices.length]
  );
  const renderItem: ListRenderItem<IDevice> = ({index, item}) => {
    return <DeviceItem item={item} index={index} navigation={navigation} />;
  };
  const refreshData = useCallback(throttle(refreshRecentlyDataFromServer, 5000), []);
  return (
    <SafeAreaView style={{flex: 1}}>
      {devices.length === 0 && (
        <EmptyView
          text={'添加设备'}
          source={require('../../assets/add_green.png')}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('/AddDevice');
          }}
        />
      )}
      {devices.length > 0 && (
        <FlatList refreshing={false} onRefresh={refreshData} data={devices} renderItem={renderItem} />
      )}
    </SafeAreaView>
  );
}

const DeviceItem = ({index, item, navigation}: {index: number; item: IDevice; navigation: any}) => {
  const {name, status, isUse, timestamp, temperature} = item;
  const onPress = () => {
    navigation.navigate('/Detail', {device: item});
  };
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <RoundView key={`device-item-${index}`}>
        <View style={[AppStyles.column, styles.itemContainer]}>
          {/* 名称和更新时间 */}
          <View style={[AppStyles.row, {justifyContent: 'space-between', width: '100%'}]}>
            <Text style={AppStyles.title}>{name}</Text>
            <Text style={AppStyles.grayText}>{timestamp ? timeFormat(timestamp, 'M/DD hh:mm') : '--'}</Text>
          </View>

          {/* 各种状态 */}
          <View style={[AppStyles.row, {justifyContent: 'space-between', marginTop: 15, width: '100%'}]}>
            <Status title={'状态：'} text={status === 'normal' ? '良好' : '断轨'} status={status} />
            <Status title={'是否占用：'} text={isUse ? '占用' : '未占用'} status={isUse ? 'broken' : 'normal'} />
          </View>

          {/* 温度 */}
          <Temperature temp={temperature} />
        </View>
      </RoundView>
    </TouchableOpacity>
  );
};

const Status = ({text, status, title}: StatusProps) => (
  <View style={{flexDirection: 'row'}}>
    <Text style={AppStyles.grayText}>{title}</Text>
    <Text style={[AppStyles.blackText, {color: status === 'normal' ? AppColor.green : AppColor.red, marginLeft: 5}]}>
      {text}
    </Text>
  </View>
);

/** 暂定温度范围为 -50~150度 */
const MAX_TEMP = 150;
const MIN_TEMP = -50;
const RANGE = MAX_TEMP - MIN_TEMP;
const Temperature = ({temp}: {temp: number | undefined}) => {
  if (temp === undefined) {
    return null;
  }
  let width = Math.round(((temp - MIN_TEMP) / RANGE) * 100);
  if (width < 15) {
    width = 10;
  }

  const color = AppUtil.getTemperatureColor(temp);

  return (
    <View style={styles.tempContainer}>
      <View
        style={[
          AppStyles.row,
          styles.tempInner,
          {
            width: `${width}%`,
            backgroundColor: color,
            justifyContent: 'flex-end',
            paddingRight: 5,
          },
        ]}>
        <Text style={{color: 'white', fontSize: 13}}>{temp.toFixed(1)}°</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingRight: 15,
    alignItems: 'flex-start',
    marginVertical: 15,
  },
  tempContainer: {
    marginTop: 15,
    width: '100%',
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColor.gray,
  },
  tempInner: {
    height: 20,
    borderRadius: 10,
  },
});
