import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import store, {persistor} from 'recipe-book/redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


import appSetup from './setup/app_setup.js'

function App(): React.JSX.Element {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          {appSetup()}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
