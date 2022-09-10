/**
 * Created by jason on 2022/9/10.
 */
import {Image, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '@ant-design/react-native';

export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Icon name={'file-protect'}  size={'md'} color={'red'}/>
    </View>
  );
}
