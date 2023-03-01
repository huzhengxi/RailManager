/**
 * Created by jason on 2022/9/12.
 */
import {FC, ReactNode} from 'react';
import {ActivityIndicator, View, ViewStyle} from 'react-native';

export const RoundView: FC<{children: ReactNode; style?: ViewStyle}> = ({children, style = {}}) => {
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
    <ActivityIndicator />
  </View>
);
