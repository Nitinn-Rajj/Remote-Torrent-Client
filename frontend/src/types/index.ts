// Torrent types
export interface TorrentFile {
  path: string;
  size: number;
  downloaded: number;
}

export interface Torrent {
  id: string;
  name: string;
  magnetURI?: string;
  infoHash: string;
  status: 'downloading' | 'completed' | 'paused' | 'error' | 'seeding';
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  downloaded: number;
  uploaded: number;
  size: number;
  peers: number;
  ratio: number;
  eta: number;
  files: TorrentFile[];
  error?: string;
}

// Config types
export interface Config {
  downloadDirectory: string;
  incomingPort: number;
  enableUpload: boolean;
  enableSeeding: boolean;
  maxConcurrentTorrents: number;
  maxDownloadSpeed?: number;
  maxUploadSpeed?: number;
  seedRatioLimit?: number;
  enableDHT?: boolean;
  enablePEX?: boolean;
}

// UI State types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

export interface UIState {
  currentView: 'dashboard' | 'files' | 'settings';
  sidebarOpen: boolean;
  addTorrentModalOpen: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  notifications: Notification[];
}

// Redux State types
export interface TorrentsState {
  items: Torrent[];
  loading: boolean;
  error: string | null;
}

export interface ConfigState {
  data: Config;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  torrents: TorrentsState;
  config: ConfigState;
  ui: UIState;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TorrentsResponse {
  torrents: Torrent[];
}

export interface ConfigResponse {
  config: Config;
}

export interface AddTorrentRequest {
  magnetURI: string;
}

export interface UpdateConfigRequest extends Partial<Config> {}

// Component Props types
export interface TorrentListProps {
  torrents: Torrent[];
}

export interface AddTorrentModalProps {
  isOpen: boolean;
  onClose: () => void;
}
