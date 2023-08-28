/**
 * Created by jason on 2022/9/10.
 */
import {useNavigation} from '@react-navigation/native';
import {Alert, ColorValue, Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useRouteParams, useTitle, useUpdateOptions} from '../hooks/navigation-hooks';
import {useAppSelector} from '../store';
import AppUtil from '../utils/AppUtil';
import {timeFormat} from '../utils/TimeUtil';
import {useRailUsingHistory, useTemperatureHistory} from '../utils/httpUtil';
import {EmptyView, HeaderRightButton, Loading, RoundView} from '../utils/lib';
import {AppColor, AppStyles} from '../utils/styles';
import {IRailway} from '../utils/types';
import {UsingHistory} from './RailUsingHistory';
import {useEffect, useRef} from 'react';

const screenWidth = Dimensions.get('window').width;

export default function Detail() {
  let device: IRailway = useRouteParams(['device']).device as IRailway;
  const {data: railUsingHistoryData = [], loading: railUsingLoading} = useRailUsingHistory(device, 20);
  const navigation = useNavigation();
  const devices = useAppSelector<IRailway[]>((state) => state.deviceReducer);
  device = devices.filter((d) => d.railwayId === device.railwayId)?.[0] || {};
  const {timestamp} = device;

  useTitle(device?.name || '');

  useUpdateOptions({
    headerRight: () => {
      return (
        <HeaderRightButton
          source={require('../../assets/setting.png')}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('/DeviceInfo', {device});
          }}
        />
      );
    },
  });
  // @ts-ignore
  return (
    <View style={{flex: 1}}>
      {/* 更新时间 */}
      <View style={[AppStyles.row, {justifyContent: 'flex-end', paddingRight: 20, marginTop: 15}]}>
        <Text style={AppStyles.grayText}>{timestamp ? timeFormat(timestamp, 'M/DD HH:mm') : '--'}</Text>
      </View>

      {/* 设备状态 */}
      <DeviceStatus device={device} />

      {/* 温度历史 */}
      <TempHistory device={device} />

      {/*  7天轨道占用历史 */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('/RailUsingHistory', {device});
        }}>
        <UsingHistory data={railUsingHistoryData} loading={railUsingLoading} renderTitle />
      </TouchableOpacity>
    </View>
  );
}

const DeviceStatus = ({device}: {device: IRailway}) => {
  const {isBroken, isOccupied, temperature} = device;
  return (
    <RoundView style={{padding: 15}}>
      <View style={[AppStyles.row, {justifyContent: 'space-between'}]}>
        {/* 轨道状态 */}
        <Item
          title={'状态'}
          value={isBroken ? '断轨' : '良好'}
          backgroundColor={AppUtil.getDeviceStatusColor(isBroken)}
        />
        {/* 是否占用 */}
        <Item value={isOccupied ? '占用中' : '未占用'} backgroundColor={AppUtil.getDeviceUsingColor(isOccupied)} />
        <Item
          value={`${temperature?.toFixed(1)}°`}
          title={'温度'}
          backgroundColor={AppUtil.getTemperatureColor(temperature ?? 0)}
        />
      </View>
    </RoundView>
  );
};

const Item = ({
  title,
  value,
  backgroundColor,
}: {
  title?: string;
  value: string | number;
  backgroundColor: ColorValue;
}) => (
  <View style={[AppStyles.column, styles.itemContainer, {backgroundColor}]}>
    {!!title && <Text style={AppStyles.grayText}>{title}</Text>}
    <Text style={[AppStyles.blackText, {fontWeight: '700', marginTop: 5}]}>{value}</Text>
  </View>
);

const TempHistory = ({device}: {device: IRailway}) => {
  let {data, loading} = useTemperatureHistory(device, 200);

  const chartData = {
    labels: data.map(({timestamp}) => timeFormat(timestamp, 'M/DD HH:00')) || [],
    datasets: [
      {
        data: data.map(({temp}) => temp) || [],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'white',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: true, // optional
  };
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollViewRef?.current?.scrollToEnd?.({animated: false});
  }, []);

  return (
    <View style={{width: '100%'}}>
      <Text style={[AppStyles.grayText, {marginTop: 20, marginLeft: 20}]}>温度历史</Text>
      <ScrollView
        horizontal
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef?.current?.scrollToEnd?.({animated: true});
        }}
        style={{
          marginHorizontal: 20,
          marginTop: 15,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          paddingLeft: 15,
        }}>
        <RoundView
          style={{
            padding: 15,
            minHeight: 120,
            marginLeft: 0,
            paddingLeft: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {loading && (
            <View style={{width: screenWidth - 60}}>
              <Loading />
            </View>
          )}
          {!loading && data.length === 0 && (
            <View style={{width: screenWidth - 60}}>
              <EmptyView text={'暂无数据'} />
            </View>
          )}
          {!loading && data.length > 0 && (
            <LineChart data={chartData} width={data.length * 100} height={200} chartConfig={chartConfig} />
          )}
        </RoundView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    borderRadius: 10,
  },
  line: {
    height: 20,
    borderLeftColor: AppColor.gray,
    borderLeftWidth: 2,
  },
});
