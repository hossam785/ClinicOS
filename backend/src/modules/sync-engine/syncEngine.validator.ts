// Desktop Offline Synchronization Engine Validator — Module-018

import { AppError } from '@/shared/errors/AppError'
import type { IRegisterDevicePayload, IIncrementalDeltaPayload, IResolveConflictPayload } from './syncEngine.types'

export class SyncEngineValidator {
  static validateRegisterDevice(payload: IRegisterDevicePayload): void {
    if (!payload || typeof payload !== 'object') {
      throw new AppError('Payload is required.', 400, 'INVALID_SYNC_PAYLOAD')
    }
    if (!payload.licenseKey || typeof payload.licenseKey !== 'string') {
      throw new AppError('License key is required.', 400, 'INVALID_LICENSE_KEY')
    }
    if (!payload.deviceName || typeof payload.deviceName !== 'string') {
      throw new AppError('Device name is required.', 400, 'INVALID_DEVICE_NAME')
    }
    if (!payload.deviceFingerprint || typeof payload.deviceFingerprint !== 'string') {
      throw new AppError('Device fingerprint is required.', 400, 'INVALID_DEVICE_FINGERPRINT')
    }
  }

  static validateHeartbeat(deviceId: string, currentLocalVersion: number): void {
    if (!deviceId || typeof deviceId !== 'string') {
      throw new AppError('Device ID is required.', 400, 'INVALID_DEVICE_ID')
    }
    if (typeof currentLocalVersion !== 'number' || currentLocalVersion < 0) {
      throw new AppError('Invalid local sequence version.', 400, 'INVALID_SYNC_VERSION')
    }
  }

  static validateIncrementalDelta(payload: IIncrementalDeltaPayload): void {
    if (!payload || typeof payload !== 'object') {
      throw new AppError('Delta payload is required.', 400, 'INVALID_SYNC_PAYLOAD')
    }
    if (!payload.deviceId || typeof payload.deviceId !== 'string') {
      throw new AppError('Device ID is required.', 400, 'INVALID_DEVICE_ID')
    }
    if (!Array.isArray(payload.outgoingMutations)) {
      throw new AppError('Outgoing mutations must be an array.', 400, 'INVALID_MUTATIONS_ARRAY')
    }
  }

  static validateResolveConflict(payload: IResolveConflictPayload): void {
    if (!payload || typeof payload !== 'object') {
      throw new AppError('Conflict resolution payload is required.', 400, 'INVALID_PAYLOAD')
    }
    if (!['KEEP_LOCAL', 'USE_REMOTE', 'MANUAL_MERGE'].includes(payload.resolutionChoice)) {
      throw new AppError('Invalid resolution choice.', 400, 'INVALID_RESOLUTION_CHOICE')
    }
  }
}
