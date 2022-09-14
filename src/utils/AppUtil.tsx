/**
 * Created by jason on 2022/9/12.
 */
import {DeviceStatus} from './types';
import {AppColor} from './styles';

/**
 * 获取轨道状态颜色  正常为绿色，异常为红色
 * @param status
 */
const getDeviceStatusColor = (status: DeviceStatus) => {
  if (status === 'abnormal') {
    return AppColor.red;
  }
  return AppColor.green;
};

/**
 * 获取温度颜色表示
 * @param temperature
 */
const getTemperatureColor = (temperature: number) => {
  if (temperature > 60) {
    return AppColor.red;
  }

  if (temperature < 0) {
    return AppColor.cold;
  }

  return AppColor.green;
};

/**
 * 获取轨道使用状态颜色表示，被占用为红色，未占用为绿色
 * @param isUsing
 */
const getDeviceUsingColor = (isUsing: boolean) => {
  if (isUsing) {
    return AppColor.red;
  }
  return AppColor.green;
};

export default {
  getDeviceStatusColor,
  getTemperatureColor,
  getDeviceUsingColor
};
