import React from 'react';
import { deleteTorrent, startTorrent, stopTorrent, fetchTorrents } from '../store/slices/torrentsSlice';
import { useAppDispatch } from '../hooks/redux';
import { TorrentListProps } from '../types';

const TorrentList: React.FC<TorrentListProps> = ({ torrents, onViewFiles }) => {
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
    dispatch(startTorrent(infoHash)).then(() => {
      // Refresh torrent list after starting
      dispatch(fetchTorrents());
    });
  };

  const handleStop = (infoHash: string) => {
    dispatch(stopTorrent(infoHash)).then(() => {
      // Refresh torrent list after stopping
      dispatch(fetchTorrents());
    });
  };

  const handleViewFiles = (infoHash: string) => {
    if (onViewFiles) {
      onViewFiles(infoHash);
    }
  };

  return (
    <div className="space-y-4">
      {torrents.map((torrent) => {
        const status = torrent.Started ? 'downloading' : 'paused';
        const progress = torrent.Percent || 0;
        const downloaded = torrent.Downloaded || 0;
        const size = torrent.Size || 0;
        const downloadSpeed = torrent.DownloadRate || 0;
        const peers = torrent.Peers || 0;

        return (
        <div
          key={torrent.InfoHash}
          className="relative overflow-hidden rounded-[1.6rem] border border-[#dcd3c2]/70 bg-[linear-gradient(135deg,_rgba(251,247,240,0.96)_0%,_rgba(236,227,213,0.9)_100%)] p-5 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.84),10px_14px_26px_rgba(69,56,42,0.12)] outline outline-1 outline-[#f8f3e7]/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_16px_30px_rgba(69,56,42,0.16)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_11px] opacity-22" />
          <div className="relative flex flex-wrap items-center gap-4 pb-4">
            <h3 className="flex-1 truncate text-lg font-semibold tracking-tight text-[#343429]">{torrent.Name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleViewFiles(torrent.InfoHash)}
                disabled={!torrent.Loaded}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(85,117,69,0.22)] transition-all duration-300 ${
                  torrent.Loaded
                    ? 'border-[#c8b89a]/70 bg-[linear-gradient(135deg,_rgba(245,235,218,0.95)_0%,_rgba(230,215,195,0.9)_100%)] text-[#5a4a3a] hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(90,74,58,0.24)]'
                    : 'cursor-not-allowed border-[#dcd3c2]/50 bg-[linear-gradient(135deg,_rgba(236,227,213,0.7)_0%,_rgba(226,217,203,0.65)_100%)] text-[#9a8a7a] opacity-50'
                }`}
              >
                Files
              </button>
              {status === 'downloading' ? (
                <button
                  onClick={() => handleStop(torrent.InfoHash)}
                  className="rounded-full border border-[#e0ce9a]/70 bg-[linear-gradient(135deg,_rgba(253,244,213,0.9)_0%,_rgba(242,222,170,0.85)_100%)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#6a5328] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(139,104,53,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(139,104,53,0.24)]"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => handleStart(torrent.InfoHash)}
                  className="rounded-full border border-[#b1c7aa]/70 bg-[linear-gradient(135deg,_rgba(234,244,226,0.95)_0%,_rgba(206,229,200,0.9)_100%)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#3e5235] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(85,117,69,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(85,117,69,0.24)]"
                >
                  Start
                </button>
              )}
              <button
                onClick={() => handleDelete(torrent.InfoHash)}
                className="rounded-full border border-[#e1b9b3]/70 bg-[linear-gradient(135deg,_rgba(250,227,225,0.92)_0%,_rgba(235,200,198,0.88)_100%)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#6c3a39] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(139,68,66,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(139,68,66,0.24)]"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#727764]">
              <span>{Math.round(progress)}%</span>
              <span>
                {formatBytes(downloaded)} / {formatBytes(size)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-[#d8d0bf]/70 bg-[#f1eadb]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#94b692] via-[#78a07a] to-[#4f7761] shadow-[0_0_12px_rgba(120,160,122,0.4)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-between gap-4 text-xs font-mono uppercase tracking-[0.3em] text-[#6b6f5d]">
            <div className="flex flex-wrap gap-4">
              <span>↓ {formatSpeed(downloadSpeed)}</span>
              <span>Peers {peers}</span>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default TorrentList;
