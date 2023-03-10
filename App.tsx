import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/navigator/BottomTabs';
import {createStack, NormalPage, Stack} from './src/utils/navigationFactory';
import Helper from './src/utils/helper';
import {Provider} from 'react-redux';
import store from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import {Provider as AntDesignProvider} from '@ant-design/react-native';
import {startNotificationService} from './src/services/notificationService';

const persistorGate = persistStore(store);

export default function App() {
  useEffect(() => {
    Helper.clearLog();
    startNotificationService();
  }, []);
  return (
    <AntDesignProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistorGate}>
          <NavigationContainer>
            {/* 设置黑色模式 */}
            <StatusBar barStyle={'dark-content'} />

            <Stack.Navigator>
              <Stack.Screen name={'/'} options={{headerShown: false}} component={BottomTabs} />
              {createStack(NormalPage)}
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </AntDesignProvider>
  );
}
