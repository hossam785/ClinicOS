import type {
  ICreateTenantDTO,
  IUpdateTenantDTO,
  IIssueLicenseDTO,
  ICreateAdminUserDTO
} from './platformControl.types';

export class PlatformControlValidator {
  public static validateCreateTenant(payload: ICreateTenantDTO): string | null {
    if (!payload.clinicName || payload.clinicName.trim().length === 0) {
      return 'Clinic name is required';
    }
    if (!payload.ownerName || payload.ownerName.trim().length === 0) {
      return 'Owner name is required';
    }
    if (!payload.ownerEmail || !payload.ownerEmail.includes('@')) {
      return 'Valid owner email is required';
    }
    if (!payload.subscriptionPlan) {
      return 'Subscription plan is required';
    }
    return null;
  }

  public static validateUpdateTenant(payload: IUpdateTenantDTO): string | null {
    if (payload.ownerEmail && !payload.ownerEmail.includes('@')) {
      return 'Valid owner email is required';
    }
    return null;
  }

  public static validateIssueLicense(payload: IIssueLicenseDTO): string | null {
    if (!payload.tenantId || payload.tenantId.trim().length === 0) {
      return 'Tenant ID is required';
    }
    if (!payload.subscriptionPlan) {
      return 'Subscription plan is required';
    }
    return null;
  }

  public static validateCreateAdmin(payload: ICreateAdminUserDTO): string | null {
    if (!payload.fullName || payload.fullName.trim().length === 0) {
      return 'Full name is required';
    }
    if (!payload.email || !payload.email.includes('@')) {
      return 'Valid admin email is required';
    }
    if (!payload.role) {
      return 'Role is required';
    }
    return null;
  }
}
