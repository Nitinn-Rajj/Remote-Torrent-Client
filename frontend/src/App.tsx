import React from 'react';
import { useAppSelector } from './hooks/redux';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileExplorer from './components/FileExplorer';
import Settings from './components/Settings';
import AddTorrentModal from './components/AddTorrentModal';

const App: React.FC = () => {
  const currentView = useAppSelector((state) => state.ui.currentView);

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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {renderView()}
      </main>
      <AddTorrentModal />
    </div>
  );
};

export default App;

