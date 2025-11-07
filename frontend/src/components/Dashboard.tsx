import { useEffect } from 'react';
import { fetchTorrents, fetchTorrentFiles } from '../store/slices/torrentsSlice';
import { openTorrentDetailsModal } from '../store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import TorrentList from './TorrentList';
import AddTorrentButton from './AddTorrentButton';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { items: torrents, loading } = useAppSelector((state) => state.torrents);

  useEffect(() => {
    dispatch(fetchTorrents());
    const interval = setInterval(() => {
      dispatch(fetchTorrents());
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleViewFiles = (infoHash: string) => {
    dispatch(fetchTorrentFiles(infoHash));
    dispatch(openTorrentDetailsModal(infoHash));
  };

  // Ensure torrents is always an array
  const torrentArray = Array.isArray(torrents) ? torrents : [];
  // Backend uses Started and Percent fields
  // Active: Started and not complete, OR paused (not started) and not complete
  const activeTorrents = torrentArray.filter(t => t.Percent < 100);
  const completedTorrents = torrentArray.filter(t => t.Percent >= 100);
  
  // Calculate total download rate
  const totalDownloadRate = torrentArray.reduce((sum, t) => sum + (t.DownloadRate || 0), 0);
  
  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return Math.round(bytesPerSecond / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-[#979b86]">Mission Control</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#2e3226]">Dashboard</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#676a5a]">
            Monitor torrents at a glance and manage downloads without leaving this screen.
          </p>
        </div>
        <AddTorrentButton />
      </div>

      {loading && torrentArray.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-[1.5rem] border border-[#e0d5c4]/80 bg-[radial-gradient(circle_at_top,_rgba(250,247,240,0.92)_0%,_rgba(237,229,215,0.88)_100%)] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),10px_14px_26px_rgba(74,62,47,0.12)] outline outline-1 outline-[#f7f1e5]/70">
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-[#b1c6a9]/50 border-t-[#6e8c6f]" aria-label="Loading" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative overflow-hidden rounded-[1.55rem] border border-[#dcd4c1]/70 bg-[linear-gradient(135deg,_rgba(251,246,238,0.96)_0%,_rgba(236,227,213,0.92)_100%)] p-4 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.86),6px_10px_18px_rgba(68,56,42,0.1)] outline outline-1 outline-[#f8f3e8]/70">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_10px] opacity-22" />
              <p className="relative text-[0.7rem] uppercase tracking-[0.5em] text-[#9a9e8b]">Total</p>
              <p className="relative mt-2 font-mono text-3xl font-semibold text-[#2f3125]">
                {torrentArray.length}
              </p>
              <p className="relative mt-1.5 text-[0.7rem] text-[#7a7e69]">Tracked torrents</p>
            </div>

            <div className="relative overflow-hidden rounded-[1.55rem] border border-[#cfdcc2]/70 bg-[linear-gradient(135deg,_rgba(241,248,235,0.95)_0%,_rgba(221,235,212,0.9)_100%)] p-4 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.86),6px_10px_18px_rgba(68,56,42,0.1)] outline outline-1 outline-[#f0f7ea]/70">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_10px] opacity-22" />
              <p className="relative text-[0.7rem] uppercase tracking-[0.5em] text-[#8d9c81]">Active</p>
              <p className="relative mt-2 font-mono text-3xl font-semibold text-[#2f3125]">
                {activeTorrents.length}
              </p>
              <p className="relative mt-1.5 text-[0.7rem] text-[#6a7560]">Downloads in flight</p>
            </div>

            <div className="relative overflow-hidden rounded-[1.55rem] border border-[#d5e5ce]/70 bg-[linear-gradient(135deg,_rgba(229,244,224,0.93)_0%,_rgba(210,229,209,0.86)_100%)] p-4 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.86),6px_10px_18px_rgba(68,56,42,0.1)] outline outline-1 outline-[#eef6ea]/70">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_10px] opacity-22" />
              <p className="relative text-[0.7rem] uppercase tracking-[0.5em] text-[#839476]">Complete</p>
              <p className="relative mt-2 font-mono text-3xl font-semibold text-[#2f3125]">
                {completedTorrents.length}
              </p>
              <p className="relative mt-1.5 text-[0.7rem] text-[#63735e]">Files ready to seed</p>
            </div>
            
            <div className="relative overflow-hidden rounded-[1.55rem] border border-[#c8dbe0]/70 bg-[linear-gradient(135deg,_rgba(235,245,248,0.95)_0%,_rgba(218,233,238,0.9)_100%)] p-4 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.86),6px_10px_18px_rgba(68,56,42,0.1)] outline outline-1 outline-[#e8f4f7]/70">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_10px] opacity-22" />
              <p className="relative text-[0.7rem] uppercase tracking-[0.5em] text-[#7b8e93]">Download</p>
              <p className="relative mt-2 font-mono text-2xl font-semibold text-[#2f3125]">
                {formatSpeed(totalDownloadRate)}
              </p>
              <p className="relative mt-1.5 text-[0.7rem] text-[#5a6d72]">Current speed</p>
            </div>
          </div>

          {/* Active Torrents */}
          {activeTorrents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-[#313427]">Active Downloads</h2>
                <span className="rounded-full border border-[#cdd6c1]/60 bg-[#eef4e5]/70 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-[#7d836f] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.75)] outline outline-1 outline-[#f3f7f0]/60">
                  Live Feed
                </span>
              </div>
              <TorrentList torrents={activeTorrents} onViewFiles={handleViewFiles} />
            </div>
          )}

          {/* Completed Torrents */}
          {completedTorrents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-[#313427]">Completed</h2>
                <span className="rounded-full border border-[#dcd7c6]/60 bg-[#f6f2e8]/70 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-[#8c8f7c] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.75)] outline outline-1 outline-[#faf6ee]/60">
                  Archive
                </span>
              </div>
              <TorrentList torrents={completedTorrents} onViewFiles={handleViewFiles} />
            </div>
          )}

          {torrentArray.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5 rounded-[1.8rem] border border-[#ded3c2]/70 bg-[radial-gradient(circle_at_top,_rgba(252,248,242,0.94)_0%,_rgba(236,228,216,0.9)_100%)] py-12 text-center shadow-[inset_2px_2px_5px_rgba(255,255,255,0.84),12px_16px_30px_rgba(68,56,42,0.1)] outline outline-1 outline-[#f8f2e8]/70">
              <div className="rounded-full border border-[#d9d0bf]/80 bg-[#f5efe3] px-4 py-2 text-xs uppercase tracking-[0.5em] text-[#8e927e]">
                Idle Line
              </div>
              <p className="text-lg font-medium text-[#3a3d2f]">No torrents yet</p>
              <p className="max-w-sm text-sm text-[#777c68]">
                Queue transmissions from magnet links or torrent files to see live analytics flicker to life.
              </p>
              <AddTorrentButton />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
