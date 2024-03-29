/**
 * Created by jason on 2022/9/12.
 */
import {ActivityIndicator, FlatList, Image, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {IRailway, IRailUsingHistory, RailUsingHistoryDateType} from '../utils/types';
import {useRouteParams, useTitle} from '../hooks/navigation-hooks';
import {EmptyView, Loading, RoundView} from '../utils/lib';
import {AppColor, AppStyles} from '../utils/styles';
import {timeFormat} from '../utils/TimeUtil';
import {useRailUsingHistory} from '../utils/httpUtil';

export default function RailUsingHistory() {
  useTitle('轨道占用历史');
  const device: IRailway = useRouteParams(['device']).device as IRailway;
  const {data: railUsingHistoryData = [], loading, hasNext, refreshData} = useRailUsingHistory(device);
  return (
    <UsingHistory
      loading={loading}
      data={railUsingHistoryData}
      renderTitle={false}
      refreshData={refreshData}
      hasNext={hasNext}
    />
  );
}

export const UsingHistory = ({
  data,
  loading,
  renderTitle,
  refreshData,
  hasNext,
}: {
  data: IRailUsingHistory[];
  loading: boolean;
  renderTitle: boolean;
  refreshData?: () => void;
  hasNext?: boolean;
}) => {
  const renderItem: ListRenderItem<IRailUsingHistory> = ({index, item}) => (
    <RailUsingHistoryItem
      index={index}
      key={`${item.timestamp}-${index}`}
      item={item}
      dataLength={renderTitle ? data.length + 1 : data.length}
    />
  );
  return (
    <View style={{width: '100%', marginBottom: 20}}>
      {renderTitle && <Text style={[AppStyles.grayText, {marginTop: 20, marginLeft: 20}]}>轨道占用历史</Text>}
      <RoundView style={{minHeight: 120}}>
        {loading && <Loading />}
        {!loading && data.length === 0 && <EmptyView text={'暂无数据'} />}
        {!loading && data.length > 0 && (
          <FlatList
            data={data}
            renderItem={renderItem}
            ListFooterComponent={() => (
              <View style={{height: 30, justifyContent: 'center', alignItems: 'center'}}>
                {hasNext && <ActivityIndicator />}
                {!hasNext && <Text style={{fontSize: 12, color: 'gray'}}>已经到底啦！</Text>}
              </View>
            )}
            onEndReached={() => refreshData?.()}
            onEndReachedThreshold={0.2}
          />
        )}
      </RoundView>
    </View>
  );
};

const RailUsingHistoryItem = ({
  index,
  item,
  dataLength,
}: {
  index: number;
  item: IRailUsingHistory;
  dataLength: number;
}) => {
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
        <View style={[styles.line, {opacity: index === 0 ? 0 : 1}]} />
        <Image source={getRequire(type, using)} style={styles.historyIcon} />
        <View style={[styles.line, {opacity: index === dataLength - 1 ? 0 : 1}]} />
      </View>
      <View style={[AppStyles.column, {alignItems: 'flex-start', marginLeft: 20}]}>
        {type === 'date' && <Text style={[AppStyles.blackText, {fontSize: 15}]}>{timeFormat(timestamp, 'M/DD')}</Text>}
        {type !== 'date' && (
          <>
            <Text style={AppStyles.grayText}>{timeFormat(timestamp, 'H:mm:ss')}</Text>
            <Text style={[AppStyles.blackText, {marginTop: 5}]}>{description}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    height: 25,
    borderLeftColor: AppColor.gray,
    borderLeftWidth: 2,
  },
  historyIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
});
