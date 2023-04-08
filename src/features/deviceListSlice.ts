/**
 * Created by jason on 2022/9/22.
 */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import {IRailway} from '../utils/types';

export const deviceListSlice = createSlice({
  name: 'deviceList',
  initialState: [],
  reducers: {
    removeDevice: (devices: IRailway[], payload: PayloadAction<IRailway>) => {
      const removeItemIndex = devices.findIndex((device) => device.railwayId === payload.payload.railwayId);
      if (removeItemIndex !== -1) {
        devices.splice(removeItemIndex, 1);
      } else {
        Alert.alert('删除失败', '设备不存在');
      }
    },
    addDevice: (devices: IRailway[], {payload: newDevice}: PayloadAction<IRailway>) => {
      const deviceExist = devices.find((device) => device.railwayId === newDevice.railwayId);
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
    updateDevice: (devices: IRailway[], {payload: data}: PayloadAction<Partial<IRailway>>) => {
      console.log('更新数据：', devices, data);
      if (!data.railwayId) {
        return undefined;
      }
      const currentDeviceIndex = devices.findIndex((device) => device.railwayId === data.railwayId);
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

export const {removeDevice, addDevice, updateDevice} = deviceListSlice.actions;

export default deviceListSlice.reducer;
