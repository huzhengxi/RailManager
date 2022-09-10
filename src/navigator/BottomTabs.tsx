/**
 * Created by jason on 2022/9/11.
 */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Notification from '../pages/Notification';
import Setting from '../pages/Setting';
import {Icon} from '@ant-design/react-native';

const Tab = createBottomTabNavigator();
export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarLabel: '主页面',
          // tabBarIcon: ({color, size})=> (
          //
          // )
        }}
        name={'Home'}
        component={Home}/>
      <Tab.Screen
        options={{
          tabBarLabel: '通知',
          tabBarIcon: ({color, size})=> (
            <Icon name={'notification'} color={color} size={size} />
          )
        }}
        name={'Notification'}
        component={Notification}/>
      <Tab.Screen
        options={{
          tabBarLabel: '通知',
          tabBarIcon: ({color, size})=> (
            <Icon name={'more'} color={color} size={size} />
          )
        }}
        name={'Setting'}
        component={Setting}/>
    </Tab.Navigator>
  );
}
