import React from 'react';

const FileExplorer: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-[#969a87]">Archive</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#2f3227]">Files</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6a6e5c]">
          Browse and play finished downloads here once the library tools are ready.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-[#ded4c3]/70 bg-[radial-gradient(circle_at_top,_rgba(251,247,240,0.95)_0%,_rgba(235,226,212,0.9)_100%)] p-12 text-center shadow-[inset_2px_2px_5px_rgba(255,255,255,0.84),12px_18px_30px_rgba(70,58,44,0.12)] outline outline-1 outline-[#f7f1e6]/70">
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_12px] opacity-30" />
        <div className="relative z-10 space-y-4 text-[#6d7160]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[#d3cab8]/70 bg-[#f1ebe0] text-3xl">📁</div>
          <p className="text-lg font-medium text-[#35382c]">File explorer coming soon…</p>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[#7b7f6c]">
            Drop torrents now to populate this library. Expect timeline, quick filters, and inline streaming once the next module ships.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
