/**
 * Created by jason on 2022/9/12.
 */
import {useCallback, useEffect, useRef, useState} from 'react';
import {AliIoTAPIClient} from './aliIotApiClient';
import {ONE_DAY} from './define';
import helper from './helper';
import {
  IRailway,
  IHistory,
  INotificationItem,
  IRailUsingHistory,
  ITempHistory,
  RailWayEvent,
  TrainData,
  RailwayData,
} from './types';
import {timeFormat, timeValid, valueValid} from './TimeUtil';

export const useNotificationList = (devices?: IRailway[]) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<INotificationItem[]>([]);

  const refresh = useCallback(
    (clearData = true) => {
      if (!devices || devices.length === 0) {
        return;
      }

      setLoading(true);
      const endTime = Date.now();
      const startTime = endTime - ONE_DAY * 2;
      const client = AliIoTAPIClient.getInstance();
      client
        .queryDeviceHistoryData(startTime, endTime, 'railway_event')
        .then((data) => {
          setList(parseNotificationData(devices, data, clearData ? [] : list).history);
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

export const useTemperatureHistory = (device: IRailway, firstPageSize = 50) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ITempHistory[]>([]);
  const now = useRef(Date.now());
  const [endTime, setEndTime] = useState(now.current);
  const [startTime, _] = useState(now.current - ONE_DAY * 7);
  const [hasNext, setHasNext] = useState(true);

  const refreshData = useCallback(
    (loading = false, pageSize = 50) => {
      if (!hasNext) return;
      if (loading) setLoading(true);
      const client = AliIoTAPIClient.getInstance();
      client
        .queryDeviceHistoryData(startTime, endTime, 'railway_data', pageSize)
        .then((data) => {
          const {history, nextTime, hasNext} = parseTemperatureData(device, list, data);
          console.log('useTemperatureHistory:', history, nextTime, hasNext);
          setList([...history]);
          setHasNext(hasNext);
          if (hasNext && nextTime) {
            setEndTime(nextTime);
          }
        })
        .catch((error) => {
          setList([]);
          helper.writeLog('获取温度历史数据失败：', error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [list, endTime, hasNext]
  );

  useEffect(() => {
    refreshData(true, firstPageSize);
  }, []);
  return {
    loading,
    data: list,
    hasNext,
    refreshData,
  };
};

export const useRailUsingHistory = (device: IRailway, firstPageSize = 50) => {
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
        .queryDeviceHistoryData(startTime, endTime, 'train_data', pageSize)
        .then((data) => {
          const {history, hasNext, nextTime} = parseRailUsingData(device, data, list);
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
  }, [device.railwayId]);
  return {
    loading,
    data: list,
    hasNext,
    refreshData,
  };
};

function parseTemperatureData(device: IRailway, prevList: ITempHistory[], data: any): IHistory<ITempHistory> {
  const {history, nextTime, hasNext} = parseResponseData<RailwayData>(data);
  const parsedData: ITempHistory[] = [...prevList];
  try {
    history
      .filter(({railway_id}) => railway_id === device.railwayId)
      .filter(({timestamp, temperature}) => timeValid(timestamp) && valueValid(temperature))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((railwayData) => {
        const newDate = timeFormat(railwayData.timestamp, 'M/DD HH:00');
        const newDateIndex = parsedData.findIndex(({date}) => newDate === date);
        console.log('xx:', newDate, newDateIndex, parsedData);
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
    history: parsedData.sort((a, b) => b.timestamp - a.timestamp),
  };
}

function parseRailUsingData(device: IRailway, data: any, prevList: IRailUsingHistory[]): IHistory<IRailUsingHistory> {
  const {hasNext, nextTime, history} = parseResponseData<TrainData>(data);
  const parsedData: IRailUsingHistory[] = [...prevList];
  const processTrainData = (timeKey: 'enter_timestamp' | 'leave_timestamp', trainData: TrainData) => {
    const timestamp = trainData[timeKey];
    const newDate = timeFormat(timestamp, 'M/DD');
    const newDateIndex = parsedData.findIndex(({date}) => newDate === date);
    // 不存在日期的话，插入一条日期
    if (newDateIndex === -1) {
      parsedData.push({
        timestamp,
        type: 'date',
        date: newDate,
      });
    }

    parsedData.push({
      timestamp,
      type: 'history',
      date: newDate,
      using: timeKey === 'enter_timestamp',
      description: timeKey === 'enter_timestamp' ? `轴数为 ${trainData.axis_number} 的列车进站` : '列车驶离，轨道空闲',
    });
  };
  try {
    history
      .filter(({railway_id}) => railway_id === device.railwayId)
      .filter(({enter_timestamp, leave_timestamp}) => timeValid(enter_timestamp) && timeValid(leave_timestamp))
      .sort((a, b) => b.enter_timestamp - a.enter_timestamp)
      .forEach((trainData) => {
        processTrainData('leave_timestamp', trainData);
        processTrainData('enter_timestamp', trainData);
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

function parseNotificationData(
  devices: IRailway[],
  data: any,
  prevList: INotificationItem[]
): IHistory<INotificationItem> {
  const {hasNext, nextTime, history} = parseResponseData<RailWayEvent>(data);

  const parsedData: INotificationItem[] = [...prevList];
  try {
    history
      .filter(({railway_id}) => devices.findIndex(({railwayId}) => railwayId === railway_id) > -1)
      .filter(({timestamp, type}) => timeValid(timestamp) && (type === 'railway_broken' || type === 'train_enter'))
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((railwayData) => {
        const railway = devices.find(({railwayId}) => railwayId === railwayData.railway_id);
        if (railway) {
          parsedData.push({
            railName: railway.name,
            timestamp: railwayData.timestamp,
            unRead: false,
            description: `${railway.name} ${railwayData.type === 'train_enter' ? '被占用' : '断轨'}`,
          });
        }
      });
  } catch (error: unknown) {
    helper.writeLog('历史数据解析错误:', error);
  }

  return {
    hasNext: hasNext && history.length !== parsedData.length,
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

  const propertyInfo = (Data?.List?.PropertyInfo ?? []) as Array<{Value: string; Time: number}>;
  const history: T[] = [];
  propertyInfo.forEach((item) => {
    try {
      history.push(JSON.parse(item?.Value) as T);
    } catch (error) {
      helper.writeLog('解析数据错误');
    }
  });

  return {
    hasNext: Data?.NextValid ?? false,
    nextTime: Data?.NextTime ?? Date.now(),
    history,
  };
}
