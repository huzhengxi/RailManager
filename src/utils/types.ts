/**
 * Created by jason on 2022/9/12.
 */

/** 二维码信息 */
export interface IQRCode {
  id: string;
}

/** 通知定义 */
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

export interface IRailway {
  /**id */
  readonly railwayId: string;
  /**轨道名称 */
  name: string;
  /**数据更新时间 */
  timestamp: number;
  /**状态：是否断轨 */
  isBroken: boolean;
  /**轨道温度 */
  temperature?: number;
  /**轨道是否占用 */
  isOccupied: boolean;
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
  isNormal?: boolean;
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
    railway_data?: MqttDataItem<RailwayData>;
    railway_event?: MqttDataItem<RailWayEvent>;
    train_data?: MqttDataItem<TrainData>;
  };
}

interface MqttDataItem<T> {
  time: number;
  value: T;
}

export interface RailwayData {
  readonly railway_id: string;

  /** 是否断轨 */
  is_broken: boolean;
  /** 是否被占用 */
  is_occupied: boolean;
  /** 温度 */
  temperature: number;
  /** 时间戳 */
  timestamp: number;
}

export interface RailWayEvent {
  readonly railway_id: string;
  type: 'train_enter' | 'train_leave' | 'railway_broken' | 'railway_unbroken';
  timestamp: number;
}

export interface TrainData {
  readonly railway_id: string;
  axis_number: number;
  enter_timestamp: number;
  leave_timestamp: number;
}

export type Identifier = 'railway_event' | 'train_data' | 'railway_data';

export interface IHistory<T> {
  hasNext: boolean;
  nextTime?: number;
  history: T[];
}
