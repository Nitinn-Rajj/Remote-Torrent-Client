import { configureStore } from '@reduxjs/toolkit';
import torrentsReducer from './slices/torrentsSlice';
import configReducer from './slices/configSlice';
import filesReducer from './slices/filesSlice';
import uiReducer from './slices/uiSlice';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    torrents: torrentsReducer,
    config: configReducer,
    files: filesReducer,
    ui: uiReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };

export default store;
