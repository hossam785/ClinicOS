/**
 * Structured Logging client for ClinicOS.
 * Formats log messages into uniform JSON envelopes, excluding sensitive PII data.
 */

export interface LogPayload {
  message: string
  tenantId?: string
  correlationId?: string
  context?: Record<string, unknown>
}

function formatLog(level: 'INFO' | 'WARN' | 'ERROR', payload: LogPayload): string {
  const logEnvelope = {
    timestamp: new Date().toISOString(),
    level,
    tenantId: payload.tenantId || null,
    correlationId: payload.correlationId || null,
    message: payload.message,
    context: payload.context || {},
  }
  return JSON.stringify(logEnvelope)
}

export const logger = {
  info: (payload: LogPayload) => {
    console.info(formatLog('INFO', payload))
  },
  warn: (payload: LogPayload) => {
    console.warn(formatLog('WARN', payload))
  },
  error: (payload: LogPayload & { stack?: string }) => {
    const context = { ...payload.context, stack: payload.stack }
    console.error(formatLog('ERROR', { ...payload, context }))
  },
}
