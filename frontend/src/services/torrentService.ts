import api from './api';
import { Torrent, UpdateFileSelectionRequest } from '../types';

export const torrentService = {
  // Get all torrents
  getTorrents: async () => {
    const response = await api.get<Record<string, Torrent> | Torrent[]>('/torrents');
    // Backend returns an object with InfoHash as keys, convert to array
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return Object.values(response.data);
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  // Add a new torrent
  addTorrent: async (magnetLink: string) => {
    const response = await api.post<{ status: string }>('/torrent', { magnet: magnetLink });
    return response.data;
  },

  // Delete a torrent
  deleteTorrent: async (infoHash: string) => {
    const response = await api.delete(`/torrent/${infoHash}`);
    return response.data;
  },

  // Start a torrent
  startTorrent: async (infoHash: string) => {
    const response = await api.post(`/torrent/${infoHash}/start`);
    return response.data;
  },

  // Stop a torrent
  stopTorrent: async (infoHash: string) => {
    const response = await api.post(`/torrent/${infoHash}/stop`);
    return response.data;
  },

  // Get detailed file information for a torrent
  getTorrentFiles: async (infoHash: string): Promise<Torrent> => {
    const response = await api.get<Torrent>(`/torrent/${infoHash}/files`);
    return response.data;
  },

  // Update file selection (which files to download)
  updateFileSelection: async (
    infoHash: string,
    request: UpdateFileSelectionRequest
  ) => {
    const response = await api.post(`/torrent/${infoHash}/files`, request);
    return response.data;
  },
};
