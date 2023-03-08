/**
 * Created by jason on 2023/3/8.
 */
import BackgroundService from 'react-native-background-actions';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: any) => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  // eslint-disable-next-line no-async-promise-executor
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      await BackgroundService.updateNotification({
        ...taskDataArguments,
        taskDesc: `hello${i}`,
      }); // Only Android, iOS will ignore this call
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
    package: 'com.anonymous.RailManager',
  },
  color: '#ff00ff',
  linkingURI: 'www.baidu.com', // See Deep Linking for more info
  parameters: {
    delay: 5000,
  },
};

export const startNotificationService = () => {
  return BackgroundService.start(veryIntensiveTask, options);
};

export const stopNotificationService = () => {
  return BackgroundService.stop();
};
