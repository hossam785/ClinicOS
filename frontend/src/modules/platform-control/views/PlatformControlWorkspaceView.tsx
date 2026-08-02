import React from 'react';
import {
  Building2,
  Cpu,
  Key,
  Activity,
  DollarSign,
  Zap,
  ShieldCheck,
  Bell,
  Sliders,
  Search,
  Command
} from 'lucide-react';
import { usePlatformControl } from '../hooks/usePlatformControl';
import type { PlatformTab } from '../types/platformControl.types';
import { PlatformMetricsHeader } from '../components/PlatformMetricsHeader';
import { PlatformClinicTable } from '../components/PlatformClinicTable';
import { PlatformSubscriptionCenter } from '../components/PlatformSubscriptionCenter';
import { PlatformLicenseCenter } from '../components/PlatformLicenseCenter';
import { PlatformDeviceCenter } from '../components/PlatformDeviceCenter';
import { PlatformSyncTelemetry } from '../components/PlatformSyncTelemetry';
import { PlatformHealthDiagnostics } from '../components/PlatformHealthDiagnostics';
import { PlatformAdminCenter } from '../components/PlatformAdminCenter';
import { PlatformNotificationCenter } from '../components/PlatformNotificationCenter';
import { PlatformAuditCenter } from '../components/PlatformAuditCenter';
import { PlatformConfigPanel } from '../components/PlatformConfigPanel';
import { PlatformFeatureFlags } from '../components/PlatformFeatureFlags';

export const PlatformControlWorkspaceView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    loading,
    error,
    stats,
    tenants,
    subscriptions,
    licenses,
    devices,
    syncOverview,
    healthServices,
    admins,
    notifications,
    auditLogs,
    globalConfig,
    featureFlags,
    commandPaletteOpen,
    setCommandPaletteOpen,
    searchQuery,
    setSearchQuery,
    handleAction
  } = usePlatformControl();

  const tabs: { id: PlatformTab; label: string; icon: React.ReactNode }[] = [
    { id: 'DASHBOARD', label: 'Overview', icon: <Building2 className="w-4 h-4" /> },
    { id: 'CLINICS', label: 'Clinic Tenants', icon: <Building2 className="w-4 h-4" /> },
    { id: 'SUBSCRIPTIONS', label: 'Subscriptions', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'LICENSES', label: 'Licenses', icon: <Key className="w-4 h-4" /> },
    { id: 'DEVICES', label: 'Registered PCs', icon: <Cpu className="w-4 h-4" /> },
    { id: 'SYNC', label: 'Sync Telemetry', icon: <Activity className="w-4 h-4" /> },
    { id: 'HEALTH', label: 'Platform Health', icon: <Zap className="w-4 h-4" /> },
    { id: 'ADMINS', label: 'Administrators', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'AUDIT', label: 'Audit Center', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'CONFIG', label: 'Configuration', icon: <Sliders className="w-4 h-4" /> },
    { id: 'FEATURES', label: 'Feature Flags', icon: <Sliders className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Top Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">ClinicOS Platform Control Panel</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized Enterprise SaaS Administration Gateway
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 px-3.5 py-2 rounded-xl text-xs hover:border-slate-700 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search Platform...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>

          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Global Metrics Header */}
      <PlatformMetricsHeader stats={stats} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-slate-800 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Workspace Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading Platform Control Panel...</div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
          {error}
        </div>
      ) : (
        <div>
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              <PlatformClinicTable tenants={tenants} onAction={handleAction} />
              <PlatformSyncTelemetry syncOverview={syncOverview} onAction={handleAction} />
            </div>
          )}
          {activeTab === 'CLINICS' && <PlatformClinicTable tenants={tenants} onAction={handleAction} />}
          {activeTab === 'SUBSCRIPTIONS' && <PlatformSubscriptionCenter subscriptions={subscriptions} onAction={handleAction} />}
          {activeTab === 'LICENSES' && <PlatformLicenseCenter licenses={licenses} onAction={handleAction} />}
          {activeTab === 'DEVICES' && <PlatformDeviceCenter devices={devices} onAction={handleAction} />}
          {activeTab === 'SYNC' && <PlatformSyncTelemetry syncOverview={syncOverview} onAction={handleAction} />}
          {activeTab === 'HEALTH' && <PlatformHealthDiagnostics healthServices={healthServices} onAction={handleAction} />}
          {activeTab === 'ADMINS' && <PlatformAdminCenter admins={admins} onAction={handleAction} />}
          {activeTab === 'NOTIFICATIONS' && <PlatformNotificationCenter notifications={notifications} onAction={handleAction} />}
          {activeTab === 'AUDIT' && <PlatformAuditCenter auditLogs={auditLogs} onAction={handleAction} />}
          {activeTab === 'CONFIG' && <PlatformConfigPanel config={globalConfig} onAction={handleAction} />}
          {activeTab === 'FEATURES' && <PlatformFeatureFlags featureFlags={featureFlags} onAction={handleAction} />}
        </div>
      )}

      {/* Global Command Palette Overlay Modal */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search clinics, licenses, devices, administrators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
              />
              <button
                onClick={() => setCommandPaletteOpen(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto text-xs text-slate-400 space-y-2">
              <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Quick Actions</p>
              <div
                onClick={() => {
                  setActiveTab('CLINICS');
                  setCommandPaletteOpen(false);
                }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-between text-slate-200"
              >
                <span>Navigate to Clinic Tenants Directory</span>
                <kbd className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">Jump</kbd>
              </div>
              <div
                onClick={() => {
                  setActiveTab('LICENSES');
                  setCommandPaletteOpen(false);
                }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-between text-slate-200"
              >
                <span>Navigate to License Management Center</span>
                <kbd className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">Jump</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformControlWorkspaceView;
