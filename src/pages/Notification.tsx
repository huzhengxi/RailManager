/**
 * Created by jason on 2022/9/10.
 */
import dayjs from 'dayjs';
import {Alert, FlatList, Image, ListRenderItem, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {useNotificationList} from '../utils/httpUtil';
import {EmptyView, RoundView} from '../utils/lib';
import {AppStyles} from '../utils/styles';
import {IDevice, INotificationItem} from '../utils/types';
import {useAppSelector} from "../store";
import {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";

export default function Notification() {
  useTitle('通知管理');
  const devices = useAppSelector<IDevice[]>((state) => state.deviceReducer);
  const {loading, data, refresh} = useNotificationList(devices);
  const navigation = useNavigation();
  useEffect(()=> {
    navigation.addListener('focus', ()=> {
      refresh()
    })
    return ()=> navigation.removeListener('focus', ()=>{})
  }, [])

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {data.length === 0 && !loading && <EmptyView text={'暂无通知'}/>}
      {(data.length > 0 || loading) && <FlatList
          refreshing={loading}
          onRefresh={() => {}}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => `notification-keyExtractor-${item.timestamp}`}
      />}
    </SafeAreaView>
  );
}

const renderItem: ListRenderItem<INotificationItem> = ({index, item}) => {
  const {railName, timestamp, description, unRead} = item;

  return (
    <RoundView key={`notification-item-${index}`}>
      {unRead && <View style={styles.unRead}/>}
      <View style={[AppStyles.row, styles.itemContainer]}>
        <View style={AppStyles.row}>
          <Image style={styles.itemIcon} source={require('../../assets/trrail.png')}/>
          <Text style={[AppStyles.blackText, {marginLeft: 5}]}>{description}</Text>
        </View>
        <Text style={AppStyles.grayText}>{dayjs(timestamp).format('YYYY M/DD HH:mm')}</Text>
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
