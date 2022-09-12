/**
 * Created by jason on 2022/9/10.
 */
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTitle} from '../hooks/navigation-hooks';
import {RoundView} from '../utils/lib';
import {Icon} from '@ant-design/react-native';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

export default function Setting() {
  useTitle('设置');
  return (
    <ScrollView>
      <RoundView>
        <Item
          title={'联系我们'}
          split={true}
          icon={'contact-card'}
          onPress={()=> {
            Alert.alert('', 'test')
          }}
        />
        <Item title={'通知'} split={true} icon={'bell-slash'}/>
        <Item title={'温度单位'} icon={'bell-slash'}/>
      </RoundView>
    </ScrollView>
  );
}

interface ItemProps {
  /**条目标题 */
  title: string;
  /**icon */
  icon: IconProp;
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
          {/*<FontAwesomeIcon icon={icon} size={20} secondaryColor={'red'} color={'blue'} />*/}
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        <Icon name={'arrow-right'}/>
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
    marginLeft: 5
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    opacity: .2
  }
});
