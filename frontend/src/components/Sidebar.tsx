import React from 'react';
import { setCurrentView } from '../store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { UIState } from '../types';

interface MenuItem {
  id: UIState['currentView'];
  label: string;
  icon: string;
}

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((state) => state.ui.currentView);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '⌂' },
    { id: 'files', label: 'Library', icon: '▤' },
    { id: 'settings', label: 'Systems', icon: '⚙' },
  ];

  return (
  <aside className="group relative z-40 mx-4 mt-6 flex w-full max-w-lg flex-col overflow-hidden rounded-[2.25rem] border border-[#e2d8c7]/70 bg-[#f3efe5]/90 text-slate-700 shadow-[14px_18px_40px_rgba(72,60,45,0.14)] outline outline-1 outline-[#f7f2e6]/70 backdrop-blur-[18px] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[18px_26px_56px_rgba(72,60,45,0.2)] sm:mx-6 lg:fixed lg:left-8 lg:top-10 lg:mx-0 lg:w-80 lg:max-h-[calc(100vh-5rem)] lg:overflow-hidden before:pointer-events-none before:absolute before:inset-[0.65rem] before:rounded-[1.65rem] before:border before:border-white/70 before:bg-[linear-gradient(180deg,_rgba(255,255,255,0.85)_0%,_rgba(255,255,255,0)_70%)] before:opacity-0 before:transition-opacity before:duration-500 before:ease-out before:content-[''] group-hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,rgba(255,255,255,0)_1px)] after:bg-[length:100%_7px] after:opacity-40 after:mix-blend-soft-light after:content-['']">
      <div className="relative z-10 flex h-full flex-col">
        <div className="px-6 pb-7 pt-9">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-[1.2rem] border border-[#d6cabb]/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92)_0%,_rgba(235,227,211,0.8)_100%)] text-[0.8rem] font-semibold uppercase tracking-[0.4em] text-[#6b6f5d] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.85),inset_-2px_-3px_8px_rgba(135,107,85,0.18)]">
                RT
              </span>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-[#8c8e79]">
                  Control Deck
                </p>
                <h1 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-[#393e2f]">
                  Remote Torrent
                </h1>
                <p className="mt-1 text-[0.78rem] text-[#7b7f6d]">
                  Operator console v2.5·γ
                </p>
              </div>
            </div>
            <div className="hidden gap-2 lg:flex">
              <span className="h-3 w-3 rounded-full bg-[#ff8a7a] shadow-[0_0_8px_rgba(255,138,122,0.7)]" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-[#f5d880] shadow-[0_0_6px_rgba(245,216,128,0.6)]" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-[#7bd897] shadow-[0_0_7px_rgba(123,216,151,0.6)]" aria-hidden />
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 lg:px-6">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => dispatch(setCurrentView(item.id))}
                    aria-pressed={isActive}
                    className={`group/menu relative flex w-full items-center justify-between rounded-[1.35rem] border border-transparent px-4 py-3 text-left font-medium shadow-[2px_4px_10px_rgba(72,60,45,0.08)] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#95b59c]/60 ${
                      isActive
                        ? 'border-[#c3bfaf]/60 bg-[linear-gradient(145deg,_rgba(248,245,238,0.98)_0%,_rgba(231,223,211,0.95)_100%)] text-[#2f3026] shadow-[inset_2px_2px_6px_rgba(255,255,255,0.82),inset_-3px_-4px_7px_rgba(119,108,88,0.2)]'
                        : 'bg-[linear-gradient(145deg,_rgba(243,238,228,0.75)_0%,_rgba(234,228,216,0.7)_100%)] text-[#5d6252] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.78),inset_-2px_-2px_5px_rgba(119,108,88,0.16)] hover:border-[#c7c1b0]/50 hover:text-[#303328] hover:shadow-[inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-3px_-3px_7px_rgba(119,108,88,0.18)]'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className={`flex h-10 w-10 items-center justify-center rounded-[1.1rem] border text-base tracking-[0.25em] transition-all duration-300 ${
                          isActive
                            ? 'border-[#a2a893]/70 bg-[#e8efe1] text-[#3f4d3a] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.82),0_3px_9px_rgba(93,117,83,0.22)]'
                            : 'border-[#d4ccb7]/60 bg-[#f6f1e7]/70 text-[#7c7f6c] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82)] group-hover/menu:border-[#bfc4aa]/70 group-hover/menu:bg-[#eef3e5] group-hover/menu:text-[#47523f]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm uppercase tracking-[0.35em] text-[#9b9f8b]">
                          {item.id}
                        </span>
                        <span className="text-lg text-[#3a3d30]">{item.label}</span>
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`hidden text-sm tracking-[0.4em] transition-all duration-300 lg:block ${
                        isActive ? 'text-[#4f5a45]' : 'text-[#b8bdaa] group-hover/menu:text-[#6d7868]'
                      }`}
                    >
                      ▸
                    </span>
                    <span
                      aria-hidden
                      className={`absolute left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-b from-[#8fad7f] via-[#a7be8f] to-[#7d9d6b] shadow-[0_0_12px_rgba(143,173,127,0.45)]'
                          : 'bg-[#d9d3c2]/50 group-hover/menu:bg-gradient-to-b group-hover/menu:from-[#a5ad93]/60 group-hover/menu:via-[#cad5b8]/60 group-hover/menu:to-[#9faf8d]/60'
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

  <div className="border-t border-[#e0d7c6]/70 bg-[linear-gradient(180deg,_rgba(247,243,236,0.9)_0%,_rgba(233,226,213,0.95)_100%)] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="flex items-center justify-between gap-4 text-[0.82rem] text-[#5b5e4d]">
            <div className="flex items-center gap-4">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#b7c8a7]/80 bg-[#e7f5de] text-xs font-semibold uppercase tracking-[0.25em] text-[#3f5839] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.85),0_0_12px_rgba(148,199,132,0.35)]">
                ON
                <span className="pointer-events-none absolute inset-[-6px] rounded-full border border-[#b7c8a7]/40 opacity-70" />
                <span className="pointer-events-none absolute inset-[-10px] rounded-full border border-[#c9e2be]/30 opacity-40" />
              </span>
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.45em] text-[#979a88]">Status</p>
                <p className="mt-1 font-semibold text-[#404437]">Connected</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[0.68rem] uppercase tracking-[0.35em] text-[#a4a796]">Net Flux</p>
              <p className="font-mono text-sm text-[#4f5945]">+1.2 mb/s</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
