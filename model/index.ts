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
  actionNames: ActionNames<T, K>;
  handleActions: typeof handleActions;
}

interface ActionsAndActionNames<T, K> {
  actions: Actions<T, K>;
  actionNames: ActionNames<T, K>;
}

interface ModelOptions<T, K, P> {
  modelName: string;
  actions?: {
    simple?: ActionKeys<T>;
    api?: ApiConfigs<K>;
  };
  reducers?: (options: ReducerOptions<T, K>) => {
    [key in keyof P]: any;
  };
  sagas?: (options: ActionsAndActionNames<T, K>) => any[];
}

export interface Model<T, K, P> extends ActionsAndActionNames<T, K> {
  reducers: {
    [key in keyof P]: any;
  };
  sagas: any[];
}

export function initModel<T, K, P>(options: ModelOptions<T, K, P>): Model<T, K, P> {

  const model = {
    actions: {
      simple: {},
      api: {},
    },
    actionNames: {
      simple: {},
      api: {},
    },
    reducers: {},
    sagas: [],
  } as Model<T, K, P>;

  const { modelName, actions = {} } = options;

  if (actions.simple && Object.keys(actions.simple).length > 0) {
    const _actions = initAction(modelName, actions.simple);
    model.actions.simple = _actions.actions;
    model.actionNames.simple = _actions.actionNames;
  }

  if (actions.api && Object.keys(actions.api).length > 0) {
    const _apis = initApi(modelName, actions.api);
    model.actions.api = _apis.apiActions;
    model.actionNames.api = _apis.apiActionNames;
    model.sagas = model.sagas.concat(_apis.sagas);
  }

  if (options.reducers && typeof options.reducers === 'function') {
    model.reducers = options.reducers({
      actionNames: model.actionNames,
      handleActions: handleActions,
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
