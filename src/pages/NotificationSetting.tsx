/**
 * Created by jason on 2023/3/8.
 */
import {useTitle} from '../hooks/navigation-hooks';
import {Item} from './Setting';
import BackgroundService from 'react-native-background-actions';
import {startNotificationService, stopNotificationService} from '../services/notificationService';
import {useEffect, useState} from 'react';
import {Switch} from '@ant-design/react-native';
import {RoundView} from '../utils/lib';
import {checkNotifications, openSettings, PermissionStatus} from 'react-native-permissions';
import helper from '../utils/helper';

export default function NotificationSetting() {
  useTitle('通知设置');
  const [serviceIsOn, setOn] = useState(BackgroundService.isRunning());
  const [permission, setPermission] = useState<PermissionStatus>('denied');
  useEffect(() => {
    checkNotifications().then((result) => {
      helper.writeLog('通知权限:', result);
      setPermission(result.status);
    });
  }, []);
  return (
    <RoundView>
      <Item
        title={'通知服务'}
        split
        RightView={() => (
          <Switch
            checked={serviceIsOn}
            onPress={() => {
              if (BackgroundService.isRunning()) {
                stopNotificationService().finally(() => {
                  setOn(BackgroundService.isRunning());
                });
              } else {
                startNotificationService?.()?.finally(() => {
                  setOn(BackgroundService.isRunning());
                });
              }
            }}
          />
        )}
      />
      <Item
        title={'通知权限'}
        RightView={() => (
          <Switch
            disabled={permission === 'granted'}
            checked={permission === 'granted'}
            onPress={() => openSettings()}
          />
        )}
      />
    </RoundView>
  );
}
