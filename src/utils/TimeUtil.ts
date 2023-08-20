/**
 * Created by Tiger on 09/03/2023.
 */
import dayjs from 'dayjs';

export const timeFormat = (timestamp: number, format: string): string => {
  const formatted = dayjs(`${timestamp}`.length < 13 ? timestamp * 1000 : timestamp).format(format);
  // console.log(`timeFormat, timestamp:${timestamp}, formatted:${formatted}`);
  return formatted;
};

export const timeValid = (timestamp: number): boolean => {
  const {length} = `${timestamp}`;
  if (![10, 13].includes(length)) return false;
  if (length === 13) {
    // eslint-disable-next-line no-param-reassign
    timestamp = Math.round(timestamp / 1000);
  }
  const minTimestamp = Math.round(Date.now() / 1000) - 3600 * 24 * 7;
  const maxTimestamp = Math.round(Date.now() / 1000);

  return timestamp >= minTimestamp && timestamp <= maxTimestamp;
};

export const valueValid = (value: any): boolean => {
  return value !== null && value !== undefined && !isNaN(value) && Number(value) < 9999;
};
