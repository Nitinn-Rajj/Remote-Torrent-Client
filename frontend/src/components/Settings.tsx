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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Download Directory */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Download Directory
          </label>
          <input
            type="text"
            name="downloadDirectory"
            value={formData.downloadDirectory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="/path/to/downloads"
          />
        </div>

        {/* Incoming Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Incoming Port
          </label>
          <input
            type="number"
            name="incomingPort"
            value={formData.incomingPort}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Max Concurrent Downloads */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Concurrent Downloads
          </label>
          <input
            type="number"
            name="maxConcurrentTorrents"
            value={formData.maxConcurrentTorrents}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="enableUpload"
              checked={formData.enableUpload}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Enable Upload
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="enableSeeding"
              checked={formData.enableSeeding}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Enable Seeding
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {saved && (
              <span className="text-green-600 text-sm">✓ Settings saved successfully</span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
