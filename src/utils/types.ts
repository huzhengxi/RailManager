/**
 * Created by jason on 2022/9/12.
 */

/**
 * 通知定义
 */
export interface INotificationItem {
  /**轨道id */
  readonly rainId: number,
  /**轨道名称 */
  railName: string;
  /**通知时间 */
  timestamp: number;
  /**通知内容 */
  description: string;
  /**是否已读 */
  unRead: boolean
}

/**
 * 设备定义
 */
export interface IDeviceItem {
  /**id */
  readonly  deviceId: number;
  /**轨道名称 */
  name: string;
  /**数据更新时间 */
  timestamp: number;
  /**状态：良好、断轨 */
  status: 'normal' | 'abnormal';
  /**轨道温度 */
  temperature: number;
  /**轨道是否占用 */
  isUse: boolean;
}
