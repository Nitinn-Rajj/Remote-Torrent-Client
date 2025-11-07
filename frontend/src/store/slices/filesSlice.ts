import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilesState, FileNode } from '../../types';

const initialState: FilesState = {
  tree: null,
  loading: false,
  error: null,
  currentPath: '',
  selectedFile: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFilesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilesTree: (state, action: PayloadAction<FileNode | null>) => {
      state.tree = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFilesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<string | null>) => {
      state.selectedFile = action.payload;
    },
    clearFilesError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setFilesLoading,
  setFilesTree,
  setFilesError,
  setCurrentPath,
  setSelectedFile,
  clearFilesError,
} = filesSlice.actions;

export default filesSlice.reducer;
