import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/navigator/BottomTabs';
import {createStack, NormalPage, Stack} from './src/utils/navigationFactory';
import Helper from './src/utils/helper';
import {Provider} from 'react-redux';
import store from './src/store';


export default function App() {
    useEffect(() => {
        //清理日志
        Helper.clearLog();
    }, []);
    return (
        <Provider store={store}>
            <NavigationContainer>
                {/*设置黑色模式*/}
                <StatusBar barStyle={'dark-content'}/>
        
                <Stack.Navigator>
                    <Stack.Screen name={'/'} options={{headerShown: false}} component={BottomTabs}/>
                    {
                        createStack(NormalPage)
                    }
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
