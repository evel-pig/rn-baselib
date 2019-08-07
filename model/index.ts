import { handleActions } from 'redux-actions';
import { initNode, HelpKeys, HelpNode } from './initHelpNode';
import { initApi, ApiConfigs, NodeConfig } from './initApi';

interface ReducerOptions<T, K> {
  createReducer: typeof handleActions;
  apiNode: NodeConfig<T>;
  helpNode: HelpNode<K>;
}

interface SagaOptions<T, K> {
  apiNode: NodeConfig<T>;
  helpNode: HelpNode<K>;
}

interface ModelOptions<T, K> {
  modelName: string;
  help?: HelpKeys<K>;
  api?: ApiConfigs<T>;
  reducer?: (options: ReducerOptions<T, K>) => any;
  sagas?: (options: SagaOptions<T, K>) => any[];
}

export interface Model<T, K> {
  modelName: string;
  help?: HelpNode<K>;
  api?: NodeConfig<T>;
  reducer: any;
  sagas: any[];
}

export default function createModel<T, K>(options: ModelOptions<T, K>): Model<T, K> {

  const model = {
    modelName: options.modelName,
    help: {},
    api: {},
    reducer: null,
    sagas: [],
  } as Model<T, K>;

  const { modelName, help = {} as HelpKeys<K>, api = {} as ApiConfigs<T> } = options;

  if (help && Object.keys(help).length > 0) {
    const _helpNodes = initNode(modelName, help);
    model.help = _helpNodes;
  }

  if (api && Object.keys(api).length > 0) {
    const _apis = initApi<T>(modelName, api);
    model.api = _apis.node;
    model.sagas = model.sagas.concat(_apis.sagas);
  }

  if (options.reducer && typeof options.reducer === 'function') {
    model.reducer = options.reducer({
      apiNode: model.api,
      helpNode: model.help,
      createReducer: handleActions,
    });
  }

  if (options.sagas && typeof options.sagas === 'function') {
    model.sagas = model.sagas.concat(options.sagas({
      apiNode: model.api,
      helpNode: model.help,
    }));
  }

  return model;
}
