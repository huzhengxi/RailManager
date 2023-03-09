/**
 * Created by jason on 2022/9/12.
 */
import {useCallback, useEffect, useRef, useState} from 'react';
import {AliIoTAPIClient} from './aliIotApiClient';
import {ONE_DAY} from './define';
import helper from './helper';
import {IDevice, INotificationItem, IRailUsingHistory, ITempHistory, RailWayState, TrainState} from './types';
import {timeFormat, timeValid} from './TimeUtil';

export const useNotificationList = (devices?: IDevice[]) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<INotificationItem[]>([]);

  const refresh = useCallback(() => {
    if (!devices || devices.length === 0) {
      return;
    }
    setLoading(true);
    const endTime = Date.now();
    const startTime = endTime - ONE_DAY * 7;
    const client = AliIoTAPIClient.getInstance();
    client
      .queryDeviceHistoryData(devices[0].deviceId, startTime, endTime, 'railway_state')
      .then((data) => {
        setList(parseNotificationData(data, devices[0]));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [list]);
  useEffect(() => {
    refresh();
  }, []);
  return {
    loading,
    data: list,
    refresh,
  };
};

export const useTemperatureHistory = (device: IDevice) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ITempHistory[]>([]);
  const now = useRef(Date.now());
  const [endTime, setEndtime] = useState(now.current);
  const [startTime, _] = useState(now.current - ONE_DAY * 7);

  useEffect(() => {
    setLoading(true);
    const client = AliIoTAPIClient.getInstance();
    client
      .queryDeviceHistoryData(device.deviceId, startTime, endTime, 'railway_state')
      .then((data) => {
        const {history, nextTime, isNext} = parseTemperatureData(list, data);
        setList([...history]);
        if (isNext && nextTime) {
          setEndtime(nextTime);
        } else {
          console.log('History:', list);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [endTime]);
  return {
    loading,
    data: list,
  };
};

export const useRailUsingHistory = (device: IDevice) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IRailUsingHistory[]>([]);

  useEffect(() => {
    setLoading(true);
    const endTime = Date.now();
    const startTime = endTime - ONE_DAY * 7;
    const client = AliIoTAPIClient.getInstance();
    client
      .queryDeviceHistoryData(device.deviceId, startTime, endTime, 'train_state')
      .then((data) => {
        setList(parseRailUsingData(data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [device.deviceId, device.productKey]);
  return {
    loading,
    data: list,
  };
};

function parseTemperatureData(
  list: ITempHistory[],
  data: any
): {isNext: boolean; nextTime?: number; history: ITempHistory[]} {
  if (!data.Success) {
    helper.writeLog('请求失败', data);
    return {isNext: false, history: []};
  }
  const originalData: Array<{Time: number; Value: any}> = data?.Data?.List?.PropertyInfo ?? [];
  const parsedData: ITempHistory[] = [...list];
  originalData
    ?.sort((x, y) => y.Time - x.Time)
    ?.forEach(({Value}) => {
      try {
        const railwayData = JSON.parse(Value) as RailWayState['value'];
        if (timeValid(railwayData.timestamp)) {
          const newDate = timeFormat(railwayData.timestamp, 'M/DD');
          const newDateIndex = parsedData.findIndex(({date}) => newDate === date);
          if (newDateIndex !== -1) {
            // 如果已经存在的话，取最大值
            parsedData[newDateIndex] = {
              ...parsedData[newDateIndex],
              temp: Math.max(parsedData[newDateIndex].temp, railwayData.temperature),
            };
          } else {
            parsedData.push({
              timestamp: railwayData.timestamp,
              temp: railwayData.temperature,
              date: newDate,
            });
          }
        }
      } catch (error: unknown) {
        helper.writeLog('历史数据解析错误:', error);
      }
    });
  return {
    isNext: data?.Data?.NextValid ?? false,
    nextTime: data?.Data?.NextTime ?? Date.now(),
    history: parsedData.sort((a, b) => b.timestamp - a.timestamp),
  };
}

function parseRailUsingData(data: any): IRailUsingHistory[] {
  if (!data.Success) {
    helper.writeLog('请求失败', data);
    return [];
  }
  const originalData: Array<{Time: number; Value: any}> = data?.Data?.List?.PropertyInfo ?? [];
  const parsedData: IRailUsingHistory[] = [];
  originalData
    ?.sort((x, y) => x.Time - x.Time)
    ?.forEach(({Value}) => {
      try {
        const trainData = JSON.parse(Value) as TrainState['value'];
        if (timeValid(trainData.timestamp)) {
          const newDate = timeFormat(trainData.timestamp, 'M/DD');
          const newDateIndex = parsedData.findIndex(({date}) => newDate === date);
          // 不存在日期的话，插入一条日期
          if (newDateIndex === -1) {
            parsedData.push({
              timestamp: trainData.timestamp,
              type: 'date',
              date: newDate,
            });
          }
          parsedData.push({
            timestamp: trainData.timestamp,
            type: 'history',
            date: newDate,
            using: trainData.enter_or_exit === 'train_in',
            description:
              trainData.enter_or_exit === 'train_in'
                ? `轴数为 ${trainData.axis_number} 的列车进站`
                : '列车驶离，轨道空闲',
          });
        }
      } catch (error) {
        helper.writeLog('历史数据解析错误:', error);
      }
    });

  return parsedData;
}

function parseNotificationData(data: any, device: IDevice): INotificationItem[] {
  if (!data.Success) {
    helper.writeLog('请求失败', data);
    return [];
  }
  const originalData: Array<{Time: number; Value: any}> = data?.Data?.List?.PropertyInfo ?? [];
  const parsedData: INotificationItem[] = [];
  originalData
    ?.sort((x, y) => y.Time - x.Time)
    ?.forEach(({Value}) => {
      try {
        const railwayData = JSON.parse(Value) as RailWayState['value'];
        if (
          timeValid(railwayData.timestamp) &&
          (railwayData.broken_state === 'broken' || railwayData.occupy_state === 'busy')
        ) {
          parsedData.push({
            railName: device.name,
            timestamp: railwayData.timestamp,
            unRead: false,
            description: `${device.name} ${railwayData.broken_state === 'broken' ? '断轨' : '被占用'}`,
          });
        }
      } catch (error: unknown) {
        helper.writeLog('历史数据解析错误:', error);
      }
    });
  return parsedData.sort((x, y) => y.timestamp - x.timestamp);
}
