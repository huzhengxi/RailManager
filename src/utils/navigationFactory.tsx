/**
 * Created by jason on 2022/9/14.
 */

import Detail from '../pages/Detail';
import RailUsingHistory from '../pages/RailUsingHistory';
import AddDevice from '../pages/AddDevice';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export const Stack = createNativeStackNavigator();

export const NormalPage = {
  Detail,
  RailUsingHistory,
  AddDevice
};


export function createStack(pages: typeof NormalPage) {
  return Object.entries(pages).map(([key, value]) => {
    console.log('key:', key)
    return <Stack.Screen key={`page-${key}`} name={`/${key}`} component={value}
                         options={{headerBackTitleVisible: false}}/>;
  });
}
