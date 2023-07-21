/**
 * Created by jason on 2022/9/13.
 */
import {Alert, View} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';
import {useTitle} from '../hooks/navigation-hooks';
import {useAppDispatch} from '../store';
import Helper from '../utils/helper';
import {IQRCode, IRailway, RailWayEvent, RailwayData} from '../utils/types';
import {useNavigation} from '@react-navigation/native';
import {AliIoTAPIClient} from '../utils/aliIotApiClient';
import {ONE_DAY} from '../utils/define';
import {addDevice} from '../features/deviceListSlice';
import {useState} from 'react';
import {Loading} from '../utils/lib';
import {Modal} from '@ant-design/react-native';
<<<<<<< HEAD
import {ProductKey} from '../localconfig/config';
=======
import {parseResponseData} from '../utils/httpUtil';
>>>>>>> 26475f8e0b3dea458264950cdcbbe0dd3d156599

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
<<<<<<< HEAD
      const device = JSON.parse(event.nativeEvent.codeStringValue) as IDevice;
      device.productKey = ProductKey;
      console.log('device:', device);
      if (device.deviceId) {
=======
      const qrCode = JSON.parse(event.nativeEvent.codeStringValue) as IQRCode;
      if (qrCode.id) {
>>>>>>> 26475f8e0b3dea458264950cdcbbe0dd3d156599
        setLoading(true);
        const queryClient = AliIoTAPIClient.getInstance();
        const device: IRailway = {
          railwayId: qrCode.id,
          name: '轨道名称',
          timestamp: 0,
          isBroken: false,
          isOccupied: false,
        };
        const endTime = Date.now();
        const startTime = endTime - ONE_DAY * 7;
        const responseData = await queryClient.queryDeviceHistoryData(startTime, endTime, 'railway_data', 50);
        if (!responseData.Success) {
          Helper.writeLog('最近一条数据,', responseData);
          const {history} = parseResponseData<RailwayData>(responseData);
          const findRailway = history.find(({railway_id}) => railway_id === device.railwayId);
          if (findRailway) {
            Helper.writeLog('railwayState:', findRailway);
            device.temperature = findRailway.temperature;
            device.isOccupied = findRailway.is_occupied;
            device.isBroken = findRailway.is_broken;
            device.timestamp = findRailway.timestamp;
          }
        } else {
          Helper.writeLog('获取最近一条数据失败');
        }

        Modal.prompt(
          '添加成功',
          '请修改设备名称',
          [
            {
              text: '取消',
              onPress: (...e: any) => {
                navigation.goBack();
              },
            },
            {
              text: '确定',
              onPress: (...e: any) => {
<<<<<<< HEAD
                device.name = e?.[0] ?? device.deviceId;
=======
                device.name = e?.[0] ?? device.railwayId;
>>>>>>> 26475f8e0b3dea458264950cdcbbe0dd3d156599
                dispatch(addDevice(device));
                navigation.goBack();
              },
            },
          ],
          'default',
<<<<<<< HEAD
          device.name || device.deviceId
=======
          device.name || device.railwayId
>>>>>>> 26475f8e0b3dea458264950cdcbbe0dd3d156599
        );
      } else {
        scanBusy = false;
        Alert.alert('添加失败', '验证码不合法');
      }
    } catch (error) {
      Alert.alert('添加失败');
      scanBusy = false;
      Helper.writeLog('添加设备出错：', error);
    }
  };
  return (
    <View style={{flex: 1}}>
      {loading && <Loading />}
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
          cameraRatioOverlay={undefined}
          captureButtonImage={undefined}
          captureButtonImageStyle={{}}
          cameraFlipImage={undefined}
          cameraFlipImageStyle={{}}
          torchOnImage={undefined}
          torchOffImage={undefined}
          torchImageStyle={{}}
          onBottomButtonPressed={function (event: any): void {}}
        />
      )}
    </View>
  );
}
