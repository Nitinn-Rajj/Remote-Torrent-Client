import React from 'react';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { closeTorrentDetailsModal } from './store/slices/uiSlice';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileExplorer from './components/FileExplorer';
import Settings from './components/Settings';
import AddTorrentModal from './components/AddTorrentModal';
import TorrentDetailsModal from './components/TorrentDetailsModal';
import DeleteTorrentModal from './components/DeleteTorrentModal';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((state) => state.ui.currentView);
  const { torrentDetailsModalOpen } = useAppSelector((state) => state.ui);
  const selectedTorrent = useAppSelector((state) => state.torrents.selectedTorrent);

  const handleCloseModal = () => {
    dispatch(closeTorrentDetailsModal());
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'files':
        return <FileExplorer />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
  <div className="relative min-h-screen overflow-hidden bg-[#f6f1e7] font-sans text-[#2f3126]">
      <div className="pointer-events-none absolute inset-0 opacity-80 mix-blend-lighten">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(255,255,255,0.72)_0%,_rgba(255,255,255,0)_60%),radial-gradient(circle_at_88%_6%,_rgba(193,215,188,0.42)_0%,_rgba(193,215,188,0)_65%),radial-gradient(circle_at_30%_94%,_rgba(207,192,171,0.35)_0%,_rgba(207,192,171,0)_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.14)_1px,rgba(255,255,255,0)_1px)] bg-[length:100%_12px] opacity-35 mix-blend-soft-light" />
      </div>

      <Sidebar />

      <main className="relative z-10 flex min-h-screen flex-col lg:ml-[22rem]">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-[#e3dac6]/80 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95)_0%,_rgba(246,240,230,0.9)_60%,_rgba(236,228,215,0.85)_100%)] p-5 shadow-[inset_2px_2px_7px_rgba(255,255,255,0.86),12px_18px_38px_rgba(66,53,40,0.08)] outline outline-1 outline-[#f8f2e6]/60 backdrop-blur-[12px] sm:p-7 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:14px_100%] opacity-25 mix-blend-soft-light" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.6)_0%,_rgba(255,255,255,0)_70%)] opacity-70" />
            <div className="relative z-10">
              {renderView()}
            </div>
          </section>
        </div>
      </main>
      <AddTorrentModal />
      <TorrentDetailsModal
        isOpen={torrentDetailsModalOpen}
        torrent={selectedTorrent}
        onClose={handleCloseModal}
      />
      <DeleteTorrentModal />
    </div>
  );
};

export default App;

