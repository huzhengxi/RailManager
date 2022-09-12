/**
 * Created by jason on 2022/9/10.
 */

import {FlatList, ListRenderItem, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDevice} from '../utils/HttpUtil';
import {IDeviceItem} from '../utils/types';
import {RoundView} from '../utils/lib';
import {AppColor, AppStyles} from '../utils/styls';
import dayjs from 'dayjs';


export default function Home() {
  const {data, refresh, loading} = useDevice();
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        refreshing={loading}
        onRefresh={refresh}
        data={data}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const renderItem: ListRenderItem<IDeviceItem> = ({index, item}) => {
  const {name, status, isUse, deviceId, timestamp, temperature} = item;
  return (
    <RoundView key={`device-item-${index}`}>
      <View style={[AppStyles.column, styles.itemContainer]}>

        {/*名称和更新时间*/}
        <View style={[AppStyles.row, {justifyContent: 'space-between', width: '100%'}]}>
          <Text style={AppStyles.title}>{name}</Text>
          <Text style={AppStyles.grayText}>{dayjs(timestamp).format('M/DD hh:mm')}</Text>
        </View>

        {/*各种状态*/}
        <View style={[AppStyles.row, {justifyContent: 'space-between', marginTop: 15, width: '100%'}]}>
          <Status title={'状态：'} text={status === 'normal' ? '良好' : '断轨'} status={status}/>
          <Status title={'是否占用：'} text={isUse ? '占用' : '未占用'} status={isUse ? 'abnormal' : 'normal'}/>
        </View>

        {/* 温度*/}
        <Temperature temp={temperature}/>
      </View>
    </RoundView>
  );
};

interface StatusProps {
  title: string,
  text: string,
  status: 'normal' | 'abnormal'
}

const Status = ({text, status, title}: StatusProps) => (
  <View style={{flexDirection: 'row'}}>
    <Text style={AppStyles.blackText}>{title}</Text>
    <Text
      style={[AppStyles.blackText, {color: status === 'normal' ? AppColor.green : AppColor.red, marginLeft: 5}]}
    >
      {text}
    </Text>
  </View>
);

/**暂定温度范围为 -50~150度 */
const MAX_TEMP = 150, MIN_TEMP = -50, RANGE = MAX_TEMP - MIN_TEMP;
const Temperature = ({temp}: { temp: number }) => {
  let width = Math.round((temp - MIN_TEMP) / RANGE * 100);
  if (width < 15) {
    width = 10;
  }

  let color = AppColor.green;
  if (temp > 60) {
    color = AppColor.red;
  } else if (temp < 0) {
    color = AppColor.cold;
  }

  return <View style={styles.tempContainer}>
    <View style={[AppStyles.row,styles.tempInner, {width: `${width}%`, backgroundColor: color,  justifyContent:'flex-end', paddingRight: 5}]}>
      <Text style={{color: 'white', fontSize: 13}}>{temp}°</Text>
    </View>
  </View>;
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingRight: 15,
    alignItems: 'flex-start',
    marginVertical: 15
  },
  tempContainer: {
    marginTop: 15,
    width: '100%',
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColor.gray
  },
  tempInner: {
    height: 20,
    borderRadius: 10
  }
});
