/**
 * Created by Tiger on 09/03/2023.
 */
import dayjs from 'dayjs';

export const timeFormat = (timestamp: number, format: string): string => {
  return dayjs(`${timestamp}`.length < 13 ? timestamp * 1000 : timestamp).format(format);
};

export const timeValid = (timestamp: number): boolean => {
  const minTimestamp = Math.round(Date.now() / 1000) - 3600 * 24 * 7;
  const maxTimestamp = Math.round(Date.now() / 1000);
  return `${timestamp}`.length === 10 && timestamp >= minTimestamp && timestamp <= maxTimestamp;
};

export const valueValid = (value: any): boolean => {
  return value !== null && value !== undefined && !isNaN(value) && Number(value) < 9999;
};
