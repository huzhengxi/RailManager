/**
 * Created by jason on 2023/3/8.
 */
import BackgroundService from 'react-native-background-actions';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import {updateDevice} from '../features/deviceListSlice';
import store from '../store';
import {AliIoTAPIClient} from '../utils/aliIotApiClient';
import {ONE_DAY} from '../utils/define';
import helper from '../utils/helper';
import {AppColor} from '../utils/styles';
import {IRailway, RailwayData} from '../utils/types';
import {parseResponseData} from '../utils/httpUtil';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

// 从服务器获取最新数据
export const refreshRecentlyDataFromServer = async () => {
  try {
    console.log('refreshRecentlyDataFromServer');
    const aliApiClient = AliIoTAPIClient.getInstance();
    const deviceList = store.getState().deviceReducer as IRailway[];
    const endTime = Date.now();
    const startTime = endTime - ONE_DAY * 7;
    console.log('deviceList:', deviceList);
    const railDataResponse = await aliApiClient.queryDeviceHistoryData(startTime, endTime, 'railway_data', 50);
    const {history} = parseResponseData<RailwayData>(railDataResponse);
    console.log('railDataResponse:', JSON.stringify(railDataResponse));

    for (const device of deviceList) {
      const findDeviceData = history.find(({railway_id}) => railway_id === device.railwayId);
      if (!findDeviceData) {
        break;
      }
      console.log('railwayData:', JSON.stringify(findDeviceData));
      const newDevice: IRailway = {
        ...device,
        timestamp: Math.max(device.timestamp || 0, findDeviceData.timestamp),
        isBroken: findDeviceData.is_broken,
        isOccupied: findDeviceData.is_occupied,
        temperature: findDeviceData.temperature,
      };
      sendNotification(newDevice, device);
      console.log('newDevice:', JSON.stringify(newDevice));
    }
  } catch (e) {
    console.log('通知服务异常', e);
  }
};

export function sendNotification(newDevice: IRailway, oldDevice: IRailway) {
  if (
    newDevice.isBroken !== oldDevice.isBroken ||
    newDevice.isOccupied !== oldDevice.isOccupied ||
    newDevice.timestamp !== oldDevice.timestamp ||
    newDevice.temperature !== oldDevice.temperature
  ) {
    //只有 status 和  isUse 不一样才会通知
    if (newDevice.isBroken !== oldDevice.isBroken || newDevice.isOccupied !== oldDevice.isOccupied) {
      let desc = ` ${oldDevice.name} ${newDevice.isBroken === false ? '恢复正常' : '断轨'}`;
      if (newDevice.isOccupied !== oldDevice.isOccupied) {
        desc = `${oldDevice.name} ${newDevice.isOccupied ? '被占用' : '空闲'}`;
      }
      helper.writeLog('数据更新，通知', desc);
      helper.writeLog('老数据:', oldDevice);
      helper.writeLog('新数据:', newDevice);
      BackgroundService.updateNotification({
        ...notificationOptions,
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

const notificationTask = async (taskDataArguments: any) => {
  const {delay} = taskDataArguments;
  while (true) {
    console.log('开始执行任务....');
    await refreshRecentlyDataFromServer();
    await sleep(delay);
  }
};

export const notificationOptions = {
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
  try {
    checkNotificationPermission();
    return BackgroundService.start(notificationTask, notificationOptions);
    // @ts-ignore
  } catch (e: Error) {
    helper.writeLog('startNotificationService failed:', e.toString());
  }
};

export const stopNotificationService = () => {
  return BackgroundService.stop();
};

export const checkNotificationPermission = () => {
  checkNotifications().then((result) => {
    helper.writeLog('通知权限:', result);
  });
  requestNotifications([
    'alert',
    'badge',
    'sound',
    'carPlay',
    'criticalAlert',
    'provisional',
    'providesAppSettings',
  ]).then((result) => {
    console.log('result', result);
  });
};
