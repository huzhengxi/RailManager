/**
 * Created by jason on 2022/9/14.
 */

import Detail from '../pages/Detail';
import RailUsingHistory from '../pages/RailUsingHistory';
import AddDevice from '../pages/AddDevice';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppLog from '../pages/AppLog';
import TestPage from '../pages/TestPage';
import DeviceInfo from '../pages/DeviceInfo';
import NotificationSetting from '../pages/NotificationSetting';

export const Stack = createNativeStackNavigator();

export const NormalPage = {
  Detail,
  RailUsingHistory,
  AddDevice,
  AppLog,
  TestPage,
  DeviceInfo,
  NotificationSetting,
};

export function createStack(pages: typeof NormalPage) {
  return Object.entries(pages).map(([key, value]) => {
    return (
      <Stack.Screen key={`page-${key}`} name={`/${key}`} component={value} options={{headerBackTitleVisible: false}} />
    );
  });
}
