/**
 * Created by jason on 2022/9/22.
 */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IDeviceItem} from '../utils/types';
import {RootState} from '../store';
import {Alert} from "react-native";

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
    deviceId: 1,
    name: '2#轨道1',
    status: 'normal',
    timestamp: new Date().setTime(now),
    isUse: true,
    temperature: 140
  },
  {
    deviceId: 2,
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
    removeDevice: (devices: IDeviceItem[], payload:PayloadAction<IDeviceItem>) => {
      const removeItemIndex = devices.findIndex(device=> device.deviceId === payload.payload.deviceId)
      if(removeItemIndex !== -1){
        devices.splice(removeItemIndex, 1)
      }else {
        Alert.alert('删除失败', '设备不存在')
      }
    },
    addDevice: (devices:IDeviceItem[], payload: PayloadAction<IDeviceItem>)  => {
      devices.push(payload.payload)
    }
  },
})

export const {removeDevice, addDevice} = deviceListSlice.actions

// export const selectDevice = (state:RootState) => state.

export default deviceListSlice.reducer
