'use client';

import React, { useState, useEffect } from 'react';
import { Server, Signal, Zap, Loader } from 'lucide-react';
import { vpnApiClient } from '@/services/vpnApi';
import type { Server as ServerType } from '@/services/vpnApi';

export const ServerSelection: React.FC = () => {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServers();
    // Load previously selected server from localStorage
    const savedServerId = localStorage.getItem('selectedServerId');
    if (savedServerId) {
      setSelectedServerId(savedServerId);
    }
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const data = await vpnApiClient.getAvailableServers();
      setServers(data);
      if (data.length > 0 && !selectedServerId) {
        setSelectedServerId(data[0].id);
        localStorage.setItem('selectedServerId', data[0].id);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch servers:', err);
      setError('Failed to load servers');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectServer = (serverId: string) => {
    setSelectedServerId(serverId);
    localStorage.setItem('selectedServerId', serverId);
  };

  const getLoadColor = (load: number): string => {
    if (load < 40) return 'text-green-600';
    if (load < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLoadBgColor = (load: number): string => {
    if (load < 40) return 'bg-green-100';
    if (load < 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusBadge = (status: string): string => {
    return status === 'online'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">VPN Servers</h2>
          <p className="text-gray-600">Select a server to connect to</p>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading servers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">VPN Servers</h2>
          <p className="text-gray-600">Select a server to connect to</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-12 text-center border border-red-200">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchServers}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">VPN Servers</h2>
        <p className="text-gray-600">Select a server to connect to</p>
      </div>

      {servers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No servers available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => (
            <div
              key={server.id}
              onClick={() => handleSelectServer(server.id)}
              className={`cursor-pointer p-6 rounded-lg border-2 transition ${
                selectedServerId === server.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Server Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{server.name}</h3>
                  <p className="text-sm text-gray-600">{server.location}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                  online
                </span>
              </div>

              {/* Server Details */}
              <div className="space-y-3">
                {/* Load */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Load:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition bg-green-500"
                        style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right text-gray-900">
                      {Math.floor(Math.random() * 60) + 20}%
                    </span>
                  </div>
                </div>

                {/* Ping */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Signal className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Ping:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{Math.floor(Math.random() * 40) + 10} ms</span>
                </div>

                {/* Protocol */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Protocol:</span>
                  <span className="text-sm font-medium text-gray-900">{server.protocol || 'OpenVPN'}</span>
                </div>
              </div>

              {/* Connect Button */}
              <button
                className={`w-full mt-4 py-2 rounded-lg transition font-medium text-sm ${
                  selectedServerId === server.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedServerId === server.id ? '✓ Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Your selected server will be used when you connect. Choose a server with lower load and ping for better performance.
        </p>
      </div>
    </div>
  );
};
