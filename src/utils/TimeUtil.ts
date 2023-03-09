/**
 * Created by Tiger on 09/03/2023.
 */
import dayjs from "dayjs";

export const timeFormat = (timestamp: number, format: string): string => {
  return dayjs(`${timestamp}`.length < 13 ? timestamp * 1000 : timestamp).format(format)
}
