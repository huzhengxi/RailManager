/**
 * Created by jason on 2022/9/13.
 */
import {useTitle} from '../hooks/navigation-hooks';
import {Alert, View} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';


export default function AddDevice() {
  useTitle('添加设备');

  const onSuccess = (content: any) => {
    Alert.alert('', JSON.stringify(content, null, 2));
  };
  return (
      <CameraScreen
        focusMode={'off'}
        ratioOverlayColor={'yellow'}
        ratioOverlay={'1:1'}
        hideControls={true}
        showCapturedImageCount={true}
        cameraFlipImageStyle={{width: 100, height: 100, backgroundColor:'red'}}
        cameraRatioOverlay={.6}
        scanBarcode={true}
        onReadCode={(event) => {
          console.log('readCode:', event.nativeEvent.codeStringValue)
        }}
        showFrame={true}

        frameColor='green'
      />

  );
}
