/**
 * Created by jason on 2022/9/22.
 */
import {createSlice} from '@reduxjs/toolkit';
import {IDeviceItem} from '../utils/types';
import {RootState} from '../store';

const now = Date.now();

const initialState: IDeviceItem[] = [
  {
    deviceId: 0,
    name: '1#轨道',
    status: 'normal',
    timestamp: new Date().setTime(now),
    isUse: false,
    temperature: 45
  },
  {
    deviceId: 0,
    name: '2#轨道1',
    status: 'normal',
    timestamp: new Date().setTime(now),
    isUse: true,
    temperature: 140
  },
  {
    deviceId: 0,
    name: '3#轨道',
    status: 'abnormal',
    timestamp: new Date().setTime(now),
    isUse: false,
    temperature: -5
  }
]


export const deviceListSlice = createSlice({
  name: 'deviceList',
  initialState,
  reducers: {
    remove: (state, item) => {
    }
  }
})

export const {remove} = deviceListSlice.actions

// export const selectDevice = (state:RootState) => state.

export default deviceListSlice.reducer
