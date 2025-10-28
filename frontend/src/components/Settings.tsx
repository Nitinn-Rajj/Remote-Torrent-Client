import React, { useState, useEffect } from 'react';
import { fetchConfig, updateConfig } from '../store/slices/configSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Config } from '../types';

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: config, loading } = useAppSelector((state) => state.config);
  const [formData, setFormData] = useState<Config>(config);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value,
    });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateConfig(formData)).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  if (loading) {
    return (
  <div className="flex h-64 items-center justify-center rounded-[1.8rem] border border-[#e0d6c6]/80 bg-[radial-gradient(circle_at_top,_rgba(249,245,238,0.93)_0%,_rgba(236,227,213,0.9)_100%)] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.82),12px_16px_30px_rgba(70,58,44,0.12)] outline outline-1 outline-[#f6f0e6]/70">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#b4c7a9]/50 border-t-[#6f8f6b]" aria-label="Loading settings" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-[#969a87]">Calibration</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#2e3326]">Settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#686c59]">
          Tweak the transmission stack. These controls keep the retro rig humming while embracing modern transfer throughput.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-[2rem] border border-[#ded4c4]/70 bg-[radial-gradient(circle_at_top,_rgba(251,247,240,0.96)_0%,_rgba(236,227,213,0.9)_100%)] p-8 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.82),14px_20px_34px_rgba(70,58,44,0.12)] outline outline-1 outline-[#f8f2e8]/70"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_12px] opacity-35" />
        <div className="relative z-10 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Download Directory */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a8e7a]">
                Download Directory
              </label>
              <input
                type="text"
                name="downloadDirectory"
                value={formData.downloadDirectory}
                onChange={handleChange}
                className="rounded-[1.1rem] border border-[#d6ccb8]/70 bg-[#f5efe4] px-4 py-3 text-sm text-[#3a3d30] shadow-[inset_2px_2px_3px_rgba(255,255,255,0.8),inset_-2px_-2px_3px_rgba(145,128,103,0.1)] outline outline-1 outline-[#f8f1e7]/60 focus:outline-none focus:ring-2 focus:ring-[#9fb89a]/50"
                placeholder="/path/to/downloads"
              />
            </div>

            {/* Incoming Port */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a8e7a]">
                Incoming Port
              </label>
              <input
                type="number"
                name="incomingPort"
                value={formData.incomingPort}
                onChange={handleChange}
                className="rounded-[1.1rem] border border-[#d6ccb8]/70 bg-[#f5efe4] px-4 py-3 text-sm text-[#3a3d30] shadow-[inset_2px_2px_3px_rgba(255,255,255,0.8),inset_-2px_-2px_3px_rgba(145,128,103,0.1)] outline outline-1 outline-[#f8f1e7]/60 focus:outline-none focus:ring-2 focus:ring-[#9fb89a]/50"
              />
            </div>

            {/* Max Concurrent Downloads */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a8e7a]">
                Max Concurrent Downloads
              </label>
              <input
                type="number"
                name="maxConcurrentTorrents"
                value={formData.maxConcurrentTorrents}
                onChange={handleChange}
                className="rounded-[1.1rem] border border-[#d6ccb8]/70 bg-[#f5efe4] px-4 py-3 text-sm text-[#3a3d30] shadow-[inset_2px_2px_3px_rgba(255,255,255,0.8),inset_-2px_-2px_3px_rgba(145,128,103,0.1)] outline outline-1 outline-[#f8f1e7]/60 focus:outline-none focus:ring-2 focus:ring-[#9fb89a]/50"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a8e7a]">
                Upload Throughput Throttle
              </label>
              <div className="rounded-[1.1rem] border border-dashed border-[#d6ccb8]/70 bg-[#f8f3ea]/70 px-4 py-3 text-xs uppercase tracking-[0.35em] text-[#9a9e8b] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.75)] outline outline-1 outline-[#faf5eb]/60">
                governed by enable upload toggle
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid gap-4 rounded-[1.35rem] border border-[#dcd1bf]/70 bg-[#f3ecdf]/80 p-6 shadow-[inset_2px_2px_3px_rgba(255,255,255,0.78)] outline outline-1 outline-[#f5ede1]/60 md:grid-cols-2">
            <label className="flex items-center gap-4 text-sm text-[#3e4032]">
              <span className="relative flex h-6 w-6 items-center justify-center rounded-[0.9rem] border border-[#c4cdb0]/70 bg-[#edf3e3] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82)] outline outline-1 outline-[#f1f6ec]/60">
                <input
                  type="checkbox"
                  name="enableUpload"
                  checked={formData.enableUpload}
                  onChange={handleChange}
                  className="absolute h-full w-full cursor-pointer opacity-0"
                />
                <span
                  className={`pointer-events-none text-xs font-semibold ${
                    formData.enableUpload ? 'text-[#4f6a46]' : 'text-[#a8ae9a]'
                  }`}
                >
                  {formData.enableUpload ? 'ON' : 'OFF'}
                </span>
              </span>
              <span className="flex-1">
                <span className="block text-xs uppercase tracking-[0.35em] text-[#8c907b]">Channel</span>
                <span className="text-sm font-medium">Enable Upload</span>
              </span>
            </label>

            <label className="flex items-center gap-4 text-sm text-[#3e4032]">
              <span className="relative flex h-6 w-6 items-center justify-center rounded-[0.9rem] border border-[#c4cdb0]/70 bg-[#edf3e3] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.82)] outline outline-1 outline-[#f1f6ec]/60">
                <input
                  type="checkbox"
                  name="enableSeeding"
                  checked={formData.enableSeeding}
                  onChange={handleChange}
                  className="absolute h-full w-full cursor-pointer opacity-0"
                />
                <span
                  className={`pointer-events-none text-xs font-semibold ${
                    formData.enableSeeding ? 'text-[#4f6a46]' : 'text-[#a8ae9a]'
                  }`}
                >
                  {formData.enableSeeding ? 'ON' : 'OFF'}
                </span>
              </span>
              <span className="flex-1">
                <span className="block text-xs uppercase tracking-[0.35em] text-[#8c907b]">Channel</span>
                <span className="text-sm font-medium">Enable Seeding</span>
              </span>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex flex-col gap-4 border-t border-[#dfd5c4]/70 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm uppercase tracking-[0.35em] text-[#8e927f]">
              {saved ? (
                <span className="flex items-center gap-3 text-[#5d7358]">
                  <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-[#84b181]" />
                  Synced to daemon
                </span>
              ) : (
                <span>Pending Commit</span>
              )}
            </div>
            <button
              type="submit"
              className="group relative overflow-hidden rounded-[1.25rem] border border-[#c4cfb6]/70 bg-[linear-gradient(135deg,_rgba(240,247,233,0.94)_0%,_rgba(221,234,216,0.88)_100%)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-[#3f4636] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.84),10px_14px_24px_rgba(66,53,40,0.16)] outline outline-1 outline-[#eef6e8]/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_16px_26px_rgba(66,53,40,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8da886]/50"
            >
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_9px] opacity-40 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-60" />
              <span className="relative z-10">Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
