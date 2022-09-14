/**
 * Created by jason on 2022/9/12.
 */
import {useCallback, useEffect, useState} from 'react';
import {IDeviceItem, INotificationItem, IRailUsingHistory, ITempHistory} from './types';
import dayjs from 'dayjs';
import Helper from './Helper';


export const useNotificationList = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<INotificationItem[]>([]);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let newList = [...list].reverse();
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
          unRead: false
        },
        {
          rainId: 1,
          railName: '2#轨道',
          description: '2#轨道恢复正常',
          timestamp: new Date().setTime(now - 1000 * 360),
          unRead: true
        },
        {
          rainId: 2,
          railName: '2#轨道',
          description: '2#轨道被占用',
          timestamp: new Date().setTime(now - 1000 * 720),
          unRead: false
        }
      ]);
      setLoading(false);
    }, 2000);
  }, []);
  return {
    loading,
    data: list,
    refresh
  };
};


export const useDevice = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IDeviceItem[]>([]);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let newList = [...list].reverse();
      setList(newList);
      setLoading(false);
    }, 1000);
  }, [list]);
  useEffect(() => {
    const now = Date.now();
    setTimeout(() => {
      setList([
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
          name: '2#轨道',
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
      ]);
      setLoading(false);
    }, 2000);
  }, []);
  return {
    loading,
    data: list,
    refresh
  };
};

//一天的毫秒
const ONE_DAY = 3600 * 1000 * 24;
export const useTemperatureHistory = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<ITempHistory[]>([]);

  useEffect(()=> {
    Helper.writeLog('温度历史：', list)
  }, [list])
  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setList(generateMockTempHisData());
      setLoading(false);
    }, 1000);
  }, [list]);
  useEffect(() => {
    setTimeout(() => {
      setList(generateMockTempHisData());
      setLoading(false);
    }, 2000);
  }, []);
  return {
    loading,
    data: list,
    refresh
  };
};

export const useRailUsingHistory = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IRailUsingHistory[]>([]);

  useEffect(()=> {
    Helper.writeLog('轨道使用历史：', list)
  }, [list])

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setList(generateRailHisData());
      setLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setList(generateRailHisData());
      setLoading(false);
    }, 2000);
  }, []);
  return {
    loading,
    data: list,
    refresh
  };
};


const generateMockTempHisData = () => {
  const now = Date.now();
  const tempHisList: ITempHistory[] = [];

  for (let i = 6; i >= 0; i--) {
    tempHisList.push({
      temp: Math.random() * 200 - 50,
      timestamp: now - i * ONE_DAY
    });
  }

  return tempHisList;
};


const generateRailHisData = () => {
  const now = Date.now();
  const railHisList: IRailUsingHistory[] = [];
  const shaftArray = [8, 16, 32, 63];
  for (let i = 0; i < 7; i++) {
    railHisList.push({
      type: 'date',
      timestamp: now - i * ONE_DAY
    });
    railHisList.push({
      type: 'history',
      using: false,
      timestamp: now - i * ONE_DAY,
      description: `列车驶离，轨道空闲`
    });
    railHisList.push({
      type: 'history',
      timestamp: now - i * ONE_DAY - Math.round(Math.random() * 4000) * 1000,
      using: true,
      description: `轴数为 ${shaftArray[Math.round(Math.random() * 3)]} 的列车进站`
    });
  }

  return railHisList;
};
