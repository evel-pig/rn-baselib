import { ToastAndroid, Keyboard, Platform, BackHandler } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { NavTransitionType } from './NavTransitionHelp';

export interface NavigationParams {
  /** 页面切换效果 */
  transtionType?: NavTransitionType;
  [key: string]: any;
}

export class Navigation {
  static store: {
    dispatch: any;
    getState: any;
  };
  private _pushing: boolean;
  private _backTwice: boolean;
  private _backActionMap: {
    [key: string]: () => void;
  };

  constructor() {
    this._pushing = false;
    this._backTwice = false;
    this._backActionMap = {};
  }

  static setStore(store) {
    Navigation.store = store;
  }

  /**
   * 路由堆栈:push(等同于this.props.navigation.navigate)
   * @param {string} routeName
   * @param {NavigationParams} [params]
   * @returns
   * @memberof Navigation
   */
  push = (routeName: string, params?: NavigationParams) => {
    const { dispatch } = Navigation.store;
    if (typeof routeName === 'string') {
      if (this._pushing) {
        return false;
      } else {
        this._pushing = true;
        const timer = setTimeout(() => {
          this._pushing = false;
          clearTimeout(timer);
        }, 500);
        Keyboard.dismiss(); // push新页面的时候隐藏键盘;
        dispatch(StackActions.push({ routeName, params }));
      }
    }
  }

  /**
   * 路由堆栈:pop
   * @param {number} [n=1]
   * @param {*} [params]
   * @memberof Navigation
   */
  pop = (n: number = 1, params?: any) => {
    const { dispatch } = Navigation.store;
    dispatch(StackActions.pop({ n, immediate: params && params.immediate }));
  }

  /**
   * 路由堆栈:popTo
   * @param {string} [routeName='index']
   * @param {*} [params]
   * @memberof Navigation
   */
  popTo = (routeName: string = 'index', params?: any) => {
    const { getState } = Navigation.store;
    const { routes, index } = getState().nav;
    let popNumber;
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.routeName === routeName) {
        popNumber = index - i;
        break;
      }
    }
    if (popNumber) {
      this.pop(popNumber, params);
    } else {
      console.warn(`堆栈中没有 ${routeName} 页面`);
    }
  }

  /**
   * 路由堆栈:popToTop
   * @memberof Navigation
   */
  popToTop = () => {
    const { dispatch } = Navigation.store;
    dispatch(StackActions.popToTop());
  }

  /**
   * 路由堆栈：替换当前路由
   * @param {string} routeName
   * @param {NavigationParams} [params]
   * @memberof Navigation
   */
  replace = (routeName: string, params?: NavigationParams) => {
    const { dispatch } = Navigation.store;
    dispatch(StackActions.replace({
      routeName,
      params,
    }));
  }

  /**
   * 路由堆栈：重置路由
   * @param {string} [routeName='index']
   * @param {NavigationParams} [params]
   * @returns
   * @memberof Navigation
   */
  reset = (routeName: string = 'index', params?: NavigationParams) => {
    const { dispatch, getState } = Navigation.store;
    if (routeName === getState().nav.routeName) return;

    const options = {
      routeName: routeName,
      params: params,
    };

    const routes = routeName.split('/');
    if (routes.length === 2) {
      options.routeName = routes[0];
      options['action'] = NavigationActions.navigate({
        routeName: routes[1],
      });
    }

    dispatch(StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate(options)],
    }));
  }

  /**
   * 路由堆栈：设置当前页面参数
   * @param {*} params
   * @memberof Navigation
   */
  setParams = (params: any) => {
    const { dispatch, getState } = Navigation.store;
    const { routes, index } = getState().nav;
    let key = routes[index].key;
    if (routes[index].routes) {
      let subRoutes = routes[index].routes;
      key = subRoutes[routes[index].index].key;
    }
    dispatch(NavigationActions.setParams({ params, key }));
  }

  /**
   * 路由堆栈：自定义当前页面返回键处理的方法
   * @param {() => void} action
   * @memberof Navigation
   */
  backHandle = (action: () => void) => {
    const { getState } = Navigation.store;
    const { routeName } = getState().nav;
    this._backActionMap[routeName] = action;
  }

  /**
   * 返回键处理
   * @returns
   * @memberof Navigation
   */
  backAction = () => {
    const { getState } = Navigation.store;
    const { nav } = getState();
    const { routeName, index } = nav;

    if (index !== 0) {
      if (this._backActionMap[routeName] instanceof Function) {
        this._backActionMap[routeName]();
      } else {
        this.pop();
      }
      return true;
    } else if (Platform.OS === 'android') {
      if (!this._backTwice) {
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        this._backTwice = true;
        const timer = setTimeout(() => {
          this._backTwice = false;
          clearTimeout(timer);
        }, 2000);
        return true;
      } else {
        this._backTwice = false;
        BackHandler.exitApp();
        return false;
      }
    } else {
      this.pop();
    }
    return true;
  }

  /**
   * 路由堆栈：getParams
   * @template T
   * @param {*} navigation
   * @returns
   * @memberof Navigation
   */
  getParams = <T = any>(navigation) => {
    let params: T = null;
    if (!navigation.state) {
      params = {} as any;
    } else {
      params = navigation.state.params || {};
    }
    return params;
  }
}

const navigation = new Navigation();

export default navigation;
