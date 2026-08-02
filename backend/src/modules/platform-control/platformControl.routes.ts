import { Router } from 'express';
import { PlatformControlController } from './platformControl.controller';

const router = Router();
const controller = new PlatformControlController();

// Overview Stats
router.get('/stats', controller.getStats);

// Tenant Management
router.get('/tenants', controller.getTenants);
router.post('/tenants', controller.createTenant);
router.patch('/tenants/:tenantId', controller.updateTenant);
router.post('/tenants/:tenantId/suspend', controller.suspendTenant);
router.post('/tenants/:tenantId/lockout', controller.lockoutTenant);

// Subscription Management
router.get('/subscriptions', controller.getSubscriptions);
router.patch('/subscriptions/:subscriptionId', controller.updateSubscription);

// License Management
router.get('/licenses', controller.getLicenses);
router.post('/licenses', controller.issueLicense);
router.post('/licenses/:licenseId/revoke', controller.revokeLicense);

// Device Registry
router.get('/devices', controller.getDevices);
router.post('/devices/:deviceId/revoke', controller.revokeDevice);

// Synchronization Telemetry
router.get('/synchronization', controller.getSyncOverview);

// Platform Health
router.get('/health', controller.getHealthServices);

// Administrator Management
router.get('/administrators', controller.getAdmins);
router.post('/administrators', controller.createAdmin);

// Notifications & Audit Logs
router.get('/notifications', controller.getNotifications);
router.get('/audit', controller.getAuditLogs);

// Global Config & Feature Flags
router.get('/configuration', controller.getGlobalConfig);
router.patch('/configuration', controller.updateGlobalConfig);
router.get('/features', controller.getFeatureFlags);
router.patch('/features/:featureId', controller.updateFeatureFlag);

export default router;
