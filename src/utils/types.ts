/**
 * Created by jason on 2022/9/12.
 */

/**
 * 通知定义
 */
export interface INotificationItem {
  /**轨道名称 */
  railName: string;
  /**通知时间 */
  timestamp: number;
  /**通知内容 */
  description: string;
  /**是否已读 */
  unRead: boolean;
}

/**
 * 设备定义
 */
export type DeviceStatus = 'normal' | 'broken' | 'busy';

export interface IDevice {
  productKey: string;
  /**id */
  readonly deviceId: string;
  /**轨道名称 */
  name: string;
  /**数据更新时间 */
  timestamp?: number;
  /**状态：良好、断轨 */
  status?: DeviceStatus;
  /**轨道温度 */
  temperature?: number;
  /**轨道是否占用 */
  isUse?: boolean;
}

/**
 * 状态定义
 */
export interface StatusProps {
  /**标题 */
  title: string;
  /**状态值 */
  text: string;
  /**状态 */
  status?: DeviceStatus;
}

/**
 * 温度历史数据定义
 */

export interface ITempHistory {
  timestamp: number;
  temp: number;
  date: string;
}

/**
 * 轨道占用历史数据定义
 */
export type RailUsingHistoryDateType = 'date' | 'history';

export interface IRailUsingHistory {
  timestamp: number;
  using?: boolean;
  description?: string;
  type: RailUsingHistoryDateType;
  date: string;
}

/**
 * mqtt 消息定义
 */

export interface MqttDeviceData {
  requestId: string;
  productKey: string;
  deviceName: string;
  items: {
    railway_state: RailWayState;
    train_state: TrainState;
  };
}

export interface RailWayState {
  time: number;
  value: {
    broken_state: DeviceStatus;
    occupy_state: DeviceStatus;
    temperature: number;
    timestamp: number;
  };
}

export interface TrainState {
  time: number;
  value: {
    axis_number: number;
    enter_or_exit: 'train_in' | 'train_out';
    timestamp: number;
  };
}

export type Identifier = 'railway_state' | 'train_state';

export interface IHistory<T> {
  hasNext: boolean;
  nextTime?: number;
  history: T[];
}
