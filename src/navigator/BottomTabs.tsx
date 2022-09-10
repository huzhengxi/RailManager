/**
 * Created by jason on 2022/9/11.
 */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Notification from '../pages/Notification';
import Setting from '../pages/Setting';

const Tab = createBottomTabNavigator();
export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={'Home'} component={Home}/>
      <Tab.Screen name={'Notification'} component={Notification}/>
      <Tab.Screen name={'Setting'} component={Setting}/>
    </Tab.Navigator>
  );
}
