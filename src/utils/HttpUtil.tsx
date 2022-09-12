/**
 * Created by jason on 2022/9/12.
 */
import {useCallback, useEffect, useState} from 'react';
import {IDeviceItem, INotificationItem} from './types';


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
