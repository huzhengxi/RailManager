import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './src/navigator/BottomTabs';
import Detail from './src/pages/Detail';
import RailUsingHistory from './src/pages/RailUsingHistory';
import AddDevice from './src/pages/AddDevice';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'}/>
      <Stack.Navigator>
        <Stack.Screen name={'/'} options={{headerShown: false}} component={BottomTabs}/>
        <Stack.Screen name={'/detail'} options={{headerBackTitleVisible: false}} component={Detail}/>
        <Stack.Screen name={'/railHistory'} options={{headerBackTitleVisible: false}} component={RailUsingHistory}/>
        <Stack.Screen name={'/addDevice'} options={{headerBackTitleVisible: false}} component={AddDevice}/>
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
