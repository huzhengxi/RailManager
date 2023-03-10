/**
 * Created by jason on 2022/9/10.
 */
import {FlatList, Image, ListRenderItem, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useNotificationList} from '../utils/httpUtil';
import {EmptyView, RoundView} from '../utils/lib';
import {AppStyles} from '../utils/styles';
import {IDevice, INotificationItem} from '../utils/types';
import {useAppSelector} from '../store';
import {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {timeFormat} from '../utils/TimeUtil';
import {throttle} from 'lodash';

export default function Notification() {
  useTitle('通知管理');
  const devices = useAppSelector<IDevice[]>((state) => state.deviceReducer);
  const {loading, data, refresh} = useNotificationList(devices);
  const navigation = useNavigation();
  const refreshData = useCallback(
    throttle(() => {
      refresh(true);
    }, 5000),
    []
  );
  useEffect(() => {
    navigation.addListener('focus', () => {
      refresh();
    });
    return () => navigation.removeListener('focus', () => {});
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {data.length === 0 && !loading && <EmptyView text={'暂无通知'} />}
      {(data.length > 0 || loading) && (
        <FlatList
          refreshing={loading}
          onRefresh={refreshData}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `notification-keyExtractor-${item.timestamp}-${index}`}
        />
      )}
    </SafeAreaView>
  );
}

const renderItem: ListRenderItem<INotificationItem> = ({index, item}) => {
  const {railName, timestamp, description, unRead} = item;

  return (
    <RoundView key={`notification-item-${item.timestamp}-${index}`}>
      {unRead && <View style={styles.unRead} />}
      <View style={[AppStyles.row, styles.itemContainer]}>
        <View style={AppStyles.row}>
          <Image style={styles.itemIcon} source={require('../../assets/trail.png')} />
          <Text style={[AppStyles.blackText, {marginLeft: 5}]}>{description}</Text>
        </View>
        <Text style={AppStyles.grayText}>{timeFormat(timestamp, 'M/DD HH:mm')}</Text>
      </View>
    </RoundView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'space-between',
    paddingRight: 15,
    height: 60,
    width: '100%',
  },
  itemIcon: {
    height: 20,
    width: 20,
  },
  unRead: {
    position: 'absolute',
    backgroundColor: 'red',
    height: 4,
    width: 4,
    borderRadius: 2,
    right: 10,
    top: 10,
  },
});
