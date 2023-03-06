/**
 * Created by jason on 2022/9/10.
 */
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {ColorValue, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useRouteParams, useTitle} from '../hooks/navigation-hooks';
import AppUtil from '../utils/AppUtil';
import {useRailUsingHistory, useTemperatureHistory} from '../utils/httpUtil';
import {Loading, RoundView} from '../utils/lib';
import {AppColor, AppStyles} from '../utils/styles';
import {IDeviceItem, ITempHistory} from '../utils/types';
import {UsingHistory} from './RailUsingHistory';

const screenWidth = Dimensions.get('window').width;

export default function Detail() {
  const item: IDeviceItem = useRouteParams(['item']).item as IDeviceItem;
  const {timestamp} = item;
  const {data: temperatureHistoryData = [], refresh: tempHisRefresh, loading: tempHisLoading} = useTemperatureHistory();
  const {data: railUsingHistoryData = [], refresh: railUsingRefresh, loading: railUsingLoading} = useRailUsingHistory();
  const navigation = useNavigation();
  useTitle(item.name || '');
  // @ts-ignore
  return (
    <ScrollView style={{flex: 1}}>
      {/* 更新时间 */}
      <View style={[AppStyles.row, {justifyContent: 'flex-end', paddingRight: 20, marginTop: 15}]}>
        <Text style={AppStyles.grayText}>{dayjs(timestamp).format('M/DD HH:mm')}</Text>
      </View>

      {/* 设备状态 */}
      <DeviceStatus device={item} />

      {/* 温度历史 */}
      <TempHistory loading={tempHisLoading} data={temperatureHistoryData} />

      {/*  7天轨道占用历史 */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('/RailUsingHistory', {historyData: railUsingHistoryData});
        }}>
        <UsingHistory data={railUsingHistoryData.slice(0, 5)} loading={railUsingLoading} renderTitle />
      </TouchableOpacity>
    </ScrollView>
  );
}

const DeviceStatus = ({device}: {device: IDeviceItem}) => {
  const {status, isUse, temperature} = device;
  return (
    <RoundView style={{padding: 15}}>
      <View style={[AppStyles.row, {justifyContent: 'space-between'}]}>
        {/* 轨道状态 */}
        <Item
          title={'状态'}
          value={status === 'normal' ? '良好' : '断轨'}
          backgroundColor={AppUtil.getDeviceStatusColor(status)}
        />
        {/* 是否占用 */}
        <Item value={isUse ? '占用中' : '未占用'} backgroundColor={AppUtil.getDeviceUsingColor(isUse || false)} />
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

const TempHistory = ({data = [], loading}: {data: ITempHistory[]; loading: boolean}) => {
  const chartData = {
    labels: data.map(({timestamp}, index) => dayjs(timestamp).format('M/DD')),
    datasets: [
      {
        data: data.map(({temp}, index) => temp),
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
  return (
    <View style={{width: '100%'}}>
      <Text style={[AppStyles.grayText, {marginTop: 20, marginLeft: 20}]}>温度历史</Text>
      <RoundView style={{padding: 15}}>
        {loading && <Loading />}
        {!loading && <LineChart data={chartData} width={screenWidth - 75} height={200} chartConfig={chartConfig} />}
      </RoundView>
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
