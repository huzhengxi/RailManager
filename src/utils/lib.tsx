/**
 * Created by jason on 2022/9/12.
 */
import {FC, ReactNode} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

export const RoundView: FC<{ children: ReactNode; style?: ViewStyle }> = ({children, style = {}}) => {
  return (
    <View
      style={[
        {
          marginHorizontal: 20,
          marginTop: 15,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          paddingLeft: 15,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export const Loading = () => (
  <View style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator/>
  </View>
);


export const HeaderRightButton: FC<{ source: ImageSourcePropType, onPress: () => void }> = ({source, onPress}) => {
  return <TouchableOpacity
    activeOpacity={0.6}
    style={{marginRight: 15}}
    onPress={onPress}>
    <Image
      source={source}
      style={{width: 30, height: 30, resizeMode: 'contain'}}
    />
  </TouchableOpacity>
}


export const EmptyView: FC<{ text: string, source?: ImageSourcePropType, iconStyle?: ImageStyle, onPress?: () => void }>
  = ({
       text,
       iconStyle,
       source,
       onPress
     }) => {
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <TouchableOpacity activeOpacity={.5} style={{alignItems: 'center'}} disabled={!onPress} onPress={onPress}>
      <Image style={[{width: 30, height: 30}, iconStyle]} source={source || require('../../assets/empty.png')}/>
      <Text style={{color: 'gray', marginTop: 5}}>{text}</Text>
    </TouchableOpacity>
  </View>
}
