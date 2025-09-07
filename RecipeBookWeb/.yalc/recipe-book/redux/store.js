import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from "redux-persist";

import userReducer from './userSlice'
import selectionReducer from './selectionSlice'

let storage;

try {
  if (typeof document !== 'undefined') {
    // Browser
    storage = require('redux-persist/lib/storage').default;
  } else {
    // React Native
    storage = require('@react-native-async-storage/async-storage').default;
  }
} catch (e) {
  // fallback for bundlers if the RN module isn't available
  storage = require('redux-persist/lib/storage').default;
}

const persistConfig = {
  key: 'root',
  storage,
};

const appReducer = combineReducers({
  selection: selectionReducer,
  user: userReducer
})

// use dispatch({type: 'USER_LOGOUT'}) to reset the store
const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    AsyncStorage.removeItem('persist:root')
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer:
    persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store);

export default store