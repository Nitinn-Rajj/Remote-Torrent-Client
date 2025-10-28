import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Config } from '../../types';

interface ConfigSliceState {
  data: Config;
  loading: boolean;
  error: string | null;
}

export const fetchConfig = createAsyncThunk<Config>(
  'config/fetchConfig',
  async () => {
    const response = await api.get<Config>('/api/config');
    return response.data;
  }
);

export const updateConfig = createAsyncThunk<Config, Partial<Config>>(
  'config/updateConfig',
  async (config: Partial<Config>) => {
    const response = await api.put<Config>('/api/config', config);
    return response.data;
  }
);

const initialState: ConfigSliceState = {
  data: {
    downloadDirectory: '',
    incomingPort: 50007,
    enableUpload: true,
    enableSeeding: true,
    maxConcurrentTorrents: 5,
  },
  loading: false,
  error: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch config';
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default configSlice.reducer;
