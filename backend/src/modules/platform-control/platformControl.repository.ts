import type {
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
} from './platformControl.types';

export class PlatformControlRepository {
  private static tenantsStore: Map<string, IPlatformTenant> = new Map([
    [
      'tenant-default',
      {
        tenantId: 'tenant-default',
        clinicId: 'clinic-default',
        clinicName: 'Al-Mansoor Specialist Clinic',
        ownerName: 'Dr. Ahmed Mansoor',
        ownerEmail: 'doctor@almansoor-clinic.com',
        subscriptionPlan: 'ENTERPRISE_YEARLY',
        licenseKey: 'LIC-2026-CLINICOS-ENTERPRISE-891234',
        activeDevices: 3,
        maxDevices: 10,
        lastSyncAt: new Date(Date.now() - 120000).toISOString(),
        status: 'ACTIVE',
        region: 'EG-CAIRO',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-02T19:00:00.000Z'
      }
    ],
    [
      'tenant-cairo-north',
      {
        tenantId: 'tenant-cairo-north',
        clinicId: 'clinic-cairo-north',
        clinicName: 'Cairo North Pediatric Center',
        ownerName: 'Dr. Sarah Hassan',
        ownerEmail: 'sarah@caironorthpediatrics.com',
        subscriptionPlan: 'PROFESSIONAL_MONTHLY',
        licenseKey: 'LIC-2026-CLINICOS-PROFESSIONAL-445120',
        activeDevices: 2,
        maxDevices: 5,
        lastSyncAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'ACTIVE',
        region: 'EG-CAIRO',
        createdAt: '2026-02-15T00:00:00.000Z',
        updatedAt: '2026-08-02T19:00:00.000Z'
      }
    ]
  ]);

  private static subscriptionsStore: Map<string, IPlatformSubscription> = new Map([
    [
      'sub_prof_01',
      {
        subscriptionId: 'sub_prof_01',
        tenantId: 'tenant-default',
        clinicName: 'Al-Mansoor Specialist Clinic',
        plan: 'ENTERPRISE_YEARLY',
        billingCycle: 'YEARLY',
        startedAt: '2026-01-01T00:00:00.000Z',
        expiresAt: '2027-01-01T00:00:00.000Z',
        maxDevices: 10,
        maxUsers: 15,
        storageLimitMb: 102400,
        usedStorageMb: 14200,
        autoRenew: true,
        status: 'ACTIVE',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-02T19:00:00.000Z'
      }
    ]
  ]);

  private static licensesStore: Map<string, IPlatformLicense> = new Map([
    [
      'lic_99102',
      {
        licenseId: 'lic_99102',
        tenantId: 'tenant-default',
        clinicName: 'Al-Mansoor Specialist Clinic',
        licenseKey: 'LIC-2026-CLINICOS-ENTERPRISE-891234',
        status: 'ACTIVE',
        activationDate: '2026-01-01T00:00:00.000Z',
        expirationDate: '2027-01-01T00:00:00.000Z',
        deviceLimit: 10,
        activatedDevices: 3,
        lastValidatedAt: new Date().toISOString(),
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-02T19:00:00.000Z'
      }
    ]
  ]);

  private static devicesStore: Map<string, IPlatformDevice> = new Map([
    [
      'dev_pc_doctor_01',
      {
        deviceId: 'dev_pc_doctor_01',
        tenantId: 'tenant-default',
        clinicName: 'Al-Mansoor Specialist Clinic',
        deviceName: 'Dr. Mansoor PC (Room 1)',
        deviceFingerprint: 'hw_hash_a8f9001b223c4d5e',
        operatingSystem: 'WINDOWS_11_X64',
        applicationVersion: '1.0.0',
        lastHeartbeatAt: new Date().toISOString(),
        lastSyncAt: new Date(Date.now() - 120000).toISOString(),
        status: 'ACTIVE',
        createdAt: '2026-01-02T10:00:00.000Z'
      }
    ]
  ]);

  private static syncOverviewStore: Map<string, IPlatformSyncOverview> = new Map([
    [
      'tenant-default',
      {
        syncOverviewId: 'so_tenant_default',
        tenantId: 'tenant-default',
        clinicName: 'Al-Mansoor Specialist Clinic',
        activeDevices: 3,
        lastSuccessfulSync: new Date(Date.now() - 120000).toISOString(),
        pendingQueueItems: 0,
        unresolvedConflicts: 0,
        health: 'OPTIMAL',
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  private static healthServicesStore: IPlatformHealth[] = [
    {
      healthId: 'health_api_gateway',
      serviceName: 'API Gateway',
      status: 'HEALTHY',
      responseTimeMs: 42,
      uptimePercentage: 99.99,
      lastCheckedAt: new Date().toISOString()
    },
    {
      healthId: 'health_mongodb',
      serviceName: 'MongoDB Primary Cluster',
      status: 'HEALTHY',
      responseTimeMs: 12,
      uptimePercentage: 100.0,
      lastCheckedAt: new Date().toISOString()
    },
    {
      healthId: 'health_redis',
      serviceName: 'Redis Memory Cache',
      status: 'HEALTHY',
      responseTimeMs: 3,
      uptimePercentage: 100.0,
      lastCheckedAt: new Date().toISOString()
    },
    {
      healthId: 'health_workers',
      serviceName: 'Background Worker Queues',
      status: 'HEALTHY',
      responseTimeMs: 18,
      uptimePercentage: 99.95,
      lastCheckedAt: new Date().toISOString()
    }
  ];

  private static adminsStore: Map<string, IPlatformAdminUser> = new Map([
    [
      'admin_super_01',
      {
        administratorId: 'admin_super_01',
        fullName: 'Platform Owner Admin',
        email: 'owner@clinicos.enterprise',
        role: 'SUPER_ADMIN',
        mfaEnabled: true,
        status: 'ACTIVE',
        lastLoginAt: new Date().toISOString(),
        createdAt: '2026-01-01T00:00:00.000Z'
      }
    ]
  ]);

  private static notificationsStore: Map<string, IPlatformNotification> = new Map([
    [
      'pnot_10029',
      {
        notificationId: 'pnot_10029',
        priority: 'CRITICAL',
        title: 'Clinic License Renewal Reminder',
        message: 'Tenant Cairo North Pediatric Center license expires in 14 days.',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  ]);

  private static auditLogsStore: IPlatformAuditEntry[] = [
    {
      auditId: 'paudit_991823',
      administratorId: 'admin_super_01',
      adminName: 'Platform Owner Admin',
      action: 'LICENSE_ISSUED',
      entityType: 'LICENSE',
      entityId: 'lic_99102',
      ipAddress: '197.48.120.15',
      eventHash: 'a8f5f167f44f4964e6c998dee827110c2290123ab',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  private static globalConfigStore: IPlatformGlobalConfig = {
    configurationId: 'global_config_main',
    maintenanceMode: false,
    minimumDesktopVersion: '1.0.0',
    minimumSyncVersion: '1.0.0',
    platformVersion: '1.0.0',
    announcementMessage: null,
    updatedAt: new Date().toISOString()
  };

  private static featureFlagsStore: Map<string, IPlatformFeatureFlag> = new Map([
    [
      'ff_p2p_mesh_sync',
      {
        featureId: 'ff_p2p_mesh_sync',
        featureName: 'P2P_LOCAL_MESH_SYNC',
        status: 'STAGED',
        rolloutPercentage: 25,
        tenantScope: ['tenant-default'],
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  public async getStats(): Promise<IPlatformStats> {
    return {
      totalClinics: PlatformControlRepository.tenantsStore.size,
      activeClinics: Array.from(PlatformControlRepository.tenantsStore.values()).filter(t => t.status === 'ACTIVE').length,
      suspendedClinics: Array.from(PlatformControlRepository.tenantsStore.values()).filter(t => t.status === 'SUSPENDED').length,
      activeDevices: PlatformControlRepository.devicesStore.size,
      issuedLicenses: PlatformControlRepository.licensesStore.size,
      syncHealthPercentage: 99.98,
      apiLatencyMs: 42,
      monthlyRevenueUsd: 148500
    };
  }

  public async findAllTenants(): Promise<IPlatformTenant[]> {
    return Array.from(PlatformControlRepository.tenantsStore.values());
  }

  public async findTenantById(tenantId: string): Promise<IPlatformTenant | null> {
    return PlatformControlRepository.tenantsStore.get(tenantId) || null;
  }

  public async saveTenant(tenant: IPlatformTenant): Promise<IPlatformTenant> {
    PlatformControlRepository.tenantsStore.set(tenant.tenantId, tenant);
    return tenant;
  }

  public async findAllSubscriptions(): Promise<IPlatformSubscription[]> {
    return Array.from(PlatformControlRepository.subscriptionsStore.values());
  }

  public async findSubscriptionById(subscriptionId: string): Promise<IPlatformSubscription | null> {
    return PlatformControlRepository.subscriptionsStore.get(subscriptionId) || null;
  }

  public async saveSubscription(sub: IPlatformSubscription): Promise<IPlatformSubscription> {
    PlatformControlRepository.subscriptionsStore.set(sub.subscriptionId, sub);
    return sub;
  }

  public async findAllLicenses(): Promise<IPlatformLicense[]> {
    return Array.from(PlatformControlRepository.licensesStore.values());
  }

  public async findLicenseById(licenseId: string): Promise<IPlatformLicense | null> {
    return PlatformControlRepository.licensesStore.get(licenseId) || null;
  }

  public async saveLicense(license: IPlatformLicense): Promise<IPlatformLicense> {
    PlatformControlRepository.licensesStore.set(license.licenseId, license);
    return license;
  }

  public async findAllDevices(): Promise<IPlatformDevice[]> {
    return Array.from(PlatformControlRepository.devicesStore.values());
  }

  public async findDeviceById(deviceId: string): Promise<IPlatformDevice | null> {
    return PlatformControlRepository.devicesStore.get(deviceId) || null;
  }

  public async saveDevice(device: IPlatformDevice): Promise<IPlatformDevice> {
    PlatformControlRepository.devicesStore.set(device.deviceId, device);
    return device;
  }

  public async findAllSyncOverview(): Promise<IPlatformSyncOverview[]> {
    return Array.from(PlatformControlRepository.syncOverviewStore.values());
  }

  public async findAllHealthServices(): Promise<IPlatformHealth[]> {
    return PlatformControlRepository.healthServicesStore;
  }

  public async findAllAdmins(): Promise<IPlatformAdminUser[]> {
    return Array.from(PlatformControlRepository.adminsStore.values());
  }

  public async findAdminById(adminId: string): Promise<IPlatformAdminUser | null> {
    return PlatformControlRepository.adminsStore.get(adminId) || null;
  }

  public async saveAdmin(admin: IPlatformAdminUser): Promise<IPlatformAdminUser> {
    PlatformControlRepository.adminsStore.set(admin.administratorId, admin);
    return admin;
  }

  public async findAllNotifications(): Promise<IPlatformNotification[]> {
    return Array.from(PlatformControlRepository.notificationsStore.values());
  }

  public async saveNotification(notification: IPlatformNotification): Promise<IPlatformNotification> {
    PlatformControlRepository.notificationsStore.set(notification.notificationId, notification);
    return notification;
  }

  public async findAllAuditLogs(): Promise<IPlatformAuditEntry[]> {
    return PlatformControlRepository.auditLogsStore;
  }

  public async addAuditLog(entry: IPlatformAuditEntry): Promise<IPlatformAuditEntry> {
    PlatformControlRepository.auditLogsStore.unshift(entry);
    return entry;
  }

  public async getGlobalConfig(): Promise<IPlatformGlobalConfig> {
    return PlatformControlRepository.globalConfigStore;
  }

  public async saveGlobalConfig(config: IPlatformGlobalConfig): Promise<IPlatformGlobalConfig> {
    PlatformControlRepository.globalConfigStore = config;
    return config;
  }

  public async findAllFeatureFlags(): Promise<IPlatformFeatureFlag[]> {
    return Array.from(PlatformControlRepository.featureFlagsStore.values());
  }

  public async findFeatureFlagById(featureId: string): Promise<IPlatformFeatureFlag | null> {
    return PlatformControlRepository.featureFlagsStore.get(featureId) || null;
  }

  public async saveFeatureFlag(flag: IPlatformFeatureFlag): Promise<IPlatformFeatureFlag> {
    PlatformControlRepository.featureFlagsStore.set(flag.featureId, flag);
    return flag;
  }
}
