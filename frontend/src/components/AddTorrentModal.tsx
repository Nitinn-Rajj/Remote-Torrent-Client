import React, { useState } from 'react';
import { addTorrent } from '../store/slices/torrentsSlice';
import { closeAddTorrentModal } from '../store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const AddTorrentModal: React.FC = () => {
  const [magnetLink, setMagnetLink] = useState<string>('');
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.addTorrentModalOpen);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!magnetLink.trim()) {
      setError('Please enter a magnet link');
      return;
    }

    if (!magnetLink.startsWith('magnet:')) {
      setError('Invalid magnet link format');
      return;
    }

    try {
      await dispatch(addTorrent(magnetLink)).unwrap();
      setMagnetLink('');
      dispatch(closeAddTorrentModal());
    } catch (err) {
      setError((err as Error).message || 'Failed to add torrent');
    }
  };

  const handleClose = () => {
    setMagnetLink('');
    setError('');
    dispatch(closeAddTorrentModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add Torrent</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Magnet Link
            </label>
            <input
              type="text"
              value={magnetLink}
              onChange={(e) => setMagnetLink(e.target.value)}
              placeholder="magnet:?xt=urn:btih:..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Torrent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTorrentModal;
