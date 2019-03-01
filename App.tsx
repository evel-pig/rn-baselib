import React from 'react';
import { AppRegistry, UIManager, View } from 'react-native';
import { combineReducers } from 'redux';
import { connect } from 'react-redux';
import { reducer as form } from 'redux-form';
import { NavigationContainer } from 'react-navigation';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';
import Root from './src/Root';
import configureStore, { runSaga } from './src/store';
import { setApiOptions, ApiModelOptions, Model } from './model';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

declare const global: any;

if (!__DEV__) {
  global.console = {
    info: () => { },
    log: () => { },
    warn: () => { },
    error: () => { },
    group: () => { },
    groupEnd: () => { },
  };
}

export function createNavigationNode(AppNavigator) {
  const App: any = reduxifyNavigator(AppNavigator, 'root');
  const NavNode = connect((state: any) => ({ state: state.nav }))(App);
  return NavNode;
}

interface Models {
  [key: string]: Partial<Model<any, any, any>>;
}

interface AppOptions {
  /** app name*/
  name: string;
  /** navigator */
  navigator: NavigationContainer;
  /** reduces */
  model?: Models;
  /** api options */
  apiOptions: ApiModelOptions;
  /** 持久化白名单 */
  persistWhiteList?: string[];
  /** store middlewares */
  middlewares?: any[];
}

class App {
  private _appName: string;
  private _navigator: any;
  private _store: any;
  private _persistor: any;

  constructor(opts: AppOptions) {
    this._appName = opts.name;

    const { reducers, sagas } = this.model(opts.model);

    const { store, persistor } = configureStore({
      name: opts.name,
      whitelist: opts.persistWhiteList,
      middlewares: opts.middlewares,
      reducers: reducers,
    });

    this._navigator = opts.navigator;
    this._store = store;
    this._persistor = persistor;

    runSaga(sagas);

    setApiOptions(opts.apiOptions);
  }

  model(models: Models = {}) {
    let reducers = {};
    let sagas = [];

    Object.keys(models).forEach(key => {
      const model = models[key];
      if (model.reducers && typeof model.reducers === 'object') {
        reducers = {
          ...reducers,
          ...model.reducers,
        };
      }
      if (model.sagas && Array.isArray(model.sagas)) {
        sagas = sagas.concat(model.sagas);
      }
    });

    return {
      reducers: combineReducers({
        form,
        ...reducers,
      }),
      sagas: sagas,
    };
  }

  render(node?: React.ReactNode) {

    const AppWithNavigationState = createNavigationNode(this._navigator);

    return () => (
      <Root store={this._store} persistor={this._persistor}>
        <View style={{ flex: 1 }}>
          <AppWithNavigationState />
          {node}
        </View>
      </Root>
    );
  }

  start(app) {
    AppRegistry.registerComponent(this._appName, () => app);
  }
}

export default App;
