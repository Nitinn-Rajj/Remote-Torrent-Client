import React from 'react';

const FileExplorer: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Files</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">📁</p>
          <p>File explorer coming soon...</p>
          <p className="text-sm mt-2">Browse and stream your downloaded files</p>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
