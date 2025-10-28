import { configureStore } from '@reduxjs/toolkit';
import torrentsReducer from './slices/torrentsSlice';
import configReducer from './slices/configSlice';
import uiReducer from './slices/uiSlice';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    torrents: torrentsReducer,
    config: configReducer,
    ui: uiReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };

export default store;
