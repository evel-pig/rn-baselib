import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { composeWithDevTools } from 'remote-redux-devtools';

const sagaMiddleware = createSagaMiddleware();

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  (state: any) => state.nav,
);

interface Options {
  /** app name */
  name: string;
  /** 持久化储存白名单 */
  whitelist?: string[];
  /** store reducers */
  reducers?: any;
  /** store middlewares */
  middlewares?: any[];
}

function configureStore(opts: Options) {

  const {
    name,
    whitelist = [],
    reducers = {},
    middlewares = [],
  } = opts;

  const _persistConfig = {
    key: name,
    storage,
    whitelist: ['userToken'].concat(whitelist),
  };

  const _persistedReducer = persistReducer(_persistConfig, reducers);

  const _middlewares = [
    sagaMiddleware,
    navMiddleware,
  ].concat(middlewares);

  let _enhancer;

  if (__DEV__) {
    _middlewares.push(createLogger());
    const composeEnhancers = composeWithDevTools({ realtime: true, hostname: 'localhost', port: 8005 });
    _enhancer = composeEnhancers(applyMiddleware(..._middlewares));
  } else {
    _enhancer = compose(applyMiddleware(..._middlewares));
  }

  const store = createStore(_persistedReducer, _enhancer);

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
}

export function runSaga(sagas = []) {
  function* rootSaga() {
    for (let saga of sagas) {
      yield fork(saga);
    }
  }

  sagaMiddleware.run(rootSaga);
}

export default configureStore;
