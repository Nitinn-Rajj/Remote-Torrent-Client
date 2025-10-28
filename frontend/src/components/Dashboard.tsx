import { useEffect } from 'react';
import { fetchTorrents } from '../store/slices/torrentsSlice';
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

  // Ensure torrents is always an array
  const torrentArray = Array.isArray(torrents) ? torrents : [];
  const activeTorrents = torrentArray.filter(t => t.status === 'downloading');
  const completedTorrents = torrentArray.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <AddTorrentButton />
      </div>

      {loading && torrentArray.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Total Torrents</p>
              <p className="text-2xl font-bold text-gray-900">{torrentArray.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Active Downloads</p>
              <p className="text-2xl font-bold text-primary-600">{activeTorrents.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTorrents.length}</p>
            </div>
          </div>

          {/* Active Torrents */}
          {activeTorrents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Downloads</h2>
              <TorrentList torrents={activeTorrents} />
            </div>
          )}

          {/* Completed Torrents */}
          {completedTorrents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed</h2>
              <TorrentList torrents={completedTorrents} />
            </div>
          )}

          {torrentArray.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No torrents yet</p>
              <AddTorrentButton />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
