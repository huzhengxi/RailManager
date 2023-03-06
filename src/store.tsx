/**
 * Created by jason on 2022/9/21.
 */

import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
// eslint-disable-next-line import/no-cycle
import deviceReducer from './features/deviceListSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const pConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  deviceReducer,
});

const persistReducers = persistReducer(pConfig, reducers);
const store = configureStore({
  reducer: persistReducers,
  devTools: __DEV__,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
