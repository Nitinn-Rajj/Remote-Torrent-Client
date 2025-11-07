import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Notification } from '../../types';

const initialState: UIState = {
  currentView: 'dashboard', // dashboard, files, settings
  sidebarOpen: true,
  addTorrentModalOpen: false,
  torrentDetailsModalOpen: false,
  deleteTorrentModalOpen: false,
  selectedTorrentHash: null,
  deleteTorrentHash: null,
  connectionStatus: 'connected', // connected, disconnected, connecting
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<UIState['currentView']>) => {
      state.currentView = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openAddTorrentModal: (state) => {
      state.addTorrentModalOpen = true;
    },
    closeAddTorrentModal: (state) => {
      state.addTorrentModalOpen = false;
    },
    openTorrentDetailsModal: (state, action: PayloadAction<string>) => {
      state.torrentDetailsModalOpen = true;
      state.selectedTorrentHash = action.payload;
    },
    closeTorrentDetailsModal: (state) => {
      state.torrentDetailsModalOpen = false;
      state.selectedTorrentHash = null;
    },
    openDeleteTorrentModal: (state, action: PayloadAction<string>) => {
      state.deleteTorrentModalOpen = true;
      state.deleteTorrentHash = action.payload;
    },
    closeDeleteTorrentModal: (state) => {
      state.deleteTorrentModalOpen = false;
      state.deleteTorrentHash = null;
    },
    setConnectionStatus: (state, action: PayloadAction<UIState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      state.notifications.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
  },
});

export const {
  setCurrentView,
  toggleSidebar,
  openAddTorrentModal,
  closeAddTorrentModal,
  openTorrentDetailsModal,
  closeTorrentDetailsModal,
  openDeleteTorrentModal,
  closeDeleteTorrentModal,
  setConnectionStatus,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
