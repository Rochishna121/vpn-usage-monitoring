'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UsageOverview } from '@/components/UsageOverview';
import { ConnectionLogs } from '@/components/ConnectionLogs';
import { ServerSelection } from '@/components/ServerSelection';
import { AccountProfile } from '@/components/AccountProfile';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="animate-slideIn">
          {activeTab === 'overview' && <UsageOverview />}
          {activeTab === 'logs' && <ConnectionLogs />}
          {activeTab === 'servers' && <ServerSelection />}
          {activeTab === 'account' && <AccountProfile />}
        </div>
      </main>
    </div>
  );
}
