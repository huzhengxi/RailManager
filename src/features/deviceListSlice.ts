/**
 * Created by jason on 2022/9/22.
 */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import {IDeviceItem} from '../utils/types';

export const deviceListSlice = createSlice({
  name: 'deviceList',
  initialState: [],
  reducers: {
    removeDevice: (devices: IDeviceItem[], payload: PayloadAction<IDeviceItem>) => {
      const removeItemIndex = devices.findIndex((device) => device.deviceId === payload.payload.deviceId);
      if (removeItemIndex !== -1) {
        devices.splice(removeItemIndex, 1);
      } else {
        Alert.alert('删除失败', '设备不存在');
      }
    },
    addDevice: (devices: IDeviceItem[], {payload: newDevice}: PayloadAction<IDeviceItem>) => {
      const deviceExist = devices.find((device) => device.deviceId === newDevice.deviceId);
      if (deviceExist) {
        Alert.alert('添加失败', '设备已添加过，不能重复添加', [
          {
            text: '确定',
          },
        ]);
      } else {
        devices.push(newDevice);
      }
    },
    updateDevice: (devices: IDeviceItem[], {payload: data}: PayloadAction<Partial<IDeviceItem>>) => {
      if (!data.deviceId) {
        return undefined;
      }
      const currentDeviceIndex = devices.findIndex((device) => device.deviceId === data.deviceId);
      if (currentDeviceIndex !== -1) {
        const curDevice = devices[currentDeviceIndex];
        devices[currentDeviceIndex] = {
          ...curDevice,
          ...data,
        };
      }
    },
  },
});

export const {removeDevice, addDevice} = deviceListSlice.actions;

export default deviceListSlice.reducer;
