/**
 * Created by jason on 2022/9/10.
 */
import {Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {RoundView} from '../utils/lib';
import {FC, useEffect} from 'react';
import Helper from '../utils/helper';
import {useNavigation} from '@react-navigation/native';

export default function Setting() {
  useTitle('设置');
  const navigation = useNavigation();
  useEffect(() => {
    Helper.writeLog('进入设置页面');
  }, []);
  return (
    <ScrollView>
      <RoundView>
        <Item
          title={'联系我们'}
          split
          icon={require('../../assets/contact.png')}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('/AppLog');
          }}
        />
        <Item
          title={'通知'}
          split
          icon={require('../../assets/notification.png')}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('/NotificationSetting');
          }}
        />
        {/*<Item title={'温度单位'} icon={require('../../assets/unit.png')} split />*/}
        {__DEV__ && (
          <Item
            title='测试页面'
            onPress={() => {
              // @ts-ignore
              navigation.navigate('/TestPage');
            }}
          />
        )}
      </RoundView>
    </ScrollView>
  );
}

interface ItemProps {
  /** 条目标题 */
  title: string;
  value?: string;
  /** icon */
  icon?: ImageSourcePropType;
  /** 是否有分割线 */
  split?: boolean;
  /** 点击事件 */
  onPress?: () => void;
  RightView?: FC;
}

export const Item = (props: ItemProps) => {
  const {title, split = false, icon, onPress, RightView} = props;
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          {props.icon && <Image source={icon} style={{height: 20, width: 20, resizeMode: 'contain'}} />}
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        {!!RightView && <RightView />}
        {!RightView && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {!!props.value && <Text>{props.value}</Text>}
            <Image source={require('../../assets/enter.png')} style={{height: 15, width: 20, resizeMode: 'contain'}} />
          </View>
        )}
      </View>
      {split && <View style={styles.line} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  itemTitle: {
    color: 'black',
    fontSize: 15,
    marginLeft: 10,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    opacity: 0.2,
  },
});
