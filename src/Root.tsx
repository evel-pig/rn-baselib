import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  BackHandler,
} from 'react-native';
import { Loading } from '../components';
import { navigation } from '../tools';
import { Navigation } from '../tools/navigation';

interface RootProps {
  store: any;
  persistor: any;
}

class Root extends Component<RootProps, {}> {
  backHandler: () => boolean;

  constructor(props) {
    super(props);
    Navigation.setStore(props.store);
    this.backHandler = navigation.backAction;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  render() {
    const { store, persistor } = this.props;

    return (
      <Provider store={store}>
        <PersistGate loading={<Loading keepVisible />} persistor={persistor}>
          {this.props.children}
        </PersistGate>
      </Provider>
    );
  }
}

export default Root;
