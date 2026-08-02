import { useState, useEffect, useCallback } from 'react';
import type {
  PlatformTab,
  IPlatformStats,
  IPlatformTenant,
  IPlatformSubscription,
  IPlatformLicense,
  IPlatformDevice,
  IPlatformSyncOverview,
  IPlatformHealth,
  IPlatformAdminUser,
  IPlatformNotification,
  IPlatformAuditEntry,
  IPlatformGlobalConfig,
  IPlatformFeatureFlag
} from '../types/platformControl.types';
import { PlatformControlApiService } from '../services/platformControlApi';

export function usePlatformControl() {
  const [activeTab, setActiveTab] = useState<PlatformTab>('DASHBOARD');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<IPlatformStats | null>(null);
  const [tenants, setTenants] = useState<IPlatformTenant[]>([]);
  const [subscriptions, setSubscriptions] = useState<IPlatformSubscription[]>([]);
  const [licenses, setLicenses] = useState<IPlatformLicense[]>([]);
  const [devices, setDevices] = useState<IPlatformDevice[]>([]);
  const [syncOverview, setSyncOverview] = useState<IPlatformSyncOverview[]>([]);
  const [healthServices, setHealthServices] = useState<IPlatformHealth[]>([]);
  const [admins, setAdmins] = useState<IPlatformAdminUser[]>([]);
  const [notifications, setNotifications] = useState<IPlatformNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<IPlatformAuditEntry[]>([]);
  const [globalConfig, setGlobalConfig] = useState<IPlatformGlobalConfig | null>(null);
  const [featureFlags, setFeatureFlags] = useState<IPlatformFeatureFlag[]>([]);

  // Search & Command Palette Overlay state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsRes,
        tenantsRes,
        subsRes,
        licRes,
        devRes,
        syncRes,
        healthRes,
        adminsRes,
        notifRes,
        auditRes,
        configRes,
        ffRes
      ] = await Promise.all([
        PlatformControlApiService.getPlatformStats(),
        PlatformControlApiService.getTenants(),
        PlatformControlApiService.getSubscriptions(),
        PlatformControlApiService.getLicenses(),
        PlatformControlApiService.getDevices(),
        PlatformControlApiService.getSyncOverview(),
        PlatformControlApiService.getHealth(),
        PlatformControlApiService.getAdmins(),
        PlatformControlApiService.getNotifications(),
        PlatformControlApiService.getAuditLogs(),
        PlatformControlApiService.getGlobalConfig(),
        PlatformControlApiService.getFeatureFlags()
      ]);

      setStats(statsRes);
      setTenants(tenantsRes);
      setSubscriptions(subsRes);
      setLicenses(licRes);
      setDevices(devRes);
      setSyncOverview(syncRes);
      setHealthServices(healthRes);
      setAdmins(adminsRes);
      setNotifications(notifRes);
      setAuditLogs(auditRes);
      setGlobalConfig(configRes);
      setFeatureFlags(ffRes);
    } catch (err: any) {
      setError(err?.message || 'Failed to load Platform Control Panel data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Global Ctrl + K Command Palette Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAction = async (actionName: string, entityId: string) => {
    alert(`Platform Action [${actionName}] triggered for ID: ${entityId}`);
    await loadData();
  };

  return {
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
    refresh: loadData,
    handleAction
  };
}
