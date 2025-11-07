import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { closeDeleteTorrentModal } from '../store/slices/uiSlice';
import { deleteTorrent, fetchTorrents } from '../store/slices/torrentsSlice';

const DeleteTorrentModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deleteTorrentModalOpen, deleteTorrentHash } = useAppSelector((state) => state.ui);
  const torrents = useAppSelector((state) => state.torrents.items);

  const selectedTorrent = torrents.find(t => t.InfoHash === deleteTorrentHash);

  const handleClose = () => {
    dispatch(closeDeleteTorrentModal());
  };

  const handleConfirmDelete = async () => {
    if (deleteTorrentHash) {
      await dispatch(deleteTorrent(deleteTorrentHash));
      dispatch(fetchTorrents());
      handleClose();
    }
  };

  if (!deleteTorrentModalOpen || !selectedTorrent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-[1.8rem] border border-[#dcd3c2]/80 bg-[linear-gradient(135deg,_rgba(251,247,240,0.98)_0%,_rgba(236,227,213,0.96)_100%)] shadow-[0_20px_60px_rgba(69,56,42,0.25)] outline outline-1 outline-[#f8f3e7]/70">
        {/* Texture overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_11px] opacity-22" />

        {/* Header */}
        <div className="relative border-b border-[#dcd3c2]/50 bg-gradient-to-br from-[rgba(250,227,225,0.5)] to-transparent px-6 py-5">
          <h2 className="text-xl font-bold tracking-tight text-[#6c3a39]">
            Delete Torrent
          </h2>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <div className="mb-6 rounded-2xl border border-[#dcd3c2]/60 bg-[linear-gradient(135deg,_rgba(255,250,245,0.7)_0%,_rgba(245,235,225,0.6)_100%)] p-4 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.7)]">
            <p className="mb-3 text-sm font-medium text-[#6b6f5d]">
              Are you sure you want to delete this torrent?
            </p>
            <p className="mb-2 truncate text-base font-semibold text-[#343429]">
              {selectedTorrent.Name}
            </p>
            <p className="text-xs text-[#8b7d6b]">
              This action cannot be undone. The torrent will be removed from your download list.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 rounded-full border border-[#c8b89a]/70 bg-[linear-gradient(135deg,_rgba(245,235,218,0.95)_0%,_rgba(230,215,195,0.9)_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#5a4a3a] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(90,74,58,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(90,74,58,0.24)]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 rounded-full border border-[#e1b9b3]/70 bg-[linear-gradient(135deg,_rgba(250,227,225,0.92)_0%,_rgba(235,200,198,0.88)_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#6c3a39] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_3px_9px_rgba(139,68,66,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(139,68,66,0.24)]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTorrentModal;
