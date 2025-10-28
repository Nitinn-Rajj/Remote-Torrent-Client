import React from 'react';
import { deleteTorrent, startTorrent, stopTorrent } from '../store/slices/torrentsSlice';
import { useAppDispatch } from '../hooks/redux';
import { TorrentListProps } from '../types';

const TorrentList: React.FC<TorrentListProps> = ({ torrents }) => {
  const dispatch = useAppDispatch();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    return formatBytes(bytesPerSecond) + '/s';
  };

  const handleDelete = (infoHash: string) => {
    if (confirm('Are you sure you want to delete this torrent?')) {
      dispatch(deleteTorrent(infoHash));
    }
  };

  const handleStart = (infoHash: string) => {
    dispatch(startTorrent(infoHash));
  };

  const handleStop = (infoHash: string) => {
    dispatch(stopTorrent(infoHash));
  };

  return (
    <div className="space-y-3">
      {torrents.map((torrent) => (
        <div key={torrent.infoHash} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate flex-1">{torrent.name}</h3>
            <div className="flex space-x-2 ml-4">
              {torrent.status === 'downloading' ? (
                <button
                  onClick={() => handleStop(torrent.infoHash)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => handleStart(torrent.infoHash)}
                  className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                >
                  Start
                </button>
              )}
              <button
                onClick={() => handleDelete(torrent.infoHash)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{Math.round(torrent.progress || 0)}%</span>
              <span>{formatBytes(torrent.downloaded || 0)} / {formatBytes(torrent.size || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${torrent.progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex space-x-4">
              <span>↓ {formatSpeed(torrent.downloadSpeed || 0)}</span>
              <span>↑ {formatSpeed(torrent.uploadSpeed || 0)}</span>
              <span>Peers: {torrent.peers || 0}</span>
            </div>
            {torrent.eta && torrent.eta > 0 && (
              <span>ETA: {Math.floor(torrent.eta / 60)}m</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TorrentList;
