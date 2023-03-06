/**
 * Created by jason on 2022/9/12.
 */
import {StyleSheet} from 'react-native';

export const AppColor = {
  cold: '#02FFFF',
  green: '#20BF55',
  red: '#D8001B',
  gray: '#F0F0F0',
  white: 'white',
};

export const AppStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  blackText: {
    fontSize: 15,
    color: 'black',
  },
  grayText: {
    fontSize: 14,
    color: 'black',
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
});
