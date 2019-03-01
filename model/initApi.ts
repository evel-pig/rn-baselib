import { createAction, ActionFunctionAny, Action } from 'redux-actions';
import { call, put, take, select } from 'redux-saga/effects';
import { DeviceEventEmitter } from 'react-native';
import querystring from 'querystring';
import xFetch from './xFetch';
import Toast from '../components/Toast';
import Loading from '../components/Loading';

declare const console: any;

export interface ApiConfig {
  /** api 接口的path */
  path: string;
  /** 请求方式 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 是否隐藏loading */
  hideLoading?: boolean;
}

export type ApiConfigs<T> = {
  [key in keyof T]: ApiConfig;
};

export interface ApiActionNames {
  request: string;
  success: string;
  error: string;
  fail: string;
}

export interface Apis<T> {
  apiActionNames: { [key in keyof T]: ApiActionNames };
  apiActions: { [key in keyof T]: ActionFunctionAny<Action<any>> };
  sagas: any[];
}

export interface ApiModelOptions {
  /** 请求接口地址 */
  API_URL: string;
  /** Response 字段以及状态码*/
  RESPONSE?: {
    STATUS_NAME: string;
    DES_NAME: string;
    SUCCESS_CODE: number[];
    LOGOUT_CODE: number[];
  };
  /** 全局请求Header */
  HEADERS?: {
    token?: boolean;
    [key: string]: any;
  };
  /** 请求超时时间(ms) */
  NET_TIME?: number;
  /** 配置TOAST选项 */
  TOAST?: (opts: { des: string }) => void;
  /** 配置LOADING选项 */
  LOADING?: {
    SHOW: () => void;
    HIDE: () => void;
  };
}

let OPTIONS: Partial<ApiModelOptions> = {
  NET_TIME: 30000,
  RESPONSE: {
    STATUS_NAME: 'status',
    DES_NAME: 'des',
    SUCCESS_CODE: [0],
    LOGOUT_CODE: [-103],
  },
};

export function setApiOptions(options: ApiModelOptions) {
  OPTIONS = {
    ...OPTIONS,
    ...options,
  };
}

export const FetchEventNames = {
  logout: 'fetch/logout',
};

const DYNAMIC_API_REG = new RegExp(/:\w+/);

let LOADING_INDEX = 0;

/**
 * 创建API Action的名字
* @param ModelName
 * @param apiConfig
 */
function makeActionNames(ModelName: string, apiConfig: ApiConfig): ApiActionNames {
  const { method, path } = apiConfig;
  return {
    request: `${ModelName}_${method}:${path}/request`,
    success: `${ModelName}_${method}:${path}/success`,
    error: `${ModelName}_${method}:${path}/error`,
    fail: `${ModelName}_${method}:${path}/fail`,
  };
}

/**
 * 创建接口请求
 * @param apiConfig
 */
function makeRequest(apiConfig: ApiConfig) {
  return async (data = {} as any, headers = {}) => {
    // 请求方式
    let method = apiConfig.method.toUpperCase();

    // 请求路径
    let apiPath = apiConfig.path;

    // 请求url动态id的名称
    let idKey;
    if (apiPath.match(DYNAMIC_API_REG)) {
      idKey = apiPath.match(DYNAMIC_API_REG)[0].slice(1);
    }

    // fetch请求的options
    let opts = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(OPTIONS.HEADERS ? OPTIONS.HEADERS : {}),
        ...headers,
      },
    } as any;

    // 把动态id从参数中取出来拼接到请求path中;
    if (idKey) {
      let pathId = data[idKey];
      if (pathId !== null && pathId !== undefined) {
        apiPath = apiPath.replace(DYNAMIC_API_REG, pathId);
        delete data[idKey]; // 把对应的id取出来拼接到了url,删除原始数据中的id;
      } else {
        console.error(`请检查传递参数是否缺少${idKey}`);
      }
    }

    if (method === 'GET') {
      apiPath = `${apiPath}?${querystring.stringify(data)}`;
    } else if (data) {
      opts.body = data ? JSON.stringify(data) : null;
    }

    if (!OPTIONS.API_URL) {
      console.error('请在APP入口设置API_URL');
    }

    const url = OPTIONS.API_URL + apiPath;

    const res = await xFetch(url, opts, OPTIONS.NET_TIME);

    return res;
  };
}

function handleLoadingShow() {
  if (OPTIONS.LOADING && typeof OPTIONS.LOADING.SHOW === 'function') {
    OPTIONS.LOADING.SHOW();
  } else {
    Loading.show();
  }
}

function handleLoadingHide() {
  if (OPTIONS.LOADING && typeof OPTIONS.LOADING.HIDE === 'function') {
    OPTIONS.LOADING.HIDE();
  } else {
    Loading.hide();
  }
}

function handleToast(message: string) {
  if (OPTIONS.TOAST && typeof OPTIONS.TOAST === 'function') {
    OPTIONS.TOAST({ des: message });
  } else {
    Toast.show({ des: message });
  }
}

/**
   * 创建saga effect
   * @param request
   * @param actionNames
   * @param apiConfig
   */
function makeEffect(request, actionNames: ApiActionNames, apiConfig: ApiConfig) {
  return function* api_request() {
    while (true) {
      const requestAction = yield take(actionNames.request);
      const payload = requestAction.payload || {};
      const { hideLoading, except = {}, ...rest } = payload;

      const { RESPONSE, HEADERS } = OPTIONS;

      // 控制loading显示
      if (LOADING_INDEX === 0 && !apiConfig.hideLoading && !hideLoading) {
        handleLoadingShow();
      }

      LOADING_INDEX++;

      try {
        // 判断是否添加token到headers中;
        let exceptHeaders = except && except.headers || {};
        if (HEADERS && HEADERS.token) {
          const userToken = yield select((state: any) => state.userToken);
          if (userToken && userToken.token) {
            exceptHeaders = {
              token: userToken.token,
              ...exceptHeaders,
            };
          }
        }

        if (__DEV__ && console.group) {
          console.group('%c 网络请求', 'color: blue; font-weight: lighter;');
          console.log('请求路径：', apiConfig.path);
          console.log('请求参数：', rest);
          console.groupEnd();
        }

        // 发起请求
        const response = yield call(request, rest, exceptHeaders);

        if (__DEV__ && console.group) {
          console.group('%c 网络请求成功', 'color: blue; font-weight: lighter;');
          console.log('请求路径：', apiConfig.path);
          console.log('返回数据：', response);
          console.groupEnd();
        }

        // 接口请求状态码返回成功状态码处理;
        if (RESPONSE.SUCCESS_CODE.includes(response[RESPONSE.STATUS_NAME])) {
          // 发起成功Aciton
          yield put(createAction<any>(actionNames.success)({
            req: requestAction.payload || null,
            res: response,
          }));
          DeviceEventEmitter.emit(actionNames.success, { req: requestAction.payload, res: response });
        } else if (RESPONSE.LOGOUT_CODE.includes(response[RESPONSE.STATUS_NAME])) {
          // 强制登出
          yield put(createAction(FetchEventNames.logout)({ status: response[RESPONSE.STATUS_NAME] }));
          DeviceEventEmitter.emit(FetchEventNames.logout, { status: response[RESPONSE.STATUS_NAME] });

        } else {
          // 发起错误Action
          yield put(createAction<any>(actionNames.error)({
            req: requestAction.payload || null,
            res: response,
          }));
          DeviceEventEmitter.emit(actionNames.error, { req: requestAction.payload, res: response });

          if (response[OPTIONS.RESPONSE.DES_NAME]) {
            handleToast(response[OPTIONS.RESPONSE.DES_NAME]);
          }
        }
      } catch (error) {

        if (__DEV__ && console.group) {
          console.group('%c 网络请求失败', 'color: red; font-weight: lighter;');
          console.log('请求路径：', apiConfig.path);
          console.log('错误信息：', error);
          console.groupEnd();
        }

        // 失败处理
        let errorMessage = '未知错误';
        if (error[OPTIONS.RESPONSE.DES_NAME]) {
          errorMessage = error[OPTIONS.RESPONSE.DES_NAME];
        } else if (error.des) {
          errorMessage = error.des;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        // 发起失败 Aciton
        yield put(createAction<any>(actionNames.fail)({
          req: requestAction.payload || null,
          res: { des: errorMessage },
        }));
        DeviceEventEmitter.emit(actionNames.fail, { req: requestAction.payload, res: { des: errorMessage } });

        // 错误提示
        handleToast(errorMessage);
      }

      // 控制loading消失
      LOADING_INDEX--;
      if (LOADING_INDEX === 0 && !apiConfig.hideLoading && !hideLoading) {
        handleLoadingHide();
      }
    }
  };
}

/**
 * 创建api Action
 * @param modelName
 * @param apiConfigs
 */
export function initApi<T extends ApiConfigs<T>>(modelName: string, apiConfigs: T): Apis<T> {
  const ModelName = modelName.toLocaleUpperCase();

  const apiActionNames = {} as any;
  const apiActions = {} as any;
  const sagas = [];

  Object.keys(apiConfigs).forEach(key => {
    let apiConifg: ApiConfig = {
      method: 'POST',
      ...apiConfigs[key],
    };

    let actionNames = makeActionNames(ModelName, apiConifg);
    apiActionNames[key] = actionNames;
    apiActions[key] = createAction(actionNames.request);
    let request = makeRequest(apiConifg);
    const effect = makeEffect(request, actionNames, apiConifg);
    sagas.push(effect);
  });
  return {
    apiActionNames,
    apiActions,
    sagas,
  };
}
