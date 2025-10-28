import React from 'react';
import { openAddTorrentModal } from '../store/slices/uiSlice';
import { useAppDispatch } from '../hooks/redux';

const AddTorrentButton: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(openAddTorrentModal())}
  className="group relative overflow-hidden rounded-[1.25rem] border border-[#c3cfb7]/70 bg-[linear-gradient(135deg,_rgba(243,248,236,0.92)_0%,_rgba(225,237,217,0.86)_100%)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-[#3f4636] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.84),9px_12px_22px_rgba(66,53,40,0.15)] outline outline-1 outline-[#f0f6eb]/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_16px_26px_rgba(66,53,40,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8da886]/50"
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_9px] opacity-40 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-60" />
      <span className="pointer-events-none absolute inset-0 translate-y-full bg-[linear-gradient(180deg,_rgba(173,208,164,0.5)_0%,_rgba(173,208,164,0)_70%)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-80" />
      <span className="relative z-10 flex items-center gap-3">
        <span className="rounded-full border border-[#9fb698]/60 bg-[#e6f0df] px-2 py-1 text-[0.6rem] tracking-[0.35em]">+</span>
        <span>Launch Torrent</span>
      </span>
    </button>
  );
};

export default AddTorrentButton;
