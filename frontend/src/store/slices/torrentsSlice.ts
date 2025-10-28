import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Torrent, TorrentsState } from '../../types';

// Async thunks
export const fetchTorrents = createAsyncThunk<Torrent[]>(
  'torrents/fetchTorrents',
  async () => {
    try {
      const response = await api.get<Torrent[]>('/api/torrents');
      
      // Ensure we always return an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object' && 'torrents' in response.data) {
        // Handle if API returns { torrents: [...] }
        return (response.data as any).torrents || [];
      }
      return [];
    } catch (error) {
      // Silently return empty array when backend is not available
      return [];
    }
  }
);

export const addTorrent = createAsyncThunk<Torrent, string>(
  'torrents/addTorrent',
  async (magnetLink: string) => {
    const response = await api.post<Torrent>('/api/torrent', { magnet: magnetLink });
    return response.data;
  }
);

export const deleteTorrent = createAsyncThunk<string, string>(
  'torrents/deleteTorrent',
  async (infoHash: string) => {
    await api.delete(`/api/torrent/${infoHash}`);
    return infoHash;
  }
);

export const startTorrent = createAsyncThunk<string, string>(
  'torrents/startTorrent',
  async (infoHash: string) => {
    await api.post(`/api/torrent/${infoHash}/start`);
    return infoHash;
  }
);

export const stopTorrent = createAsyncThunk<string, string>(
  'torrents/stopTorrent',
  async (infoHash: string) => {
    await api.post(`/api/torrent/${infoHash}/stop`);
    return infoHash;
  }
);

const initialState: TorrentsState = {
  items: [],
  loading: false,
  error: null,
};

const torrentsSlice = createSlice({
  name: 'torrents',
  initialState,
  reducers: {
    updateTorrentProgress: (state, action: PayloadAction<Partial<Torrent> & { infoHash: string }>) => {
      const torrent = state.items.find(t => t.infoHash === action.payload.infoHash);
      if (torrent) {
        Object.assign(torrent, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch torrents
      .addCase(fetchTorrents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTorrents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTorrents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch torrents';
      })
      // Add torrent
      .addCase(addTorrent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Delete torrent
      .addCase(deleteTorrent.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.infoHash !== action.payload);
      });
  },
});

export const { updateTorrentProgress } = torrentsSlice.actions;
export default torrentsSlice.reducer;
