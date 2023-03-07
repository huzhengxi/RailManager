/**
 * Created by jason on 2022/9/15.
 */
import {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity} from 'react-native';
import RNShare from 'react-native-share';
import {useTitle, useUpdateOptions} from '../hooks/navigation-hooks';
import Helper, {LOG_FILE} from '../utils/helper';
import {Loading} from '../utils/lib';
import {AppStyles} from '../utils/styles';

export default function AppLog() {
  useTitle('App 日志');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  useUpdateOptions({
    headerRight: () => {
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          style={{paddingHorizontal: 15}}
          onPress={() => {
            RNShare.open({
              url: `file:///${LOG_FILE}`,
            });
          }}>
          <Image source={require('../../assets/share.png')} style={{width: 30, height: 30, resizeMode: 'contain'}} />
        </TouchableOpacity>
      );
    },
  });

  useEffect(() => {
    Helper.readLog().then(({content: newContent = ''}) => {
      setContent(newContent);
      setLoading(false);
    });
  }, []);
  return (
    <ScrollView style={{flex: 1, padding: 15}}>
      {loading && <Loading />}
      {!loading && <Text style={AppStyles.blackText}>{content}</Text>}
    </ScrollView>
  );
}
