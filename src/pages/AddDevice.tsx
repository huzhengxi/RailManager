/**
 * Created by jason on 2022/9/13.
 */
import {useTitle} from '../hooks/navigation-hooks';
import {Alert, Image, View} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';


export default function AddDevice() {
  useTitle('添加设备');

  const onSuccess = (content: any) => {
    Alert.alert('', JSON.stringify(content, null, 2));
  };
  return (
      <View style={{flex: 1}}>
        <CameraScreen
          focusMode={'off'}
          hideControls={false}
          ratioOverlayColor={'blue'}
          scanBarcode={true}
          onReadCode={(event) => {
            console.log('readCode:', event.nativeEvent.codeStringValue)
          }}
          showFrame={true}
          laserColor={'green'}
          frameColor='green'
        />
      </View>

  );
}
