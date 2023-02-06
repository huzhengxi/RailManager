/**
 * Created by jason on 2022/9/15.
 */
import {useTitle, useUpdateOptions} from '../hooks/navigation-hooks';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {AppStyles} from '../utils/styles';
import {useEffect, useState} from 'react';
import {Loading} from '../utils/lib';
import Helper, {LOG_FILE} from '../utils/helper';
import RNShare from 'react-native-share';

export default function AppLog() {
  useTitle('App 日志');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  useUpdateOptions({
    headerRight: () => {
      return <TouchableOpacity
        activeOpacity={.6}
        style={{paddingHorizontal: 15}}
        onPress={() => {
          RNShare.open({
            url:LOG_FILE
          })
        }}
      >
        <Image
          source={require('../../assets/share.png')}
          style={{width: 30, height: 30, resizeMode: 'contain'}}/>
      </TouchableOpacity>;
    }
  });

  useEffect(() => {
    Helper.readLog().then(({file, content = '', error}) => {
      setContent(content);
      setLoading(false);
    });
  }, []);
  return (
    <ScrollView style={{flex: 1, padding: 15}}>
      {loading && <Loading/>}
      {
        !loading &&
        <Text style={AppStyles.blackText}>
          {content}
        </Text>
      }
    </ScrollView>
  );
}
