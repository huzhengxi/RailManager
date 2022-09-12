/**
 * Created by jason on 2022/9/10.
 */
import {View, Text, StyleSheet, Image, FlatList, ListRenderItem, SafeAreaView, Alert} from 'react-native';
import {INotificationItem} from '../utils/types';
import {RoundView} from '../utils/lib';
import {AppStyles} from '../utils/styls';
import {useNotificationList} from '../utils/HttpUtil';
import dayjs from 'dayjs';

export default function Notification() {
  const {loading, data, refresh} = useNotificationList();
  console.log('data:', data);
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        refreshing={loading}
        onRefresh={refresh }
        data={data}
        renderItem={renderItem}
        keyExtractor={item => `notification-keyExtractor-${item.rainId}`}
      />
    </SafeAreaView>
  );
}

const renderItem: ListRenderItem<INotificationItem> = ({index, item}) => {
  const {railName, timestamp, description, unRead} = item;

  return <RoundView key={`notification-item-${index}`}>
    {
      unRead && <View style={styles.unRead}/>
    }
    <View style={[AppStyles.row, styles.itemContainer]}>
      <View style={AppStyles.row}>
        <Image style={styles.itemIcon} source={require('../../assets/trrail.png')}/>
        <Text style={[AppStyles.blackText, {marginLeft: 5}]}>
          {description}
        </Text>
      </View>
      <Text style={AppStyles.grayText}>{dayjs(timestamp).format('M/DD HH:mm')}</Text>
    </View>
  </RoundView>;
};

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'space-between',
    paddingRight: 15,
    height: 60,
    width: '100%'
  },
  itemIcon: {
    height: 20,
    width: 20
  },
  unRead: {
    position: 'absolute',
    backgroundColor: 'red',
    height: 4,
    width: 4,
    borderRadius: 2,
    right: 10,
    top: 10
  }
});
