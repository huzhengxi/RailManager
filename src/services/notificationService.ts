/**
 * Created by jason on 2023/3/8.
 */
import BackgroundService from 'react-native-background-actions';
import {AppColor} from "../utils/styles";
import store from "../store";

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: any) => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  // eslint-disable-next-line no-async-promise-executor
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i, 'state:', store.getState());
      await BackgroundService.updateNotification({
        ...taskDataArguments,
        taskDesc: `hello${i}`,
      }); // Only Android, iOS will ignore this call
      await sleep(delay);
    }
  });
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
    delay: 5000,
  },
  linkingURI: 'com.anonymous.railManager:', // Add this
};

export const startNotificationService = () => {
  return BackgroundService.start(veryIntensiveTask, options);
};

export const stopNotificationService = () => {
  return BackgroundService.stop();
};
