import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './src/navigator/BottomTabs';
import Detail from './src/pages/Detail';
import RailUsingHistory from './src/pages/RailUsingHistory';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={'/'} options={{headerShown: false}} component={BottomTabs}/>
        <Stack.Screen name={'/detail'} options={{headerBackTitleVisible: false}} component={Detail}/>
        <Stack.Screen name={'/railHistory'} options={{headerBackTitleVisible: false}} component={RailUsingHistory}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
