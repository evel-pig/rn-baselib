import { handleActions, ActionFunctionAny, Action } from 'redux-actions';
import { initAction, ActionKeys } from './initAction';
import { initApi, ApiActionNames, ApiConfigs } from './initApi';

export { initAction } from './initAction';
export { initApi, setApiOptions, ApiModelOptions } from './initApi';

interface Actions<T, K> {
  simple: { [key in keyof T]: ActionFunctionAny<Action<any>> };
  api: { [key in keyof K]: ActionFunctionAny<Action<any>> };
}

interface ActionNames<T, K> {
  simple: { [key in keyof T]: string };
  api: { [key in keyof K]: ApiActionNames };
}

interface ReducerOptions<T, K> {
  simpleActionNames: { [key in keyof T]: string };
  apiActionNames: { [key in keyof K]: ApiActionNames };
  createReducer: typeof handleActions;
}

interface ActionsAndActionNames<T, K> {
  actions: Actions<T, K>;
  actionNames: ActionNames<T, K>;
}

interface ModelOptions<T, K, P> {
  modelName: string;
  action?: {
    simple?: ActionKeys<T>;
    api?: ApiConfigs<K>;
  };
  reducer?: (options: ReducerOptions<T, K>) => any;
  sagas?: (options: ActionsAndActionNames<T, K>) => any[];
}

export interface Model<T, K, P> extends ActionsAndActionNames<T, K> {
  modelName: string;
  reducer: any;
  sagas: any[];
}

export default function createModel<T, K, P>(options: ModelOptions<T, K, P>): Model<T, K, P> {

  const model = {
    modelName: options.modelName,
    actions: {
      simple: {},
      api: {},
    },
    actionNames: {
      simple: {},
      api: {},
    },
    reducer: null,
    sagas: [],
  } as Model<T, K, P>;

  const { modelName, action = {} } = options;

  if (action.simple && Object.keys(action.simple).length > 0) {
    const _actions = initAction(modelName, action.simple);
    model.actions.simple = _actions.actions;
    model.actionNames.simple = _actions.actionNames;
  }

  if (action.api && Object.keys(action.api).length > 0) {
    const _apis = initApi(modelName, action.api);
    model.actions.api = _apis.apiActions;
    model.actionNames.api = _apis.apiActionNames;
    model.sagas = model.sagas.concat(_apis.sagas);
  }

  if (options.reducer && typeof options.reducer === 'function') {
    model.reducer = options.reducer({
      simpleActionNames: model.actionNames.simple,
      apiActionNames: model.actionNames.api,
      createReducer: handleActions,
    });
  }

  if (options.sagas && typeof options.sagas === 'function') {
    model.sagas = model.sagas.concat(options.sagas({
      actionNames: model.actionNames,
      actions: model.actions,
    }));
  }

  return model;
}
