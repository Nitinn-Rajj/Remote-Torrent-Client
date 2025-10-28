import React from 'react';
import { openAddTorrentModal } from '../store/slices/uiSlice';
import { useAppDispatch } from '../hooks/redux';

const AddTorrentButton: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(openAddTorrentModal())}
      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
    >
      + Add Torrent
    </button>
  );
};

export default AddTorrentButton;
