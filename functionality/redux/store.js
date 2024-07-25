import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from './userSlice'
import selectionReducer from './selectionSlice'

const persistConfig = {
  key: "root",
  storage: AsyncStorage
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