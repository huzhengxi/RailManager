/**
 * Created by jason on 2023/3/8.
 */
import BackgroundService from 'react-native-background-actions';
import {AppColor} from '../utils/styles';
import store from '../store';
import {IDevice, RailWayState} from '../utils/types';
import {ONE_DAY} from '../utils/define';
import {AliIoTAPIClient} from '../utils/aliIotApiClient';
import {updateDevice} from '../features/deviceListSlice';
import helper from '../utils/helper';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

// 从服务器获取最新数据
export const refreshRecentlyDataFromServer = async () => {
  try {
    const aliApiClient = AliIoTAPIClient.getInstance();
    const deviceList = store.getState().deviceReducer as IDevice[];
    const endTime = Date.now();
    const startTime = endTime - ONE_DAY * 7;
    console.log('deviceList:', deviceList);
    for (const device of deviceList) {
      const railDataResponse = await aliApiClient.queryDeviceHistoryData(
        device.deviceId,
        startTime,
        endTime,
        'railway_state',
        1
      );
      console.log('railDataResponse:', JSON.stringify(railDataResponse));
      const railwayData = parseResponseData<RailWayState['value']>(railDataResponse);
      console.log('railwayData:', JSON.stringify(railwayData));

      if (!railwayData) {
        break;
      }

      const newDevice: IDevice = {
        ...device,
        timestamp: Math.max(device.timestamp || 0, railwayData.timestamp),
        status: railwayData.broken_state,
        isUse: railwayData?.occupy_state === 'busy',
      };
      sendNotification(newDevice, device);
      console.log('newDevice:', JSON.stringify(newDevice));
    }
  } catch (e) {
    console.log('通知服务异常', e);
  }
};

export function sendNotification(newDevice: IDevice, oldDevice: IDevice) {
  if (
    newDevice.status !== oldDevice.status ||
    newDevice.isUse !== oldDevice.isUse ||
    newDevice.timestamp !== oldDevice.timestamp ||
    newDevice.temperature !== oldDevice.temperature
  ) {
    //只有 status 和  isUse 不一样才会通知
    if (newDevice.status !== oldDevice.status || newDevice.isUse !== oldDevice.isUse) {
      let desc = ` ${oldDevice.name} ${newDevice.status === 'normal' ? '恢复正常' : '断轨'}`;
      if (newDevice.isUse !== oldDevice.isUse) {
        desc = `${oldDevice.name} ${newDevice.isUse ? '被占用' : '空闲'}`;
      }
      helper.writeLog('数据更新，通知', desc);
      helper.writeLog('老数据:', oldDevice);
      helper.writeLog('新数据:', newDevice);
      BackgroundService.updateNotification({
        ...options,
        taskTitle: '轨道状态变化',
        taskDesc: desc,
      });
    }

    store.dispatch(
      updateDevice({
        ...newDevice,
        // 设备名称不能改
        name: oldDevice.name,
      })
    );
  } else {
    console.log('新数据', JSON.stringify(newDevice));
    console.log('老数据', JSON.stringify(oldDevice));
  }
}

function parseResponseData<T>(responseData: {Success: boolean; Data: any}): T | null {
  if (!responseData.Success) {
    return null;
  }
  const propertyInfo = responseData.Data?.List?.PropertyInfo ?? [];
  if (propertyInfo.length === 0) {
    return null;
  }
  return JSON.parse(propertyInfo[0].Value) as T;
}

const notificationTask = async (taskDataArguments: any) => {
  const {delay} = taskDataArguments;
  while (true) {
    console.log('开始执行任务....');
    await refreshRecentlyDataFromServer();
    await sleep(delay);
  }
};

const options = {
  taskName: 'notificationService',
  taskTitle: '',
  taskDesc: '',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: AppColor.green,
  parameters: {
    delay: 30 * 1000,
  },
  linkingURI: 'com.anonymous.railManager:', // Add this
};

export const startNotificationService = () => {
  return BackgroundService.start(notificationTask, options);
};

export const stopNotificationService = () => {
  return BackgroundService.stop();
};
