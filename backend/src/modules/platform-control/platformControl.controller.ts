import type { Request, Response } from 'express';
import { PlatformControlService } from './platformControl.service';
import { PlatformControlValidator } from './platformControl.validator';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    role?: string;
  };
}

export class PlatformControlController {
  private service: PlatformControlService;

  constructor() {
    this.service = new PlatformControlService();
  }

  public getStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.service.getStats();
      res.status(200).json({ status: 'success', data: stats });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getTenants = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tenants = await this.service.getAllTenants();
      res.status(200).json({ status: 'success', data: tenants });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public createTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const validationError = PlatformControlValidator.validateCreateTenant(req.body);
      if (validationError) {
        res.status(400).json({ status: 'error', error: validationError });
        return;
      }

      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const tenant = await this.service.createTenant(req.body, adminId);
      res.status(201).json({ status: 'success', data: tenant });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public updateTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const validationError = PlatformControlValidator.validateUpdateTenant(req.body);
      if (validationError) {
        res.status(400).json({ status: 'error', error: validationError });
        return;
      }

      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const tenant = await this.service.updateTenant(req.params.tenantId, req.body, adminId);

      if (!tenant) {
        res.status(404).json({ status: 'error', error: 'Tenant not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: tenant });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public suspendTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const tenant = await this.service.suspendTenant(req.params.tenantId, adminId);

      if (!tenant) {
        res.status(404).json({ status: 'error', error: 'Tenant not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: tenant });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public lockoutTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const tenant = await this.service.lockoutTenant(req.params.tenantId, adminId);

      if (!tenant) {
        res.status(404).json({ status: 'error', error: 'Tenant not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: tenant });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getSubscriptions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const subs = await this.service.getAllSubscriptions();
      res.status(200).json({ status: 'success', data: subs });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public updateSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const sub = await this.service.updateSubscription(req.params.subscriptionId, req.body, adminId);

      if (!sub) {
        res.status(404).json({ status: 'error', error: 'Subscription not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: sub });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getLicenses = async (_req: Request, res: Response): Promise<void> => {
    try {
      const licenses = await this.service.getAllLicenses();
      res.status(200).json({ status: 'success', data: licenses });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public issueLicense = async (req: Request, res: Response): Promise<void> => {
    try {
      const validationError = PlatformControlValidator.validateIssueLicense(req.body);
      if (validationError) {
        res.status(400).json({ status: 'error', error: validationError });
        return;
      }

      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const license = await this.service.issueLicense(req.body, adminId);
      res.status(201).json({ status: 'success', data: license });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public revokeLicense = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const license = await this.service.revokeLicense(req.params.licenseId, adminId);

      if (!license) {
        res.status(404).json({ status: 'error', error: 'License not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: license });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getDevices = async (_req: Request, res: Response): Promise<void> => {
    try {
      const devices = await this.service.getAllDevices();
      res.status(200).json({ status: 'success', data: devices });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public revokeDevice = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const device = await this.service.revokeDevice(req.params.deviceId, adminId);

      if (!device) {
        res.status(404).json({ status: 'error', error: 'Device not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: device });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getSyncOverview = async (_req: Request, res: Response): Promise<void> => {
    try {
      const syncOverview = await this.service.getSyncOverview();
      res.status(200).json({ status: 'success', data: syncOverview });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getHealthServices = async (_req: Request, res: Response): Promise<void> => {
    try {
      const healthServices = await this.service.getHealthServices();
      res.status(200).json({ status: 'success', data: healthServices });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getAdmins = async (_req: Request, res: Response): Promise<void> => {
    try {
      const admins = await this.service.getAllAdmins();
      res.status(200).json({ status: 'success', data: admins });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public createAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const validationError = PlatformControlValidator.validateCreateAdmin(req.body);
      if (validationError) {
        res.status(400).json({ status: 'error', error: validationError });
        return;
      }

      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const admin = await this.service.createAdmin(req.body, adminId);
      res.status(201).json({ status: 'success', data: admin });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getNotifications = async (_req: Request, res: Response): Promise<void> => {
    try {
      const notifications = await this.service.getAllNotifications();
      res.status(200).json({ status: 'success', data: notifications });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getAuditLogs = async (_req: Request, res: Response): Promise<void> => {
    try {
      const auditLogs = await this.service.getAllAuditLogs();
      res.status(200).json({ status: 'success', data: auditLogs });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getGlobalConfig = async (_req: Request, res: Response): Promise<void> => {
    try {
      const config = await this.service.getGlobalConfig();
      res.status(200).json({ status: 'success', data: config });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public updateGlobalConfig = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const config = await this.service.updateGlobalConfig(req.body, adminId);
      res.status(200).json({ status: 'success', data: config });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public getFeatureFlags = async (_req: Request, res: Response): Promise<void> => {
    try {
      const flags = await this.service.getAllFeatureFlags();
      res.status(200).json({ status: 'success', data: flags });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };

  public updateFeatureFlag = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as AuthenticatedRequest).user?.id || 'admin_super_01';
      const flag = await this.service.updateFeatureFlag(req.params.featureId, req.body, adminId);

      if (!flag) {
        res.status(404).json({ status: 'error', error: 'Feature flag not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: flag });
    } catch (err: unknown) {
      res.status(500).json({ status: 'error', error: (err as Error).message });
    }
  };
}
