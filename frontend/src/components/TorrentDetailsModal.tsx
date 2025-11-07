import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { fetchTorrentFiles, updateFileSelection } from '../store/slices/torrentsSlice';
import { TorrentDetailsModalProps, TorrentFile } from '../types';

const TorrentDetailsModal: React.FC<TorrentDetailsModalProps> = ({ isOpen, torrent, onClose }) => {
  const dispatch = useAppDispatch();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize selected files when torrent changes
  useEffect(() => {
    if (torrent?.Files) {
      const initialSelected = new Set(
        torrent.Files.filter(f => f.Priority).map(f => f.Path)
      );
      setSelectedFiles(initialSelected);
      setHasChanges(false);
    }
  }, [torrent]);

  if (!isOpen || !torrent) return null;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileToggle = (filePath: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filePath)) {
        newSet.delete(filePath);
      } else {
        newSet.add(filePath);
      }
      setHasChanges(true);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allFiles = new Set(torrent.Files.map(f => f.Path));
    setSelectedFiles(allFiles);
    setHasChanges(true);
  };

  const handleDeselectAll = () => {
    setSelectedFiles(new Set());
    setHasChanges(true);
  };

  const handleApply = async () => {
    if (!torrent || !hasChanges) return;

    // Determine which files changed
    const filesToStart: string[] = [];
    const filesToStop: string[] = [];

    torrent.Files.forEach(file => {
      const wasSelected = file.Priority;
      const isSelected = selectedFiles.has(file.Path);

      if (!wasSelected && isSelected) {
        filesToStart.push(file.Path);
      } else if (wasSelected && !isSelected) {
        filesToStop.push(file.Path);
      }
    });

    // Send update requests
    try {
      if (filesToStart.length > 0) {
        await dispatch(updateFileSelection({
          infoHash: torrent.InfoHash,
          request: { filePaths: filesToStart, action: 'start' }
        })).unwrap();
      }
      if (filesToStop.length > 0) {
        await dispatch(updateFileSelection({
          infoHash: torrent.InfoHash,
          request: { filePaths: filesToStop, action: 'stop' }
        })).unwrap();
      }

      // Refresh torrent data
      await dispatch(fetchTorrentFiles(torrent.InfoHash));
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update file selection:', error);
    }
  };

  const selectedCount = selectedFiles.size;
  const totalCount = torrent.Files.length;
  const selectedSize = torrent.Files
    .filter(f => selectedFiles.has(f.Path))
    .reduce((sum, f) => sum + f.Size, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#dcd3c2]/70 bg-[linear-gradient(135deg,_rgba(251,247,240,0.98)_0%,_rgba(236,227,213,0.95)_100%)] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.84),12px_18px_38px_rgba(69,56,42,0.18)]">
        {/* Header */}
        <div className="border-b border-[#dcd3c2]/50 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8)_0%,_rgba(246,240,230,0.6)_100%)] p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-[#343429]">{torrent.Name}</h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#5a5a4a]">
                <span>Total: {formatBytes(torrent.Size)}</span>
                <span>•</span>
                <span>Selected: {selectedCount}/{totalCount} files ({formatBytes(selectedSize)})</span>
                <span>•</span>
                <span>Progress: {torrent.Percent.toFixed(1)}%</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[#6a5a4a] transition-colors hover:bg-[#e8dcc8]"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSelectAll}
              className="rounded-full border border-[#b1c7aa]/70 bg-[linear-gradient(135deg,_rgba(234,244,226,0.95)_0%,_rgba(206,229,200,0.9)_100%)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#3e5235] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(85,117,69,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(85,117,69,0.24)]"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="rounded-full border border-[#e0ce9a]/70 bg-[linear-gradient(135deg,_rgba(253,244,213,0.9)_0%,_rgba(242,222,170,0.85)_100%)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#6a5328] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(139,104,53,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(139,104,53,0.24)]"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-2">
            {torrent.Files.map((file: TorrentFile) => {
              const isSelected = selectedFiles.has(file.Path);
              return (
                <div
                  key={file.Path}
                  className="flex items-center gap-4 rounded-[1.2rem] border border-[#e8dcc8]/60 bg-[linear-gradient(135deg,_rgba(255,252,245,0.95)_0%,_rgba(246,240,230,0.9)_100%)] p-4 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),3px_5px_12px_rgba(69,56,42,0.08)] transition-all duration-200 hover:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.9),5px_8px_16px_rgba(69,56,42,0.12)]"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleFileToggle(file.Path)}
                    className="h-5 w-5 cursor-pointer rounded border-2 border-[#b8a890] text-[#6a8d5e] focus:ring-2 focus:ring-[#b1c7aa] focus:ring-offset-2"
                  />

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-[#343429]">{file.Path.split('/').pop()}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[#6a5a4a]">
                      <span>{formatBytes(file.Size)}</span>
                      <span>•</span>
                      <span>{file.Percent.toFixed(1)}% complete</span>
                      <span>•</span>
                      <span className="truncate text-[#8a7a6a]">{file.Path}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-32">
                    <div className="h-2 overflow-hidden rounded-full bg-[#e8dcc8]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#a8c9a0] to-[#6a8d5e] transition-all duration-300"
                        style={{ width: `${file.Percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#dcd3c2]/50 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.8)_0%,_rgba(246,240,230,0.6)_100%)] p-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-full border border-[#dcd3c2]/70 bg-[linear-gradient(135deg,_rgba(251,247,240,0.95)_0%,_rgba(236,227,213,0.9)_100%)] px-6 py-2 font-semibold text-[#6a5a4a] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(139,104,53,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(139,104,53,0.2)]"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              disabled={!hasChanges}
              className={`rounded-full border px-6 py-2 font-semibold shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(85,117,69,0.22)] transition-all duration-300 ${
                hasChanges
                  ? 'border-[#b1c7aa]/70 bg-[linear-gradient(135deg,_rgba(200,224,192,0.95)_0%,_rgba(175,208,165,0.9)_100%)] text-[#3e5235] hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(85,117,69,0.3)]'
                  : 'cursor-not-allowed border-[#dcd3c2]/50 bg-[linear-gradient(135deg,_rgba(236,227,213,0.7)_0%,_rgba(226,217,203,0.65)_100%)] text-[#9a8a7a] opacity-50'
              }`}
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorrentDetailsModal;
