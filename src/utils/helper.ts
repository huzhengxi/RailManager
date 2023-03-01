/**
 * Created by jason on 2022/9/15.
 */
import dayjs from 'dayjs';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

/**
 * 获取当前时间
 */
function getCurTime() {
  const now = Date.now();
  return dayjs(now).format('YYYY-MM-DD HH:mm:ss');
}

const LOG_DIR = (Platform.OS === 'android' ? RNFS.ExternalCachesDirectoryPath : RNFS.CachesDirectoryPath) + '/log';
export const LOG_FILE = LOG_DIR + '/app.log';
const SIZE_1M = 1024 * 1024; //1M

RNFS.mkdir(LOG_DIR);

function writeLog(...arg: any) {
  const content = `[${getCurTime()}] ${[...arg]
    .map((a) => (typeof a === 'object' ? JSON.stringify(a) : a))
    .join(',')}\n`;
  RNFS.appendFile(LOG_FILE, content, 'utf8').catch((error) => {
    console.log('写日志失败：', error);
  });
}

async function readLog() {
  let file = await RNFS.stat(LOG_FILE);
  try {
    let content = await RNFS.readFile(LOG_FILE, 'utf8');
    return {file, content};
  } catch (e: any) {
    console.log('读取文件错误：', e?.message);
    return {
      file,
      error: e?.message,
    };
  }
}

function clearLog() {
  RNFS.readDir(LOG_DIR)
    .then((result) => {
      return result.filter((file) => file.isFile() && file.size > SIZE_1M * 4);
    })
    .then((result) => {
      result.forEach((file) => {
        RNFS.unlink(file.path);
      });
    });
}

export default {
  writeLog,
  readLog,
  clearLog,
};
