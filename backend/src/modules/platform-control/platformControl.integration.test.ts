import { PlatformControlService } from './platformControl.service';
import type {
  ICreateTenantDTO,
  IIssueLicenseDTO,
  ICreateAdminUserDTO,
  IUpdateSubscriptionDTO,
  IUpdateGlobalConfigDTO,
  IUpdateFeatureFlagDTO
} from './platformControl.types';

async function runIntegrationTests() {
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, _testName: string) {
    totalCount++;
    if (condition) {
      passedCount++;
    }
  }

  const service = new PlatformControlService();
  const adminId = 'admin_super_01';

  // Group 1: Global Platform Stats
  try {
    const stats = await service.getStats();
    assert(stats.totalClinics > 0 && stats.syncHealthPercentage >= 99.0, 'Group 1: Global Platform Stats Telemetry & Overview Retrieval');
  } catch (e: unknown) {
    assert(false, `Group 1: ${(e as Error).message}`);
  }

  // Group 2: Tenant Onboarding & Auto-Provisioning
  try {
    const payload: ICreateTenantDTO = {
      clinicName: 'Delta Specialist Medical Center',
      ownerName: 'Dr. Khaled Said',
      ownerEmail: 'khaled@deltamedical.com',
      subscriptionPlan: 'ENTERPRISE_YEARLY',
      maxDevices: 8,
      region: 'EG-DELTA'
    };
    const tenant = await service.createTenant(payload, adminId);
    assert(
      tenant.tenantId.includes('tenant_') &&
      tenant.licenseKey.startsWith('LIC-2026-CLINICOS-') &&
      tenant.status === 'ACTIVE',
      'Group 2: Tenant Onboarding & Auto-Provisioning (Subscription + License)'
    );
  } catch (e: unknown) {
    assert(false, `Group 2: ${(e as Error).message}`);
  }

  // Group 3: Tenant Lifecycle Mutations
  try {
    const tenants = await service.getAllTenants();
    const t1 = tenants[0];
    const t2 = tenants[1];

    const updated = await service.updateTenant(t1.tenantId, { region: 'EG-ALEX' }, adminId);
    const suspended = await service.suspendTenant(t1.tenantId, adminId);
    const lockedOut = await service.lockoutTenant(t2.tenantId, adminId);
    assert(
      updated?.region === 'EG-ALEX' &&
      suspended?.status === 'SUSPENDED' &&
      lockedOut?.status === 'LOCKOUT',
      'Group 3: Tenant Lifecycle Mutations (Update, Suspend, Lockout)'
    );
  } catch (e: unknown) {
    assert(false, `Group 3: ${(e as Error).message}`);
  }

  // Group 4: Subscription Plan Upgrades & Quotas
  try {
    const subs = await service.getAllSubscriptions();
    const sub = subs[0];
    const updateDTO: IUpdateSubscriptionDTO = {
      plan: 'ENTERPRISE_YEARLY',
      maxDevices: 20,
      storageLimitMb: 204800
    };
    const updatedSub = await service.updateSubscription(sub.subscriptionId, updateDTO, adminId);
    assert(updatedSub?.maxDevices === 20 && updatedSub?.storageLimitMb === 204800, 'Group 4: Subscription Plan Upgrades, Renewals, & Quotas Validation');
  } catch (e: unknown) {
    assert(false, `Group 4: ${(e as Error).message}`);
  }

  // Group 5: Cryptographic 256-Bit License Issuance
  try {
    const tenants = await service.getAllTenants();
    const tenantId = tenants[0].tenantId;
    const issueDTO: IIssueLicenseDTO = {
      tenantId,
      subscriptionPlan: 'ENTERPRISE_YEARLY',
      deviceLimit: 12,
      validityDays: 365
    };
    const license = await service.issueLicense(issueDTO, adminId);
    const revoked = await service.revokeLicense(license.licenseId, adminId);
    assert(
      license.licenseKey.startsWith('LIC-2026-CLINICOS-') &&
      revoked?.status === 'REVOKED',
      'Group 5: Cryptographic 256-Bit License Key Issuance & Revocation'
    );
  } catch (e: unknown) {
    assert(false, `Group 5: ${(e as Error).message}`);
  }

  // Group 6: Registered Desktop Device Telemetry & Revocation
  try {
    const devices = await service.getAllDevices();
    const dev = devices[0];
    const revokedDev = await service.revokeDevice(dev.deviceId, adminId);
    assert(dev.deviceFingerprint !== undefined && revokedDev?.status === 'REVOKED', 'Group 6: Registered Desktop Device Telemetry & Revocation');
  } catch (e: unknown) {
    assert(false, `Group 6: ${(e as Error).message}`);
  }

  // Group 7: Global Sync Gateway Telemetry Monitoring (Read-Only Privacy)
  try {
    const syncOverview = await service.getSyncOverview();
    const syncItem = syncOverview[0];
    const record = syncItem as unknown as Record<string, unknown>;
    const hasNoMedicalPayloads = record.medicalRecords === undefined && record.prescriptions === undefined;
    assert(syncItem.health === 'OPTIMAL' && hasNoMedicalPayloads, 'Group 7: Global Sync Gateway Telemetry Monitoring (Read-Only Payload Privacy)');
  } catch (e: unknown) {
    assert(false, `Group 7: ${(e as Error).message}`);
  }

  // Group 8: Infrastructure Health Diagnostics & Service Status
  try {
    const healthList = await service.getHealthServices();
    const apiGatewayHealth = healthList.find(h => h.serviceName === 'API Gateway');
    assert(apiGatewayHealth?.status === 'HEALTHY' && (apiGatewayHealth?.responseTimeMs ?? 999) < 100, 'Group 8: Infrastructure Health Diagnostics & Service Status Checks');
  } catch (e: unknown) {
    assert(false, `Group 8: ${(e as Error).message}`);
  }

  // Group 9: Platform Administrator RBAC & MFA Management
  try {
    const newAdminDTO: ICreateAdminUserDTO = {
      fullName: 'Security Auditor Admin',
      email: 'auditor@clinicos.enterprise',
      role: 'AUDITOR'
    };
    const createdAdmin = await service.createAdmin(newAdminDTO, adminId);
    assert(createdAdmin.role === 'AUDITOR' && createdAdmin.mfaEnabled === true, 'Group 9: Platform Administrator RBAC & MFA Management');
  } catch (e: unknown) {
    assert(false, `Group 9: ${(e as Error).message}`);
  }

  // Group 10: SHA-256 Audit Log Verification, Global Config, & Feature Flags
  try {
    const auditLogs = await service.getAllAuditLogs();
    const latestAudit = auditLogs[0];
    const validHash = Boolean(latestAudit.eventHash && latestAudit.eventHash.length === 64);

    const configDTO: IUpdateGlobalConfigDTO = {
      maintenanceMode: false,
      minimumDesktopVersion: '1.0.1'
    };
    const updatedConfig = await service.updateGlobalConfig(configDTO, adminId);

    const flags = await service.getAllFeatureFlags();
    const flagDTO: IUpdateFeatureFlagDTO = {
      rolloutPercentage: 50
    };
    const updatedFlag = await service.updateFeatureFlag(flags[0].featureId, flagDTO, adminId);

    assert(
      validHash &&
      updatedConfig.minimumDesktopVersion === '1.0.1' &&
      updatedFlag?.rolloutPercentage === 50,
      'Group 10: SHA-256 Audit Log Verification, Global Config, & Feature Flags'
    );
  } catch (e: unknown) {
    assert(false, `Group 10: ${(e as Error).message}`);
  }

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runIntegrationTests();
