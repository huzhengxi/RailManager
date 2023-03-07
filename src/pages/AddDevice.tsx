/**
 * Created by jason on 2022/9/13.
 */
import {Alert, View} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';
import {useTitle} from '../hooks/navigation-hooks';
import {useAppDispatch} from '../store';
import helper from '../utils/helper';
import {IDeviceItem} from '../utils/types';
import {addDevice} from '../features/deviceListSlice';
import {useNavigation} from '@react-navigation/native';

let scanBusy = false;

export default function AddDevice() {
  useTitle('添加设备');
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const onSuccess = (event: any) => {
    if (scanBusy) {
      return;
    }
    scanBusy = true;
    helper.writeLog('readCode:', event.nativeEvent.codeStringValue);
    try {
      const device = JSON.parse(event.nativeEvent.codeStringValue) as IDeviceItem;
      if (device.deviceId && device.productKey) {
        dispatch(addDevice(device));
        navigation.goBack();
      } else {
        scanBusy = false;
      }
    } catch (error) {
      scanBusy = false;
      helper.writeLog('添加设备出错：', error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <CameraScreen
        focusMode={'off'}
        hideControls={false}
        ratioOverlayColor={'blue'}
        scanBarcode
        onReadCode={onSuccess}
        showFrame
        laserColor={'green'}
        frameColor='green'
      />
    </View>
  );
}
