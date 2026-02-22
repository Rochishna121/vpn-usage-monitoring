'use client';

import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Activity, TrendingUp, Clock, AlertCircle, Zap } from 'lucide-react';
import { demoUsageStats, demoUsageTrend, demoWeeklyUsage, demoServerSpeed } from '@/lib/demoData';
import { LiveVPNStatus } from './LiveVPNStatus';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export const UsageOverview: React.FC = () => {
  const stats = demoUsageStats;
  const [chartKey, setChartKey] = useState(0);

  // Redraw charts on mount to ensure proper rendering
  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, []);

  const formatSpeed = (speedBps: number): string => {
    if (speedBps < 1024) return `${speedBps} B/s`;
    if (speedBps < 1024 * 1024) return `${(speedBps / 1024).toFixed(2)} KB/s`;
    return `${(speedBps / (1024 * 1024)).toFixed(2)} MB/s`;
  };

  const statCards = [
    {
      title: 'Upload Speed',
      value: formatSpeed(stats.currentSpeed.upload),
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Download Speed',
      value: formatSpeed(stats.currentSpeed.download),
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Monthly Usage',
      value: `${stats.monthUsage.toFixed(2)} GB`,
      icon: Activity,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
    },
  ];

  // Hourly usage trend chart
  const hourlyChartData = {
    labels: demoUsageTrend.map((d) => d.hour),
    datasets: [
      {
        label: 'Upload (MB)',
        data: demoUsageTrend.map((d) => d.upload),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Download (MB)',
        data: demoUsageTrend.map((d) => d.download),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Weekly usage chart
  const weeklyChartData = {
    labels: demoWeeklyUsage.map((d) => d.day),
    datasets: [
      {
        label: 'Data Used (GB)',
        data: demoWeeklyUsage.map((d) => d.usage),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
        ],
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Server speed comparison
  const serverSpeedData = {
    labels: demoServerSpeed.map((s) => s.server),
    datasets: [
      {
        label: 'Download (Mbps)',
        data: demoServerSpeed.map((s) => s.download),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Upload (Mbps)',
        data: demoServerSpeed.map((s) => s.upload),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Usage distribution pie chart
  const usageDistributionData = {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: [
      {
        data: [stats.todayUsage, stats.weekUsage - stats.todayUsage, stats.monthUsage - stats.weekUsage],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)'],
        borderColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12, weight: 'bold' as const },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Usage Overview</h2>
        <p className="text-gray-600">Real-time VPN usage statistics and analytics</p>
      </div>

      {/* Live VPN Status */}
      <LiveVPNStatus />

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/50 w-3/4 rounded-full"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" key={chartKey}>
        {/* Hourly Usage Trend */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Hourly Usage Trend
          </h3>
          <div className="h-80">
            <Line
              data={hourlyChartData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Weekly Usage */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Weekly Data Usage
          </h3>
          <div className="h-80">
            <Bar
              data={weeklyChartData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Server Speed Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Server Speed Comparison
          </h3>
          <div className="h-80">
            <Bar
              data={serverSpeedData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Usage Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Usage Distribution
          </h3>
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={usageDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      padding: 20,
                      font: { size: 12, weight: 'bold' as const },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Analytics Insight</h4>
            <p className="text-sm text-blue-800">
              Your peak usage hours are between 16:00 - 23:00. Download speeds on SYD-01 and AMS-01 servers are fastest. Consider connecting during off-peak hours for optimal performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
