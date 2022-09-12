/**
 * Created by jason on 2022/9/11.
 */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Notification from '../pages/Notification';
import Setting from '../pages/Setting';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBell, faList, faSliders, faArrowCircleRight} from '@fortawesome/free-solid-svg-icons';

library.add(faBell, faList, faSliders, faArrowCircleRight)

const Tab = createBottomTabNavigator();
export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarLabel: '设备',
          tabBarIcon: ({color, size})=> (
            <FontAwesomeIcon icon={'list'} color={color} size={size} />
          )
        }}
        name={'Home'}
        component={Home}/>
      <Tab.Screen
        options={{
          tabBarLabel: '通知',
          tabBarIcon: ({color, size})=> (
            <FontAwesomeIcon icon={'bell'} color={color} size={size} />
          )
        }}
        name={'Notification'}
        component={Notification}/>
      <Tab.Screen
        options={{
          tabBarLabel: '设置',
          tabBarIcon: ({color, size})=> (
            <FontAwesomeIcon icon={'sliders'} color={color} size={size} />
          )
        }}
        name={'Setting'}
        component={Setting}/>
    </Tab.Navigator>
  );
}
