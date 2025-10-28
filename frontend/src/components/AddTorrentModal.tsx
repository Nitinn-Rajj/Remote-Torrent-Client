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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(245,240,231,0.96)_0%,_rgba(221,214,199,0.92)_45%,_rgba(198,190,173,0.88)_100%)] opacity-90 backdrop-blur-[14px]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_14px] opacity-35 mix-blend-soft-light" aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-torrent-title"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#dcd3c2]/70 bg-[radial-gradient(circle_at_top,_rgba(251,247,240,0.97)_0%,_rgba(234,225,212,0.92)_80%,_rgba(221,212,198,0.9)_100%)] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.82),18px_22px_48px_rgba(62,50,38,0.22)] outline outline-1 outline-[#f8f2e8]/70"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:16px_100%] opacity-25" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:100%_12px] opacity-25" />

        <div className="relative z-10 p-8 sm:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.55em] text-[#969a87]">Launch Pad</p>
                <h2 id="add-torrent-title" className="mt-3 text-3xl font-semibold tracking-tight text-[#2f3227]">
                  Add Torrent
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#707462]">
                  Drop in a magnet URI to queue your download. The daemon will handshake peers instantly once validated.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="group relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d2c8b6]/70 bg-[#f3ece0] text-[#6f7462] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),0_4px_12px_rgba(75,62,48,0.12)] outline outline-1 outline-[#f7efe4]/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_7px_18px_rgba(75,62,48,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#97b28d]/50"
                aria-label="Close add torrent modal"
              >
                ✕
                <span className="pointer-events-none absolute inset-0 rounded-2xl border border-[#fdf9f1]/70 opacity-50" aria-hidden />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8b8f7b]">
                  Magnet Link
                </label>
                <div className="relative overflow-hidden rounded-[1.4rem] border border-[#d6ccbb]/70 bg-[#f6f0e5] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.86),inset_-3px_-3px_5px_rgba(147,130,103,0.14)] outline outline-1 outline-[#f8f2e8]/60">
                  <input
                    type="text"
                    value={magnetLink}
                    onChange={(e) => setMagnetLink(e.target.value)}
                    placeholder="magnet:?xt=urn:btih:..."
                    className="w-full bg-transparent px-5 py-4 text-sm text-[#343529] placeholder:text-[#a7ab99] focus:outline-none focus:ring-2 focus:ring-[#9fb89a]/50"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[length:100%_10px] opacity-30" />
                </div>
                {error && (
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b86156]">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#d47a6f]" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 border-t border-[#ded5c5]/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs uppercase tracking-[0.35em] text-[#8e927f]">
                  {magnetLink ? 'Ready for uplink' : 'Awaiting input'}
                </span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="group relative overflow-hidden rounded-[1.2rem] border border-[#d4cab9]/70 bg-[#f3ece0] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.4em] text-[#4c4f3d] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),6px_10px_18px_rgba(70,58,44,0.12)] outline outline-1 outline-[#f7efe4]/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[8px_12px_20px_rgba(70,58,44,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fb89a]/50"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_10px] opacity-40" />
                    <span className="relative">Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="group relative overflow-hidden rounded-[1.2rem] border border-[#b7cdb1]/70 bg-[linear-gradient(135deg,_rgba(234,244,226,0.95)_0%,_rgba(204,225,199,0.9)_100%)] px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.45em] text-[#344733] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82),8px_12px_20px_rgba(69,92,62,0.16)] outline outline-1 outline-[#eef6e9]/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[10px_15px_24px_rgba(69,92,62,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8da886]/60"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_10px] opacity-40" />
                    <span className="relative">Commit</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTorrentModal;
