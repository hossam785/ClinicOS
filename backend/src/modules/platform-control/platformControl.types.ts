export type TenantStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'LOCKOUT';
export type SubscriptionPlan = 'COMMUNITY_FREE' | 'PROFESSIONAL_MONTHLY' | 'ENTERPRISE_YEARLY' | 'LIFETIME_RESERVED';
export type LicenseStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';
export type DeviceStatus = 'ACTIVE' | 'PENDING' | 'DEACTIVATED' | 'REVOKED';
export type SyncHealthStatus = 'OPTIMAL' | 'DEGRADED' | 'STALED' | 'CRITICAL';
export type ServiceHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';
export type PlatformRole = 'SUPER_ADMIN' | 'PLATFORM_OPERATOR' | 'AUDITOR';
export type NotificationPriority = 'CRITICAL' | 'WARNING' | 'INFO';
export type FeatureFlagStatus = 'ENABLED' | 'DISABLED' | 'STAGED';

export interface IPlatformStats {
  totalClinics: number;
  activeClinics: number;
  suspendedClinics: number;
  activeDevices: number;
  issuedLicenses: number;
  syncHealthPercentage: number;
  apiLatencyMs: number;
  monthlyRevenueUsd: number;
}

export interface IPlatformTenant {
  tenantId: string;
  clinicId: string;
  clinicName: string;
  ownerName: string;
  ownerEmail: string;
  subscriptionPlan: SubscriptionPlan;
  licenseKey: string;
  activeDevices: number;
  maxDevices: number;
  lastSyncAt: string;
  status: TenantStatus;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTenantDTO {
  clinicName: string;
  ownerName: string;
  ownerEmail: string;
  subscriptionPlan: SubscriptionPlan;
  maxDevices?: number;
  region?: string;
}

export interface IUpdateTenantDTO {
  clinicName?: string;
  ownerName?: string;
  ownerEmail?: string;
  status?: TenantStatus;
  region?: string;
}

export interface IPlatformSubscription {
  subscriptionId: string;
  tenantId: string;
  clinicName: string;
  plan: SubscriptionPlan;
  billingCycle: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  startedAt: string;
  expiresAt: string;
  maxDevices: number;
  maxUsers: number;
  storageLimitMb: number;
  usedStorageMb: number;
  autoRenew: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateSubscriptionDTO {
  plan?: SubscriptionPlan;
  maxDevices?: number;
  maxUsers?: number;
  storageLimitMb?: number;
  expiresAt?: string;
  autoRenew?: boolean;
}

export interface IPlatformLicense {
  licenseId: string;
  tenantId: string;
  clinicName: string;
  licenseKey: string;
  status: LicenseStatus;
  activationDate: string;
  expirationDate: string;
  deviceLimit: number;
  activatedDevices: number;
  lastValidatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IIssueLicenseDTO {
  tenantId: string;
  subscriptionPlan: SubscriptionPlan;
  deviceLimit?: number;
  validityDays?: number;
}

export interface IPlatformDevice {
  deviceId: string;
  tenantId: string;
  clinicName: string;
  deviceName: string;
  deviceFingerprint: string;
  operatingSystem: string;
  applicationVersion: string;
  lastHeartbeatAt: string;
  lastSyncAt: string;
  status: DeviceStatus;
  createdAt: string;
}

export interface IPlatformSyncOverview {
  syncOverviewId: string;
  tenantId: string;
  clinicName: string;
  activeDevices: number;
  lastSuccessfulSync: string;
  pendingQueueItems: number;
  unresolvedConflicts: number;
  health: SyncHealthStatus;
  updatedAt: string;
}

export interface IPlatformHealth {
  healthId: string;
  serviceName: string;
  status: ServiceHealthStatus;
  responseTimeMs: number;
  uptimePercentage: number;
  lastCheckedAt: string;
}

export interface IPlatformAdminUser {
  administratorId: string;
  fullName: string;
  email: string;
  role: PlatformRole;
  mfaEnabled: boolean;
  status: 'ACTIVE' | 'DEACTIVATED';
  lastLoginAt: string;
  createdAt: string;
}

export interface ICreateAdminUserDTO {
  fullName: string;
  email: string;
  role: PlatformRole;
  password?: string;
}

export interface IPlatformNotification {
  notificationId: string;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface IPlatformAuditEntry {
  auditId: string;
  administratorId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  eventHash: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface IPlatformGlobalConfig {
  configurationId: string;
  maintenanceMode: boolean;
  minimumDesktopVersion: string;
  minimumSyncVersion: string;
  platformVersion: string;
  announcementMessage: string | null;
  updatedAt: string;
}

export interface IUpdateGlobalConfigDTO {
  maintenanceMode?: boolean;
  minimumDesktopVersion?: string;
  minimumSyncVersion?: string;
  announcementMessage?: string | null;
}

export interface IPlatformFeatureFlag {
  featureId: string;
  featureName: string;
  status: FeatureFlagStatus;
  rolloutPercentage: number;
  tenantScope: string[];
  updatedAt: string;
}

export interface IUpdateFeatureFlagDTO {
  status?: FeatureFlagStatus;
  rolloutPercentage?: number;
  tenantScope?: string[];
}
