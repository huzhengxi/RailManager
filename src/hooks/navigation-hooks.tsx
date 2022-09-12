/**
 * Created by jason on 2022/9/12.
 */
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

/**
 * 更新 navigation options
 */
const useUpdateOptions = (options: NativeStackNavigationOptions = { headerLargeTitle: false }, deps: any[] = []) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ ...options });
  }, deps);

  return useNavigation().setOptions;
};

/**
 * 设置页面的标题
 * @param title
 * @param headerLargeTitle
 */
const useTitle = (title: string = '', headerLargeTitle = false) => {
  const navigation = useNavigation();
  const route = useRoute();

  //useLayoutEffect是同步，会在第一次渲染之前设置option，避免抖动
  //useEffect是异步，会在页面第一次渲染完成后再执行，如果先是大标题，再设置成小标题的话 就会有一个抖动的效果出现
  useLayoutEffect(() => {
    if (!title) {
      const params: Record<string, any> = route.params ?? {};
      title = params?.title ?? '';
    }
    navigation.setOptions({ title, headerLargeTitle });
  }, [navigation, title]);
};



/**
 * 这个type 最终想实现的效果是：根据传入的参数，返回已传入参数为key的object，
 * 业务使用的时候，可以自动提示.
 * todo 不知道为什么，目前没有达到智能提示的效果？？
 * */
type RouteParamsType = (params: string[]) => { [K in typeof params[number]]?: any };

/**
 * 获取上个页面传入的 params 参数
 * @param params 传入想获取的参数名称，什么都不传入时取到的是全部的参数
 */
const useRouteParams: RouteParamsType = (params: string[]) => {
  const route = useRoute();
  const routeParams: Record<string, any> = route.params ?? {};
  if (params.length === 0) {
    return routeParams;
  }
  let result: { [K in typeof params[number]]: any } = {};
  params.forEach((value) => {
    result[value] = routeParams[value];
  });
  return result;
};


export {
  useUpdateOptions,
  useTitle
}
