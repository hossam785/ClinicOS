import crypto from 'crypto';
import { PlatformControlRepository } from './platformControl.repository';
import type {
  IPlatformStats,
  IPlatformTenant,
  ICreateTenantDTO,
  IUpdateTenantDTO,
  IPlatformSubscription,
  IUpdateSubscriptionDTO,
  IPlatformLicense,
  IIssueLicenseDTO,
  IPlatformDevice,
  IPlatformSyncOverview,
  IPlatformHealth,
  IPlatformAdminUser,
  ICreateAdminUserDTO,
  IPlatformNotification,
  IPlatformAuditEntry,
  IPlatformGlobalConfig,
  IUpdateGlobalConfigDTO,
  IPlatformFeatureFlag,
  IUpdateFeatureFlagDTO
} from './platformControl.types';

export class PlatformControlService {
  private repository: PlatformControlRepository;

  constructor() {
    this.repository = new PlatformControlRepository();
  }

  private generateEventHash(action: string, entityId: string, timestamp: string): string {
    return crypto
      .createHash('sha256')
      .update(`${action}:${entityId}:${timestamp}:CLINICOS_SECRET_SALT`)
      .digest('hex');
  }

  private async recordAuditLog(
    adminId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>
  ): Promise<IPlatformAuditEntry> {
    const timestamp = new Date().toISOString();
    const eventHash = this.generateEventHash(action, entityId, timestamp);

    const entry: IPlatformAuditEntry = {
      auditId: `paudit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      administratorId: adminId,
      adminName: 'Platform Administrator',
      action,
      entityType,
      entityId,
      ipAddress: '127.0.0.1',
      eventHash,
      timestamp,
      metadata
    };

    return this.repository.addAuditLog(entry);
  }

  public async getStats(): Promise<IPlatformStats> {
    return this.repository.getStats();
  }

  public async getAllTenants(): Promise<IPlatformTenant[]> {
    return this.repository.findAllTenants();
  }

  public async getTenantById(tenantId: string): Promise<IPlatformTenant | null> {
    return this.repository.findTenantById(tenantId);
  }

  public async createTenant(payload: ICreateTenantDTO, adminId: string): Promise<IPlatformTenant> {
    const timestamp = new Date().toISOString();
    const idSuffix = Math.floor(Math.random() * 9000 + 1000).toString();
    const tenantId = `tenant_${idSuffix}`;
    const clinicId = `clinic_${idSuffix}`;
    const licenseKey = `LIC-2026-CLINICOS-${payload.subscriptionPlan}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const tenant: IPlatformTenant = {
      tenantId,
      clinicId,
      clinicName: payload.clinicName,
      ownerName: payload.ownerName,
      ownerEmail: payload.ownerEmail,
      subscriptionPlan: payload.subscriptionPlan,
      licenseKey,
      activeDevices: 0,
      maxDevices: payload.maxDevices || 5,
      lastSyncAt: timestamp,
      status: 'ACTIVE',
      region: payload.region || 'EG-CAIRO',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await this.repository.saveTenant(tenant);

    // Auto-provision Subscription
    const subscription: IPlatformSubscription = {
      subscriptionId: `sub_${idSuffix}`,
      tenantId,
      clinicName: payload.clinicName,
      plan: payload.subscriptionPlan,
      billingCycle: 'YEARLY',
      startedAt: timestamp,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      maxDevices: payload.maxDevices || 5,
      maxUsers: 10,
      storageLimitMb: 51200,
      usedStorageMb: 0,
      autoRenew: true,
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    await this.repository.saveSubscription(subscription);

    // Auto-provision License
    const license: IPlatformLicense = {
      licenseId: `lic_${idSuffix}`,
      tenantId,
      clinicName: payload.clinicName,
      licenseKey,
      status: 'ACTIVE',
      activationDate: timestamp,
      expirationDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      deviceLimit: payload.maxDevices || 5,
      activatedDevices: 0,
      lastValidatedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    await this.repository.saveLicense(license);

    await this.recordAuditLog(adminId, 'TENANT_ONBOARDED', 'TENANT', tenantId, { clinicName: payload.clinicName });

    return tenant;
  }

  public async updateTenant(tenantId: string, payload: IUpdateTenantDTO, adminId: string): Promise<IPlatformTenant | null> {
    const tenant = await this.repository.findTenantById(tenantId);
    if (!tenant) return null;

    if (payload.clinicName) tenant.clinicName = payload.clinicName;
    if (payload.ownerName) tenant.ownerName = payload.ownerName;
    if (payload.ownerEmail) tenant.ownerEmail = payload.ownerEmail;
    if (payload.status) tenant.status = payload.status;
    if (payload.region) tenant.region = payload.region;
    tenant.updatedAt = new Date().toISOString();

    await this.repository.saveTenant(tenant);
    await this.recordAuditLog(adminId, 'TENANT_UPDATED', 'TENANT', tenantId, payload as Record<string, unknown>);

    return tenant;
  }

  public async suspendTenant(tenantId: string, adminId: string): Promise<IPlatformTenant | null> {
    return this.updateTenant(tenantId, { status: 'SUSPENDED' }, adminId);
  }

  public async lockoutTenant(tenantId: string, adminId: string): Promise<IPlatformTenant | null> {
    return this.updateTenant(tenantId, { status: 'LOCKOUT' }, adminId);
  }

  public async getAllSubscriptions(): Promise<IPlatformSubscription[]> {
    return this.repository.findAllSubscriptions();
  }

  public async updateSubscription(
    subscriptionId: string,
    payload: IUpdateSubscriptionDTO,
    adminId: string
  ): Promise<IPlatformSubscription | null> {
    const sub = await this.repository.findSubscriptionById(subscriptionId);
    if (!sub) return null;

    if (payload.plan) sub.plan = payload.plan;
    if (payload.maxDevices) sub.maxDevices = payload.maxDevices;
    if (payload.maxUsers) sub.maxUsers = payload.maxUsers;
    if (payload.storageLimitMb) sub.storageLimitMb = payload.storageLimitMb;
    if (payload.expiresAt) sub.expiresAt = payload.expiresAt;
    if (payload.autoRenew !== undefined) sub.autoRenew = payload.autoRenew;
    sub.updatedAt = new Date().toISOString();

    await this.repository.saveSubscription(sub);
    await this.recordAuditLog(adminId, 'SUBSCRIPTION_UPDATED', 'SUBSCRIPTION', subscriptionId);

    return sub;
  }

  public async getAllLicenses(): Promise<IPlatformLicense[]> {
    return this.repository.findAllLicenses();
  }

  public async issueLicense(payload: IIssueLicenseDTO, adminId: string): Promise<IPlatformLicense> {
    const tenant = await this.repository.findTenantById(payload.tenantId);
    const clinicName = tenant ? tenant.clinicName : 'Clinic Tenant';
    const timestamp = new Date().toISOString();
    const licenseId = `lic_${Date.now()}`;
    const licenseKey = `LIC-2026-CLINICOS-${payload.subscriptionPlan}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const validityDays = payload.validityDays || 365;

    const license: IPlatformLicense = {
      licenseId,
      tenantId: payload.tenantId,
      clinicName,
      licenseKey,
      status: 'ACTIVE',
      activationDate: timestamp,
      expirationDate: new Date(Date.now() + validityDays * 86400000).toISOString(),
      deviceLimit: payload.deviceLimit || 5,
      activatedDevices: 0,
      lastValidatedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await this.repository.saveLicense(license);
    await this.recordAuditLog(adminId, 'LICENSE_ISSUED', 'LICENSE', licenseId, { licenseKey });

    return license;
  }

  public async revokeLicense(licenseId: string, adminId: string): Promise<IPlatformLicense | null> {
    const license = await this.repository.findLicenseById(licenseId);
    if (!license) return null;

    license.status = 'REVOKED';
    license.updatedAt = new Date().toISOString();

    await this.repository.saveLicense(license);
    await this.recordAuditLog(adminId, 'LICENSE_REVOKED', 'LICENSE', licenseId);

    return license;
  }

  public async getAllDevices(): Promise<IPlatformDevice[]> {
    return this.repository.findAllDevices();
  }

  public async revokeDevice(deviceId: string, adminId: string): Promise<IPlatformDevice | null> {
    const device = await this.repository.findDeviceById(deviceId);
    if (!device) return null;

    device.status = 'REVOKED';
    await this.repository.saveDevice(device);
    await this.recordAuditLog(adminId, 'DEVICE_REVOKED', 'DEVICE', deviceId);

    return device;
  }

  public async getSyncOverview(): Promise<IPlatformSyncOverview[]> {
    return this.repository.findAllSyncOverview();
  }

  public async getHealthServices(): Promise<IPlatformHealth[]> {
    return this.repository.findAllHealthServices();
  }

  public async getAllAdmins(): Promise<IPlatformAdminUser[]> {
    return this.repository.findAllAdmins();
  }

  public async createAdmin(payload: ICreateAdminUserDTO, creatorAdminId: string): Promise<IPlatformAdminUser> {
    const timestamp = new Date().toISOString();
    const adminId = `admin_${Date.now()}`;

    const adminUser: IPlatformAdminUser = {
      administratorId: adminId,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      mfaEnabled: true,
      status: 'ACTIVE',
      lastLoginAt: timestamp,
      createdAt: timestamp
    };

    await this.repository.saveAdmin(adminUser);
    await this.recordAuditLog(creatorAdminId, 'ADMIN_USER_CREATED', 'ADMIN', adminId, { email: payload.email });

    return adminUser;
  }

  public async getAllNotifications(): Promise<IPlatformNotification[]> {
    return this.repository.findAllNotifications();
  }

  public async getAllAuditLogs(): Promise<IPlatformAuditEntry[]> {
    return this.repository.findAllAuditLogs();
  }

  public async getGlobalConfig(): Promise<IPlatformGlobalConfig> {
    return this.repository.getGlobalConfig();
  }

  public async updateGlobalConfig(
    payload: IUpdateGlobalConfigDTO,
    adminId: string
  ): Promise<IPlatformGlobalConfig> {
    const config = await this.repository.getGlobalConfig();

    if (payload.maintenanceMode !== undefined) config.maintenanceMode = payload.maintenanceMode;
    if (payload.minimumDesktopVersion) config.minimumDesktopVersion = payload.minimumDesktopVersion;
    if (payload.minimumSyncVersion) config.minimumSyncVersion = payload.minimumSyncVersion;
    if (payload.announcementMessage !== undefined) config.announcementMessage = payload.announcementMessage;
    config.updatedAt = new Date().toISOString();

    await this.repository.saveGlobalConfig(config);
    await this.recordAuditLog(adminId, 'GLOBAL_CONFIG_MUTATED', 'CONFIG', config.configurationId, payload as Record<string, unknown>);

    return config;
  }

  public async getAllFeatureFlags(): Promise<IPlatformFeatureFlag[]> {
    return this.repository.findAllFeatureFlags();
  }

  public async updateFeatureFlag(
    featureId: string,
    payload: IUpdateFeatureFlagDTO,
    adminId: string
  ): Promise<IPlatformFeatureFlag | null> {
    const flag = await this.repository.findFeatureFlagById(featureId);
    if (!flag) return null;

    if (payload.status) flag.status = payload.status;
    if (payload.rolloutPercentage !== undefined) flag.rolloutPercentage = payload.rolloutPercentage;
    if (payload.tenantScope) flag.tenantScope = payload.tenantScope;
    flag.updatedAt = new Date().toISOString();

    await this.repository.saveFeatureFlag(flag);
    await this.recordAuditLog(adminId, 'FEATURE_FLAG_MUTATED', 'FEATURE_FLAG', featureId, payload as Record<string, unknown>);

    return flag;
  }
}
