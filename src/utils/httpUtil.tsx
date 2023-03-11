/**
 * Created by jason on 2022/9/12.
 */
import {useCallback, useEffect, useRef, useState} from 'react';
import {AliIoTAPIClient} from './aliIotApiClient';
import {ONE_DAY} from './define';
import helper from './helper';
import {IDevice, IHistory, INotificationItem, IRailUsingHistory, ITempHistory, RailWayState, TrainState} from './types';
import {timeFormat, timeValid} from './TimeUtil';

export const useNotificationList = (devices?: IDevice[]) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<INotificationItem[]>([]);

  const refresh = useCallback(
    (clearData = true) => {
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
          setList(parseNotificationData(data, devices[0], clearData ? [] : list).history);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [list]
  );

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
  const [endTime, setEndTime] = useState(now.current);
  const [startTime, _] = useState(now.current - ONE_DAY * 7);

  useEffect(() => {
    setLoading(true);
    const client = AliIoTAPIClient.getInstance();
    client
      .queryDeviceHistoryData(device.deviceId, startTime, endTime, 'railway_state')
      .then((data) => {
        const {history, nextTime, hasNext} = parseTemperatureData(list, data);
        setList([...history]);
        if (hasNext && nextTime) {
          setEndTime(nextTime);
        } else {
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

export const useRailUsingHistory = (device: IDevice, firstPageSize = 50) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IRailUsingHistory[]>([]);
  const now = useRef(Date.now());
  const [endTime, setEndTime] = useState(now.current);
  const [startTime, _] = useState(now.current - ONE_DAY * 7);
  const [hasNext, setHasNext] = useState(true);

  const refreshData = useCallback(
    (loading = false, pageSize = 50) => {
      if (!hasNext) {
        return;
      }
      if (loading) {
        setLoading(true);
      }
      const client = AliIoTAPIClient.getInstance();
      client
        .queryDeviceHistoryData(device.deviceId, startTime, endTime, 'train_state', pageSize)
        .then((data) => {
          const {history, hasNext, nextTime} = parseRailUsingData(data, list);
          console.log('his', history.length, hasNext, nextTime);
          setList([...history]);
          setHasNext(hasNext);
          if (hasNext && nextTime) {
            setEndTime(nextTime);
          }
        })
        .catch((error) => {
          helper.writeLog('获取数据失败', error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [list, endTime, hasNext]
  );

  useEffect(() => {
    refreshData(true, firstPageSize);
  }, [device.deviceId, device.productKey]);
  return {
    loading,
    data: list,
    hasNext,
    refreshData,
  };
};

function parseTemperatureData(prevList: ITempHistory[], data: any): IHistory<ITempHistory> {
  const {history, nextTime, hasNext} = parseResponseData<RailWayState['value']>(data);
  const parsedData: ITempHistory[] = [...prevList];
  try {
    history
      .filter(({timestamp}) => timeValid(timestamp))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((railwayData) => {
        const newDate = timeFormat(railwayData.timestamp, 'M/DD');
        const newDateIndex = parsedData.findIndex(({date}) => newDate === date);
        if (newDateIndex !== -1) {
          // 如果已经存在的话，取最大值
          parsedData[newDateIndex] = {
            ...parsedData[newDateIndex],
            temp: railwayData.temperature,
          };
        } else {
          parsedData.push({
            timestamp: railwayData.timestamp,
            temp: railwayData.temperature,
            date: newDate,
          });
        }
      });
  } catch (error) {
    helper.writeLog('历史数据解析错误:', error);
  }

  return {
    hasNext,
    nextTime,
    history: parsedData.sort((a, b) => a.timestamp - b.timestamp),
  };
}

function parseRailUsingData(data: any, prevList: IRailUsingHistory[]): IHistory<IRailUsingHistory> {
  const {hasNext, nextTime, history} = parseResponseData<TrainState['value']>(data);
  const parsedData: IRailUsingHistory[] = [...prevList];
  try {
    history
      .filter(({timestamp}) => timeValid(timestamp))
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((trainData) => {
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
      });
  } catch (error) {
    helper.writeLog('历史数据解析错误:', error);
  }

  return {
    hasNext: hasNext && prevList.length !== parsedData.length,
    nextTime,
    history: parsedData,
  };
}

function parseNotificationData(data: any, device: IDevice, prevList: INotificationItem[]): IHistory<INotificationItem> {
  const {hasNext, nextTime, history} = parseResponseData<RailWayState['value']>(data);

  const parsedData: INotificationItem[] = [...prevList];
  try {
    history
      .filter(
        ({timestamp, broken_state, occupy_state}) =>
          timeValid(timestamp) && (broken_state === 'broken' || occupy_state === 'busy')
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((railwayData) => {
        parsedData.push({
          railName: device.name,
          timestamp: railwayData.timestamp,
          unRead: false,
          description: `${device.name} ${railwayData.broken_state === 'broken' ? '断轨' : '被占用'}`,
        });
      });
  } catch (error: unknown) {
    helper.writeLog('历史数据解析错误:', error);
  }

  return {
    hasNext: hasNext && parsedData.length !== parsedData.length,
    nextTime,
    history: parsedData,
  };
}

export function parseResponseData<T>({Success, Data}: {Success: boolean; Data: any}): {
  hasNext: boolean;
  nextTime?: number;
  history: T[];
} {
  if (!Success) {
    return {
      hasNext: false,
      history: [],
    };
  }

  return {
    hasNext: Data?.NextValid ?? false,
    nextTime: Data?.NextTime ?? Date.now(),
    history: ((Data?.List?.PropertyInfo ?? []) as Array<{Value: string; Time: number}>).map(
      ({Value}) => JSON.parse(Value) as T
    ),
  };
}
