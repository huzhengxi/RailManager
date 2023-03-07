/**
 * Created by jason on 2022/9/12.
 */
import dayjs from 'dayjs';
import {useCallback, useEffect, useState} from 'react';
import {AliIoTAPIClient} from './aliIotApiClient';
import {ONE_DAY} from './define';
import helper from './helper';
import {IDeviceItem, INotificationItem, IRailUsingHistory, ITempHistory, RailWayState, TrainState} from './types';

export const useNotificationList = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<INotificationItem[]>([]);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const newList = [...list].reverse();
      setList(newList);
      setLoading(false);
    }, 1000);
  }, [list]);
  useEffect(() => {
    const now = Date.now();
    setTimeout(() => {
      setList([
        {
          rainId: 0,
          railName: '1#轨道',
          description: '1#轨道断轨',
          timestamp: new Date().setTime(now),
          unRead: false,
        },
        {
          rainId: 1,
          railName: '2#轨道',
          description: '2#轨道恢复正常',
          timestamp: new Date().setTime(now - 1000 * 360),
          unRead: true,
        },
        {
          rainId: 2,
          railName: '2#轨道',
          description: '2#轨道被占用',
          timestamp: new Date().setTime(now - 1000 * 720),
          unRead: false,
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);
  return {
    loading,
    data: list,
    refresh,
  };
};

export const useTemperatureHistory = (device: IDeviceItem) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<ITempHistory[]>([]);

  useEffect(() => {
    setLoading(true);
    const endTime = Date.now();
    const startTime = endTime - ONE_DAY * 7;
    const client = AliIoTAPIClient.getInstance();
    client
      .queryDeviceData(device.deviceId, device.productKey, startTime, endTime, 'railway_state')
      .then((data) => {
        setList(parseTemperatureData(data));
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

export const useRailUsingHistory = (device: IDeviceItem) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IRailUsingHistory[]>([]);

  useEffect(() => {
    setLoading(true);
    const endTime = Date.now();
    const startTime = endTime - ONE_DAY * 7;
    const client = AliIoTAPIClient.getInstance();
    client
      .queryDeviceData(device.deviceId, device.productKey, startTime, endTime, 'train_state')
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

function parseTemperatureData(data: any): ITempHistory[] {
  if (!data.Success) {
    helper.writeLog('请求失败', data);
    return [];
  }
  const originalData: Array<{Time: number; Value: any}> = data?.Data?.List?.PropertyInfo ?? [];
  const parsedData: ITempHistory[] = [];
  originalData
    ?.sort((x, y) => y.Time - x.Time)
    ?.forEach(({Value}) => {
      try {
        const railwayData = JSON.parse(Value) as RailWayState['value'];
        const newDate = dayjs(railwayData.timestamp).format('M/DD');
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
      } catch (error: unknown) {
        helper.writeLog('历史数据解析错误:', error);
      }
    });
  return parsedData;
}

function parseRailUsingData(data: any): IRailUsingHistory[] {
  if (__DEV__) {
    console.log(JSON.stringify(data));
  }
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
        const newDate = dayjs(trainData.timestamp).format('M/DD');
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
      } catch (error) {
        helper.writeLog('历史数据解析错误:', error);
      }
    });

  return parsedData;
}
