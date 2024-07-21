import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

import selectionReducer from './selectionSlice'

const persistConfig = {
  key: "root",
  storage: AsyncStorage
};

const rootReducer = combineReducers({
  selection: selectionReducer,
})

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