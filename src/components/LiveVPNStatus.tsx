'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff, Play, Square } from 'lucide-react';
import { vpnApiClient, type Server } from '@/services/vpnApi';

export const LiveVPNStatus: React.FC = () => {
  const [connectionTime, setConnectionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [dataTransferred, setDataTransferred] = useState(0);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial VPN status and server
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const status = await vpnApiClient.getVPNStatus();
        if (status.isConnected && status.connectionId) {
          setIsRunning(true);
          setIsConnected(true);
          setConnectionId(status.connectionId);
          setConnectionTime(status.connectionTime || 0);
          setDataTransferred(status.dataUsed || 0);
        }

        const servers = await vpnApiClient.getAvailableServers();
        if (servers.length > 0) {
          // Try to load the previously selected server from localStorage
          const savedServerId = localStorage.getItem('selectedServerId');
          const selectedServer = savedServerId
            ? servers.find((s) => s.id === savedServerId) || servers[0]
            : servers[0];
          setSelectedServer(selectedServer);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Update connection time and data when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setConnectionTime((prev) => prev + 1);
      setDataTransferred((prev) => prev + Math.random() * (500 - 100) + 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await vpnApiClient.startVPN(selectedServer?.id);
      
      setConnectionId(result.connectionId);
      setIsRunning(true);
      setIsConnected(true);
      setConnectionTime(0);
      setDataTransferred(0);
    } catch (err) {
      setError('Failed to start VPN. Please try again.');
      console.error('Start VPN error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    if (isLoading || !connectionId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await vpnApiClient.stopVPN(connectionId);
      
      setIsRunning(false);
      setIsConnected(false);
      setConnectionId(null);
      setConnectionTime(0);
      setDataTransferred(0);
    } catch (err) {
      setError('Failed to stop VPN. Please try again.');
      console.error('Stop VPN error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDataTransferred = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Live Connection Status */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-300 text-red-200 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <Wifi className="w-8 h-8 text-green-300 animate-pulse" />
                  <span className="text-lg font-semibold">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <WifiOff className="w-8 h-8 text-red-300" />
                  <span className="text-lg font-semibold">Disconnected</span>
                </div>
              )}
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full">
              <span className="text-sm font-medium">Premium</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20"></div>

          {/* Server Info */}
          <div>
            <p className="text-blue-100 text-sm mb-2">Connected Server</p>
            <p className="text-2xl font-bold">{isConnected && selectedServer ? selectedServer.location : 'Not Connected'}</p>
            <p className="text-blue-100 text-sm mt-1">Protocol: {isConnected && selectedServer ? selectedServer.protocol : 'N/A'}</p>
          </div>

          {/* Connection Time */}
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-blue-100 text-sm mb-2">Connection Time</p>
            <p className="text-3xl font-bold font-mono">{formatTime(connectionTime)}</p>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleStart}
              disabled={isRunning || isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition ${
                isRunning || isLoading
                  ? 'bg-green-500/30 text-green-200 cursor-not-allowed opacity-50'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg'
              }`}
            >
              <Play className="w-5 h-5" />
              {isLoading ? 'Loading...' : 'Start VPN'}
            </button>
            <button
              onClick={handleStop}
              disabled={!isRunning || isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition ${
                !isRunning || isLoading
                  ? 'bg-red-500/30 text-red-200 cursor-not-allowed opacity-50'
                  : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg'
              }`}
            >
              <Square className="w-5 h-5" />
              {isLoading ? 'Loading...' : 'Stop VPN'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Transfer & Stats */}
      <div className="space-y-4">
        {/* Data Transferred */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Transferred</h3>
            <Activity className={`w-6 h-6 ${isRunning ? 'text-blue-600 animate-pulse' : 'text-gray-400'}`} />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Session</p>
              <p className="text-3xl font-bold text-gray-900">{formatDataTransferred(dataTransferred)}</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                style={{width: `${Math.min((dataTransferred / (1024 * 100)), 100)}%`}}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium mb-1">Upload Speed</p>
            <p className="text-2xl font-bold text-green-900">{isRunning ? '45.2' : '0'} Mbps</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">Download Speed</p>
            <p className="text-2xl font-bold text-blue-900">{isRunning ? '110.5' : '0'} Mbps</p>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium mb-2">Your IP Address</p>
          <p className="font-mono text-lg text-gray-900 break-all">{isConnected && selectedServer ? selectedServer.ip : 'Not connected'}</p>
          <p className="text-xs text-gray-600 mt-2">Location: {isConnected && selectedServer ? selectedServer.location : 'Not connected'}</p>
        </div>

        {/* Status Info */}
        <div className={`rounded-lg p-4 ${isRunning ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <p className={`text-sm font-medium ${isRunning ? 'text-green-700' : 'text-gray-700'}`}>
            {isRunning ? '✓ VPN is actively running' : '⚪ VPN is stopped - click Start to begin'}
          </p>
        </div>
      </div>
    </div>
  );
};
