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
} from '../types/platformControl.types';

export class PlatformControlApiService {
  public static async getPlatformStats(): Promise<IPlatformStats> {
    return {
      totalClinics: 1250,
      activeClinics: 1210,
      suspendedClinics: 40,
      activeDevices: 3420,
      issuedLicenses: 1250,
      syncHealthPercentage: 99.98,
      apiLatencyMs: 42,
      monthlyRevenueUsd: 148500
    };
  }

  public static async getTenants(): Promise<IPlatformTenant[]> {
    return [
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
        createdAt: '2026-01-01T00:00:00.000Z'
      },
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
        createdAt: '2026-02-15T00:00:00.000Z'
      },
      {
        tenantId: 'tenant-alex-care',
        clinicId: 'clinic-alex-care',
        clinicName: 'Alexandria Family Dental',
        ownerName: 'Dr. Omar Farooq',
        ownerEmail: 'omar@alexdental.com',
        subscriptionPlan: 'COMMUNITY_FREE',
        licenseKey: 'LIC-2026-CLINICOS-FREE-110294',
        activeDevices: 1,
        maxDevices: 2,
        lastSyncAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'SUSPENDED',
        region: 'EG-ALEX',
        createdAt: '2026-03-01T00:00:00.000Z'
      }
    ];
  }

  public static async getSubscriptions(): Promise<IPlatformSubscription[]> {
    return [
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
        status: 'ACTIVE'
      },
      {
        subscriptionId: 'sub_prof_02',
        tenantId: 'tenant-cairo-north',
        clinicName: 'Cairo North Pediatric Center',
        plan: 'PROFESSIONAL_MONTHLY',
        billingCycle: 'MONTHLY',
        startedAt: '2026-02-15T00:00:00.000Z',
        expiresAt: '2026-08-15T00:00:00.000Z',
        maxDevices: 5,
        maxUsers: 5,
        storageLimitMb: 51200,
        usedStorageMb: 8900,
        autoRenew: true,
        status: 'ACTIVE'
      }
    ];
  }

  public static async getLicenses(): Promise<IPlatformLicense[]> {
    return [
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
        lastValidatedAt: new Date().toISOString()
      },
      {
        licenseId: 'lic_44512',
        tenantId: 'tenant-cairo-north',
        clinicName: 'Cairo North Pediatric Center',
        licenseKey: 'LIC-2026-CLINICOS-PROFESSIONAL-445120',
        status: 'ACTIVE',
        activationDate: '2026-02-15T00:00:00.000Z',
        expirationDate: '2026-08-15T00:00:00.000Z',
        deviceLimit: 5,
        activatedDevices: 2,
        lastValidatedAt: new Date().toISOString()
      }
    ];
  }

  public static async getDevices(): Promise<IPlatformDevice[]> {
    return [
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
        status: 'ACTIVE'
      },
      {
        deviceId: 'dev_pc_reception_01',
        tenantId: 'tenant-default',
        clinicName: 'Al-Mansoor Specialist Clinic',
        deviceName: 'Reception Desk PC',
        deviceFingerprint: 'hw_hash_b90123cc4d5e6f7a',
        operatingSystem: 'WINDOWS_10_X64',
        applicationVersion: '1.0.0',
        lastHeartbeatAt: new Date(Date.now() - 300000).toISOString(),
        lastSyncAt: new Date(Date.now() - 600000).toISOString(),
        status: 'ACTIVE'
      }
    ];
  }

  public static async getSyncOverview(): Promise<IPlatformSyncOverview[]> {
    return [
      {
        tenantId: 'tenant-default',
        clinicName: 'Al-Mansoor Specialist Clinic',
        activeDevices: 3,
        lastSuccessfulSync: new Date(Date.now() - 120000).toISOString(),
        pendingQueueItems: 0,
        unresolvedConflicts: 0,
        health: 'OPTIMAL'
      },
      {
        tenantId: 'tenant-cairo-north',
        clinicName: 'Cairo North Pediatric Center',
        activeDevices: 2,
        lastSuccessfulSync: new Date(Date.now() - 3600000).toISOString(),
        pendingQueueItems: 2,
        unresolvedConflicts: 0,
        health: 'OPTIMAL'
      }
    ];
  }

  public static async getHealth(): Promise<IPlatformHealth[]> {
    return [
      {
        serviceName: 'API Gateway',
        status: 'HEALTHY',
        responseTimeMs: 42,
        uptimePercentage: 99.99,
        lastCheckedAt: new Date().toISOString()
      },
      {
        serviceName: 'MongoDB Primary Cluster',
        status: 'HEALTHY',
        responseTimeMs: 12,
        uptimePercentage: 100.0,
        lastCheckedAt: new Date().toISOString()
      },
      {
        serviceName: 'Redis Memory Cache',
        status: 'HEALTHY',
        responseTimeMs: 3,
        uptimePercentage: 100.0,
        lastCheckedAt: new Date().toISOString()
      },
      {
        serviceName: 'Background Worker Queues',
        status: 'HEALTHY',
        responseTimeMs: 18,
        uptimePercentage: 99.95,
        lastCheckedAt: new Date().toISOString()
      }
    ];
  }

  public static async getAdmins(): Promise<IPlatformAdminUser[]> {
    return [
      {
        administratorId: 'admin_super_01',
        fullName: 'Platform Owner Admin',
        email: 'owner@clinicos.enterprise',
        role: 'SUPER_ADMIN',
        mfaEnabled: true,
        status: 'ACTIVE',
        lastLoginAt: new Date().toISOString()
      },
      {
        administratorId: 'admin_operator_02',
        fullName: 'Support Operations Specialist',
        email: 'support@clinicos.enterprise',
        role: 'PLATFORM_OPERATOR',
        mfaEnabled: true,
        status: 'ACTIVE',
        lastLoginAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  public static async getNotifications(): Promise<IPlatformNotification[]> {
    return [
      {
        notificationId: 'pnot_10029',
        priority: 'CRITICAL',
        title: 'Clinic License Renewal Reminder',
        message: 'Tenant Cairo North Pediatric Center license expires in 14 days.',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        notificationId: 'pnot_10030',
        priority: 'INFO',
        title: 'New Desktop Application Build Registered',
        message: 'Version 1.0.1 desktop artifact registered in sync gateway.',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  public static async getAuditLogs(): Promise<IPlatformAuditEntry[]> {
    return [
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
      },
      {
        auditId: 'paudit_991824',
        administratorId: 'admin_super_01',
        adminName: 'Platform Owner Admin',
        action: 'TENANT_ONBOARDED',
        entityType: 'TENANT',
        entityId: 'tenant-cairo-north',
        ipAddress: '197.48.120.15',
        eventHash: 'b90123cc4d5e6f7a8f9001b223c4d5e67890abc',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  public static async getGlobalConfig(): Promise<IPlatformGlobalConfig> {
    return {
      maintenanceMode: false,
      minimumDesktopVersion: '1.0.0',
      minimumSyncVersion: '1.0.0',
      platformVersion: '1.0.0',
      announcementMessage: null
    };
  }

  public static async getFeatureFlags(): Promise<IPlatformFeatureFlag[]> {
    return [
      {
        featureId: 'ff_p2p_mesh_sync',
        featureName: 'P2P_LOCAL_MESH_SYNC',
        status: 'STAGED',
        rolloutPercentage: 25,
        tenantScope: ['tenant-default']
      },
      {
        featureId: 'ff_ai_medical_assistant_v2',
        featureName: 'OFFLINE_AI_MEDICAL_ASSISTANT_V2',
        status: 'ENABLED',
        rolloutPercentage: 100,
        tenantScope: []
      }
    ];
  }
}
