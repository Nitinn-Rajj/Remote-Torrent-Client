// Torrent types - matching backend engine/torrent.go
export interface TorrentFile {
  Path: string;
  Size: number;
  Chunks: number;
  Completed: number;
  Started: boolean;
  Percent: number;
}

export interface Torrent {
  InfoHash: string;
  Name: string;
  Loaded: boolean;
  Downloaded: number;
  Size: number;
  Files: TorrentFile[];
  Started: boolean;
  Dropped: boolean;
  Percent: number;
  DownloadRate: number;
  UploadRate: number;
  Peers: number;
}

// Config types - matching backend engine/config.go
export interface Config {
  AutoStart: boolean;
  DisableEncryption: boolean;
  DownloadDirectory: string;
  EnableUpload: boolean;
  EnableSeeding: boolean;
  IncomingPort: number;
}

// File system types - matching backend server/server_files.go
export interface FileNode {
  Name: string;
  Size: number;
  Modified: string;
  Children?: FileNode[];
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

export interface FilesState {
  tree: FileNode | null;
  loading: boolean;
  error: string | null;
  currentPath: string;
  selectedFile: string | null;
}

export interface RootState {
  torrents: TorrentsState;
  config: ConfigState;
  files: FilesState;
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
