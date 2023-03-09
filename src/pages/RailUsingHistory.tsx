/**
 * Created by jason on 2022/9/12.
 */
import {FlatList, Image, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {IRailUsingHistory, RailUsingHistoryDateType} from '../utils/types';
import {useRouteParams, useTitle} from '../hooks/navigation-hooks';
import {EmptyView, Loading, RoundView} from '../utils/lib';
import {AppColor, AppStyles} from '../utils/styles';
import dayjs from 'dayjs';
import {timeFormat} from "../utils/TimeUtil";

export default function RailUsingHistory() {
  useTitle('轨道占用历史');
  const data: IRailUsingHistory[] = useRouteParams(['historyData']).historyData as IRailUsingHistory[];
  return <UsingHistory loading={false} data={data} renderTitle={false}/>;
}


export const UsingHistory
  = ({data, loading, renderTitle}:
       { data: IRailUsingHistory[], loading: boolean, renderTitle: boolean }) => {
  const renderItem: ListRenderItem<IRailUsingHistory> = ({index, item}) => (
    <RailUsingHistoryItem index={index} item={item} dataLength={renderTitle ? data.length + 1 : data.length}/>
  );
  return (
    <View style={{width: '100%', marginBottom: 20}}>
      {renderTitle && <Text style={[AppStyles.grayText, {marginTop: 20, marginLeft: 20}]}>轨道占用历史</Text>}
      <RoundView style={{minHeight: 120}}>
        {loading && <Loading/>}
        {!loading && data.length === 0 && <EmptyView text={'暂无数据'}/>}
        {!loading && data.length > 0 && <FlatList data={data} renderItem={renderItem}/>}
      </RoundView>
    </View>
  );
};

const RailUsingHistoryItem = ({
                                index,
                                item,
                                dataLength
                              }: { index: number, item: IRailUsingHistory, dataLength: number }) => {
  const {type, using, timestamp, description} = item;
  const getRequire = (type: RailUsingHistoryDateType, using?: boolean) => {
    if (type === 'date') {
      return require('../../assets/calendar.png');
    }
    if (using) {
      return require('../../assets/train.png');
    }
    return require('../../assets/train_rail.png');

  };
  return (
    <View style={AppStyles.row}>
      <View style={[AppStyles.column, {width: 20}]}>
        <View style={[styles.line, {opacity: index === 0 ? 0 : 1}]}/>
        <Image source={getRequire(type, using)} style={styles.historyIcon}/>
        <View style={[styles.line, {opacity: index === dataLength - 1 ? 0 : 1}]}/>
      </View>
      <View style={[AppStyles.column, {alignItems: 'flex-start', marginLeft: 20}]}>
        {type === 'date' &&
          <Text style={[AppStyles.blackText, {fontSize: 15}]}>{timeFormat(timestamp, 'M/DD')}</Text>}
        {type !== 'date' && <>
          <Text style={AppStyles.grayText}>{timeFormat(timestamp, 'H:mm')}</Text>
          <Text style={[AppStyles.blackText, {marginTop: 5}]}>{description}</Text>
        </>}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  line: {
    height: 25,
    borderLeftColor: AppColor.gray,
    borderLeftWidth: 2
  },
  historyIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain'
  }
});
