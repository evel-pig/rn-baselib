import { createAction, ActionFunctionAny, Action } from 'redux-actions';
import { call, put, take, select } from 'redux-saga/effects';
import { DeviceEventEmitter } from 'react-native';
import querystring from 'querystring';
import xFetch from './xFetch';

declare const console: any;

export interface ApiConfig {
  /** api 接口的path */
  path: string;
  /** 请求方式, 默认 POST */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
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

export interface NodeProps {
  name: ApiActionNames;
  action: ActionFunctionAny<Action<{}>>;
}

export type NodeConfig<T> = {
  [key in keyof T]: NodeProps;
};

interface Api<T> {
  node: NodeConfig<T>;
  sagas: any[];
}

export interface ApiModelOptions {
  /** 请求接口地址 */
  API_URL: string;
  /** Response 字段以及状态码*/
  RESPONSE?: {
    /** 状态码字段 */
    STATUS_NAME: string;
    /** 文字描述字段 */
    DES_NAME: string;
    /** 成功状态码 */
    SUCCESS_CODE: number[];
  };
  /** 全局请求Header */
  HEADERS?: {
    /** 请求Header是否要带token */
    token?: boolean;
    [key: string]: any;
  };
  /** 请求超时时间(ms) */
  NET_TIME?: number;
}

let OPTIONS: Partial<ApiModelOptions> = {
  NET_TIME: 30000,
  RESPONSE: {
    STATUS_NAME: 'status',
    DES_NAME: 'des',
    SUCCESS_CODE: [0],
  },
};

export function setApiOptions(options: ApiModelOptions) {
  OPTIONS = {
    ...OPTIONS,
    ...options,
  };
}

const DYNAMIC_API_REG = new RegExp(/:\w+/);

/**
 * 创建API Action的名字
* @param ModelName
 * @param apiConfig
 */
function makeActionNames(ModelName: string, apiConfig: ApiConfig): ApiActionNames {
  const modelName = ModelName.toLocaleUpperCase();
  const { method, path } = apiConfig;
  return {
    request: `${modelName}_${method}:${path}/request`,
    success: `${modelName}_${method}:${path}/success`,
    error: `${modelName}_${method}:${path}/error`,
    fail: `${modelName}_${method}:${path}/fail`,
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

    if (opts.headers.token) {
      if (typeof (opts.headers.token) !== 'string') opts.headers.token = '';
    }

    // 请求路径
    let apiPath = apiConfig.path;
    // 请求url动态id的名称
    let idKey;

    // if (apiPath.match(DYNAMIC_API_REG)) {
    //   idKey = apiPath.match(DYNAMIC_API_REG)[0].slice(1);
    // }
    // // 把动态id从参数中取出来拼接到请求path中;
    // if (idKey) {
    //   let pathId = data[idKey];
    //   if (pathId !== null && pathId !== undefined) {
    //     apiPath = apiPath.replace(DYNAMIC_API_REG, pathId);
    //     delete data[idKey]; // 把对应的id取出来拼接到了url,删除原始数据中的id;
    //   } else {
    //     console.error(`请检查传递参数是否缺少${idKey}`);
    //   }
    // }

    while (apiPath.match(DYNAMIC_API_REG)) {
      idKey = apiPath.match(DYNAMIC_API_REG)[0].slice(1);
      if (idKey) {
        let pathId = data[idKey];
        if (pathId !== null && pathId !== undefined) {
          apiPath = apiPath.replace(DYNAMIC_API_REG, pathId);
          delete data[idKey]; // 把对应的id取出来拼接到了url,删除原始数据中的id;
        } else {
          console.error(`请检查传递参数是否缺少${idKey}`);
          break;
        }
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
    console.log('请求路径：', url);
    console.log(opts);
    const res = await xFetch(url, opts, OPTIONS.NET_TIME);
    return res;
  };
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
      const { except = {}, ...rest } = payload;

      const { RESPONSE, HEADERS } = OPTIONS;

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
          // console.log('api：', OPTIONS.API_URL + apiConfig.path);
          console.log('请求参数：', rest);
          console.groupEnd();
        }

        // 发起请求
        const response = yield call(request, rest, exceptHeaders);

        if (__DEV__ && console.group) {
          console.group('%c 网络请求成功', 'color: blue; font-weight: lighter;');
          console.log('api', apiConfig.path);
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
        } else {
          // 发起错误Action
          yield put(createAction<any>(actionNames.error)({
            req: requestAction.payload || null,
            res: response,
          }));
          DeviceEventEmitter.emit(actionNames.error, { req: requestAction.payload, res: response });
        }
      } catch (error) {

        if (__DEV__ && console.group) {
          console.group('%c 网络请求失败', 'color: red; font-weight: lighter;');
          console.log('请求路径：', apiConfig.path);
          console.log('错误信息：', error);
          console.groupEnd();
        }

        // 发起失败 Aciton
        yield put(createAction<any>(actionNames.fail)({
          req: requestAction.payload || null,
          res: error,
        }));
        DeviceEventEmitter.emit(actionNames.fail, { req: requestAction.payload, res: error });
      }
    }
  };
}

/**
 * 创建api相关方法
 * @param modelName string
 * @param apiConfigs ApiConfig
 */
export function initApi<T>(modelName: string, apiConfigs: ApiConfigs<T>): Api<T> {
  const node = {} as NodeConfig<T>;
  const sagas = [];
  Object.keys(apiConfigs).forEach(key => {
    let apiConifg: ApiConfig = {
      method: 'POST',
      ...apiConfigs[key],
    };

    let actionNames = makeActionNames(modelName, apiConifg);
    let request = makeRequest(apiConifg);
    let obj = {} as NodeProps;
    const effect = makeEffect(request, actionNames, apiConifg);
    sagas.push(effect);
    obj.name = actionNames;
    obj.action = createAction(actionNames.request);
    node[key] = obj;
  });
  return {
    sagas,
    node,
  };
}
