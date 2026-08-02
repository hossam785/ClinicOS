// Offline AI Medical Assistant Payload Validator — Module-017

import { AppError } from '@/shared/errors/AppError'
import type { IAIQueryRequest } from './aiAssistant.types'

export class AIAssistantValidator {
  static validateQueryPayload(payload: IAIQueryRequest): void {
    if (!payload.queryText || typeof payload.queryText !== 'string' || !payload.queryText.trim()) {
      throw new AppError('Query text cannot be empty.', 400, 'AI_QUERY_EMPTY')
    }

    if (payload.queryText.length > 2000) {
      throw new AppError('Query text exceeds maximum allowed length of 2,000 characters.', 400, 'AI_QUERY_TOO_LONG')
    }

    if (payload.sessionId && (typeof payload.sessionId !== 'string' || payload.sessionId.length > 100)) {
      throw new AppError('Invalid session identifier format.', 400, 'AI_INVALID_SESSION_ID')
    }
  }

  static validateUserRole(userRole: string): void {
    if (userRole === 'SUPER_ADMIN' || userRole === 'PLATFORM') {
      throw new AppError(
        'Platform administrators are restricted from launching AI sessions or accessing patient records.',
        403,
        'PLATFORM_ADMIN_RESTRICTED'
      )
    }
  }
}
