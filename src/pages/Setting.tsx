/**
 * Created by jason on 2022/9/10.
 */
import {Alert, Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {RoundView} from '../utils/lib';
import {Icon} from '@ant-design/react-native';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {useEffect} from 'react';
import Helper from '../utils/Helper';
import {useNavigation} from '@react-navigation/native';

export default function Setting() {
  useTitle('设置');
  const navigation = useNavigation();
  useEffect(()=> {
    Helper.writeLog('进入设置页面')
  }, [])
  return (
    <ScrollView>
      <RoundView>
        <Item
          title={'联系我们'}
          split={true}
          icon={require('../../assets/contact.png')}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('/AppLog')
          }}
        />
        <Item
          title={'通知'}
          split={true}
          icon={require('../../assets/notification.png')}
        />
        <Item
          title={'温度单位'}
          icon={require('../../assets/unit.png')}
        />
      </RoundView>
    </ScrollView>
  );
}

interface ItemProps {
  /**条目标题 */
  title: string;
  /**icon */
  icon: ImageSourcePropType;
  /**是否有分割线 */
  split?: boolean;
  /**点击事件 */
  onPress?: () => void;
}

const Item = (props: ItemProps) => {
  const {title, split = false, icon, onPress} = props;
  return (
    <TouchableOpacity activeOpacity={.6} onPress={onPress}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Image source={icon} style={{height: 20, width: 20, resizeMode: 'contain'}}/>
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        <Image source={require('../../assets/enter.png')} style={{height: 15, width: 20, resizeMode: 'contain'}}/>
      </View>
      {
        split && <View style={styles.line}/>
      }

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain'
  },
  itemTitle: {
    color: 'black',
    fontSize: 15,
    marginLeft: 10
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    opacity: .2
  }
});
