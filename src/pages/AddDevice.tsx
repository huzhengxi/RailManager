/**
 * Created by jason on 2022/9/13.
 */
import {Alert, View} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';
import {useTitle} from '../hooks/navigation-hooks';
import {useAppDispatch} from '../store';
import Helper from '../utils/helper';
import {IDevice, RailWayState} from '../utils/types';
import {useNavigation} from '@react-navigation/native';
import {AliIoTAPIClient} from '../utils/aliIotApiClient';
import {ONE_DAY} from '../utils/define';
import {addDevice} from '../features/deviceListSlice';
import {useState} from 'react';
import {Loading} from '../utils/lib';
import {Modal} from "@ant-design/react-native";

let scanBusy = false;

export default function AddDevice() {
  useTitle('添加设备');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const onSuccess = async (event: any) => {
    if (scanBusy) {
      return;
    }
    scanBusy = true;
    Helper.writeLog('readCode:', event.nativeEvent.codeStringValue);
    try {
      const device = JSON.parse(event.nativeEvent.codeStringValue) as IDevice;
      if (device.deviceId && device.productKey) {
        setLoading(true);
        const queryClient = AliIoTAPIClient.getInstance();
        const deviceDetail = await queryClient.queryDeviceDetail(device.deviceId);
        if (!deviceDetail.Success) {
          Helper.writeLog('获取设备详情失败', deviceDetail);
          Alert.alert('添加失败', '获取设备详情失败');
          navigation.goBack();
          return;
        }
        device.name = deviceDetail?.Data?.Nickname ?? device.deviceId;
        device.productKey = deviceDetail?.Data?.ProductKey;
        Helper.writeLog('设备详情:', deviceDetail);
        const endTime = Date.now();
        const startTime = endTime - ONE_DAY * 7;
        const currentData = await queryClient.queryDeviceHistoryData(
          device.deviceId,
          startTime,
          endTime,
          'railway_state',
          1
        );
        if (!currentData.Success) {
          Helper.writeLog('获取最近一条数据失败：', currentData);
          navigation.goBack();
          return;
        }
        Helper.writeLog('最近一条数据,', currentData);
        const railwayState = JSON.parse(currentData?.Data?.List?.PropertyInfo?.[0]?.Value) as RailWayState['value'];
        Helper.writeLog('railwayState:', railwayState);
        device.temperature = railwayState?.temperature;
        device.isUse = railwayState?.occupy_state === 'busy';
        device.status = railwayState?.broken_state;
        device.timestamp = railwayState?.timestamp;
        Modal.prompt(
          '添加成功',
          '请修改设备名称',
          [
            {
              text: '取掉',
              onPress: (...e: any) => {
                navigation.goBack();
              }
            },
            {
              text: '确定',
              onPress: (...e: any) => {
                device.name = e?.[0] ?? device.deviceId
                dispatch(addDevice(device));
                navigation.goBack();
              }
            },
          ],
          'default',
          device.name || device.deviceId,
        )

      } else {
        scanBusy = false;
      }
    } catch (error) {
      Alert.alert('添加失败');
      scanBusy = false;
      Helper.writeLog('添加设备出错：', error);
    }
  };
  return (
    <View style={{flex: 1}}>
      {loading && <Loading/>}
      {!loading && (
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
      )}
    </View>
  );
}
