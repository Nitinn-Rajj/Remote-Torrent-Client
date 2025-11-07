import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFilesTree, setSelectedFile, setCurrentPath } from '../store/slices/filesSlice';
import { fileAPI } from '../services/api';
import { FileNode } from '../types';

const FileExplorer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tree, selectedFile, currentPath } = useAppSelector((state) => state.files);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch files on mount and periodically
  useEffect(() => {
    const fetchFiles = async () => {
      const files = await fileAPI.getFiles();
      dispatch(setFilesTree(files));
    };

    fetchFiles();
    const interval = setInterval(fetchFiles, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (path: string, isDir: boolean) => {
    if (isDir) {
      toggleFolder(path);
      dispatch(setCurrentPath(path));
    } else {
      dispatch(setSelectedFile(path));
      if (fileAPI.isStreamable(path)) {
        setPlayingFile(path);
      }
    }
  };

  const handleDownload = (path: string) => {
    window.open(fileAPI.downloadFile(path), '_blank');
  };

  const handleDelete = async (path: string) => {
    if (confirm(`Are you sure you want to delete "${path}"?`)) {
      const success = await fileAPI.deleteFile(path);
      if (success) {
        // Refresh the file tree
        const files = await fileAPI.getFiles();
        dispatch(setFilesTree(files));
        if (selectedFile === path) {
          dispatch(setSelectedFile(null));
        }
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFileIcon = (name: string, isDir: boolean): string => {
    if (isDir) return '📁';
    
    const ext = name.toLowerCase().substring(name.lastIndexOf('.'));
    const iconMap: { [key: string]: string } = {
      '.mp4': '🎬', '.mkv': '🎬', '.avi': '🎬', '.mov': '🎬', '.webm': '🎬',
      '.mp3': '🎵', '.wav': '🎵', '.ogg': '🎵', '.m4a': '🎵', '.flac': '🎵',
      '.jpg': '🖼️', '.jpeg': '🖼️', '.png': '🖼️', '.gif': '🖼️', '.webp': '🖼️',
      '.pdf': '📄', '.doc': '📄', '.docx': '📄', '.txt': '📄',
      '.zip': '📦', '.rar': '📦', '.7z': '📦', '.tar': '📦', '.gz': '📦',
    };
    return iconMap[ext] || '📄';
  };

  const renderFileTree = (node: FileNode | null, parentPath: string = '', level: number = 0): React.ReactNode => {
    if (!node) return null;

    const currentNodePath = parentPath ? `${parentPath}/${node.Name}` : node.Name;
    const isDir = node.Children && node.Children.length > 0;
    const isExpanded = expandedFolders.has(currentNodePath);
    const isSelected = selectedFile === currentNodePath;

    // Skip the root "downloads" node and render its children directly
    if (level === 0 && parentPath === '' && node.Name === 'downloads') {
      return node.Children?.map((child) => renderFileTree(child, '', 1));
    }

    return (
      <div key={currentNodePath} className="select-none">
        <div
          className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
            isSelected
              ? 'border-[#95b59c]/60 bg-[#e8efe1] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8)]'
              : 'border-transparent hover:border-[#d4ccb7]/50 hover:bg-[#f6f1e7]'
          }`}
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          <button
            onClick={() => handleFileClick(currentNodePath, !!isDir)}
            className="flex flex-1 items-center gap-3 text-left"
          >
            {isDir && (
              <span className="text-sm text-[#8c8e79]">
                {isExpanded ? '▼' : '▶'}
              </span>
            )}
            <span className="text-2xl">{getFileIcon(node.Name, !!isDir)}</span>
            <div className="flex-1">
              <p className="font-medium text-[#2f3227]">{node.Name}</p>
              <p className="text-xs text-[#8c8e79]">
                {formatFileSize(node.Size)}
                {node.Modified && ` • ${formatDate(node.Modified)}`}
              </p>
            </div>
          </button>
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => handleDownload(currentNodePath)}
              className="rounded-lg border border-[#d4ccb7]/60 bg-[#f6f1e7] px-3 py-1.5 text-sm text-[#5d6252] transition-all hover:border-[#95b59c]/60 hover:bg-[#e8efe1]"
              title="Download"
            >
              ⬇
            </button>
            {!isDir && fileAPI.isImage(node.Name) && (
              <button
                onClick={() => setPreviewImage(currentNodePath)}
                className="rounded-lg border border-[#d4ccb7]/60 bg-[#f6f1e7] px-3 py-1.5 text-sm text-[#5d6252] transition-all hover:border-[#95b59c]/60 hover:bg-[#e8efe1]"
                title="Preview"
              >
                🖼
              </button>
            )}
            {!isDir && fileAPI.isStreamable(node.Name) && (
              <button
                onClick={() => setPlayingFile(currentNodePath)}
                className="rounded-lg border border-[#d4ccb7]/60 bg-[#f6f1e7] px-3 py-1.5 text-sm text-[#5d6252] transition-all hover:border-[#95b59c]/60 hover:bg-[#e8efe1]"
                title="Play"
              >
                ▶
              </button>
            )}
            {!isDir && !fileAPI.isStreamable(node.Name) && !fileAPI.isImage(node.Name) && (
              <button
                onClick={() => alert('This file type may not be playable in-browser. Use Download to get the file.')}
                className="rounded-lg border border-[#f0e6d6]/60 bg-[#fff6ee] px-3 py-1.5 text-sm text-[#7a6f5a] transition-all hover:border-[#e6dcc6]/60 hover:bg-[#fff1dd]"
                title="Not streamable"
              >
                ⚠
              </button>
            )}
            <button
              onClick={() => handleDelete(currentNodePath)}
              className="rounded-lg border border-[#ffc7c7]/60 bg-[#ffe8e8] px-3 py-1.5 text-sm text-[#b85656] transition-all hover:border-[#ff9a9a]/60 hover:bg-[#ffd4d4]"
              title="Delete"
            >
              🗑
            </button>
          </div>
        </div>

        {isDir && isExpanded && node.Children && (
          <div className="mt-1">
            {node.Children.map((child) => renderFileTree(child, currentNodePath, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const hasFiles = tree && ((tree.Children && tree.Children.length > 0) || tree.Name);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-[#969a87]">Archive</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#2f3227]">File Library</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6a6e5c]">
            Browse, stream, and manage your downloaded files.
          </p>
        </div>
        {hasFiles && (
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                viewMode === 'list'
                  ? 'border-[#95b59c]/60 bg-[#e8efe1] text-[#2f3227]'
                  : 'border-[#d4ccb7]/60 bg-[#f6f1e7] text-[#5d6252] hover:border-[#95b59c]/40'
              }`}
            >
              ≡ List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                viewMode === 'grid'
                  ? 'border-[#95b59c]/60 bg-[#e8efe1] text-[#2f3227]'
                  : 'border-[#d4ccb7]/60 bg-[#f6f1e7] text-[#5d6252] hover:border-[#95b59c]/40'
              }`}
            >
              ⊞ Grid
            </button>
          </div>
        )}
      </div>

      {previewImage && (
        <div className="relative overflow-hidden rounded-[2rem] border border-[#ded4c3]/70 bg-[#111] p-4 shadow-[12px_18px_30px_rgba(70,58,44,0.12)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-white">Preview: {previewImage.split('/').pop()}</p>
            <button
              onClick={() => setPreviewImage(null)}
              className="rounded-lg bg-[#ff5555] px-3 py-1 text-sm text-white transition-all hover:bg-[#ff3333]"
            >
              Close ✕
            </button>
          </div>
          <img src={fileAPI.getStreamURL(previewImage)} alt="preview" className="w-full rounded-lg object-contain" style={{ maxHeight: '70vh' }} />
        </div>
      )}

      {playingFile && (
        <div className="relative overflow-hidden rounded-[2rem] border border-[#ded4c3]/70 bg-[#1a1a1a] p-4 shadow-[12px_18px_30px_rgba(70,58,44,0.12)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-white">Now Playing: {playingFile.split('/').pop()}</p>
            <button
              onClick={() => setPlayingFile(null)}
              className="rounded-lg bg-[#ff5555] px-3 py-1 text-sm text-white transition-all hover:bg-[#ff3333]"
            >
              Close ✕
            </button>
          </div>
          <video
            ref={videoRef}
            src={fileAPI.getStreamURL(playingFile)}
            controls
            autoPlay
            className="w-full rounded-lg"
            style={{ maxHeight: '70vh' }}
          >
            Your browser does not support video playback.
          </video>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[2rem] border border-[#ded4c3]/70 bg-[radial-gradient(circle_at_top,_rgba(251,247,240,0.95)_0%,_rgba(235,226,212,0.9)_100%)] p-6 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.84),12px_18px_30px_rgba(70,58,44,0.12)] outline outline-1 outline-[#f7f1e6]/70">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_12px] opacity-30" />
        
        <div className="relative z-10">
          {!hasFiles ? (
            <div className="space-y-4 py-12 text-center text-[#6d7160]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[#d3cab8]/70 bg-[#f1ebe0] text-3xl">
                📁
              </div>
              <p className="text-lg font-medium text-[#35382c]">No files yet</p>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-[#7b7f6c]">
                Download some torrents to see them appear here. You'll be able to browse, stream videos, and manage your files.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {renderFileTree(tree)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;

