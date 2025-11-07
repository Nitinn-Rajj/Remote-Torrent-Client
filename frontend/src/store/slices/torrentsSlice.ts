import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { torrentService } from '../../services/torrentService';
import { Torrent, TorrentsState, UpdateFileSelectionRequest } from '../../types';

// Async thunks
export const fetchTorrents = createAsyncThunk<Torrent[]>(
  'torrents/fetchTorrents',
  async () => {
    try {
      return await torrentService.getTorrents();
    } catch (error) {
      // Silently return empty array when backend is not available
      return [];
    }
  }
);

export const addTorrent = createAsyncThunk<void, string>(
  'torrents/addTorrent',
  async (magnetLink: string) => {
    await torrentService.addTorrent(magnetLink);
  }
);

export const deleteTorrent = createAsyncThunk<string, string>(
  'torrents/deleteTorrent',
  async (infoHash: string) => {
    await torrentService.deleteTorrent(infoHash);
    return infoHash;
  }
);

export const startTorrent = createAsyncThunk<string, string>(
  'torrents/startTorrent',
  async (infoHash: string) => {
    await torrentService.startTorrent(infoHash);
    return infoHash;
  }
);

export const stopTorrent = createAsyncThunk<string, string>(
  'torrents/stopTorrent',
  async (infoHash: string) => {
    await torrentService.stopTorrent(infoHash);
    return infoHash;
  }
);

// NEW: Fetch detailed file information for a specific torrent
export const fetchTorrentFiles = createAsyncThunk<Torrent, string>(
  'torrents/fetchTorrentFiles',
  async (infoHash: string) => {
    return await torrentService.getTorrentFiles(infoHash);
  }
);

// NEW: Update file selection
export const updateFileSelection = createAsyncThunk<
  void,
  { infoHash: string; request: UpdateFileSelectionRequest }
>(
  'torrents/updateFileSelection',
  async ({ infoHash, request }) => {
    await torrentService.updateFileSelection(infoHash, request);
  }
);

const initialState: TorrentsState = {
  items: [],
  selectedTorrent: null,
  loading: false,
  error: null,
};

const torrentsSlice = createSlice({
  name: 'torrents',
  initialState,
  reducers: {
    updateTorrentProgress: (state, action: PayloadAction<Partial<Torrent> & { InfoHash: string }>) => {
      const torrent = state.items.find(t => t.InfoHash === action.payload.InfoHash);
      if (torrent) {
        Object.assign(torrent, action.payload);
      }
    },
    clearSelectedTorrent: (state) => {
      state.selectedTorrent = null;
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
      .addCase(addTorrent.fulfilled, () => {
        // Torrent will appear in the list on next fetch
      })
      // Delete torrent
      .addCase(deleteTorrent.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.InfoHash !== action.payload);
        if (state.selectedTorrent?.InfoHash === action.payload) {
          state.selectedTorrent = null;
        }
      })
      // Fetch torrent files
      .addCase(fetchTorrentFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTorrentFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTorrent = action.payload;
        // Also update in items list
        const index = state.items.findIndex(t => t.InfoHash === action.payload.InfoHash);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(fetchTorrentFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch torrent files';
      })
      // Update file selection
      .addCase(updateFileSelection.fulfilled, () => {
        // File selection updated successfully
        // The next fetchTorrentFiles will get the updated state
      });
  },
});

export const { updateTorrentProgress, clearSelectedTorrent } = torrentsSlice.actions;
export default torrentsSlice.reducer;
