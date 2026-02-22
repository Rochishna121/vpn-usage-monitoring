'use client';

import React, { useState, useEffect } from 'react';
import { Loader, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vpnApiClient, ConnectionLog } from '@/services/vpnApi';

export const ConnectionLogs: React.FC = () => {
  const [logs, setLogs] = useState<ConnectionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await vpnApiClient.getConnectionLogs();
      setLogs(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch connection logs:', err);
      setError('Failed to load connection logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'disconnected':
        return <Clock className="w-5 h-5 text-gray-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Logs</h2>
        <p className="text-gray-600">Recent VPN connection activity</p>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading connection logs...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-lg shadow p-12 text-center border border-red-200">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchLogs}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No connection logs yet</p>
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Server Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Data Used
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.serverLocation}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.ipAddress}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDuration(log.duration)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.dataUsed.toFixed(2)} MB</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
