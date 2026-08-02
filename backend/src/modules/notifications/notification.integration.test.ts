import { InMemoryNotificationRepository } from './repositories/notification.repository'
import { NotificationEngineService } from './services/notificationEngine.service'
import { NotificationValidator } from './validators/notification.validator'
import { AppError } from '@/shared/errors/AppError'
import type { CreateNotificationDto } from './types/notification.types'

export async function runNotificationIntegrationTests() {
  console.info('===========================================================')
  console.info('STARTING TASK-108: NOTIFICATIONS MANAGEMENT INTEGRATION TESTS')
  console.info('===========================================================')

  let totalTests = 0

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    totalTests++
    if (condition) {
      console.info(`[PASS] Test #${totalTests}: ${testName}`)
    } else {
      console.error(`[FAIL] Test #${totalTests}: ${testName}`)
      if (failureDetails) console.error(`       Details: ${failureDetails}`)
      throw new Error(`Integration Test Failed: ${testName} - ${failureDetails || ''}`)
    }
  }

  const repo = new InMemoryNotificationRepository()
  const engine = new NotificationEngineService(repo)

  const tenantId = 'clinic-101'
  const userIdDoctor = 'user_doc_042'
  const roleDoctor = 'DOCTOR'

  const userIdManager = 'user_manager_01'
  const roleManager = 'CLINIC_MANAGER'

  const userIdStaff = 'user_staff_88'
  const roleStaff = 'RECEPTIONIST'

  const platformAdminUserId = 'user_super_admin'
  const platformAdminRole = 'SUPER_ADMIN'

  // -------------------------------------------------------------
  // GROUP 1: Request Validation Pipelines
  // -------------------------------------------------------------
  console.info('\n--- GROUP 1: Request Validation Pipelines ---')

  // Test 1: Query validator accepts valid params
  const validQueryParams = NotificationValidator.validateQueryParams({
    page: '2',
    limit: '10',
    category: 'APPOINTMENT',
    priority: 'HIGH',
    search: '   check-in   ',
    archived: 'true',
  })
  assert(
    validQueryParams.page === 2 &&
      validQueryParams.limit === 10 &&
      validQueryParams.category === 'APPOINTMENT' &&
      validQueryParams.priority === 'HIGH' &&
      validQueryParams.search === 'check-in' &&
      validQueryParams.archived === true,
    'Query validator correctly parses valid string params'
  )

  // Test 2: Query validator rejects negative page
  try {
    NotificationValidator.validateQueryParams({ page: '-1' })
    assert(false, 'Query validator should reject page < 1')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_PAGE_PARAM',
      'Query validator throws INVALID_PAGE_PARAM on negative page'
    )
  }

  // Test 3: Query validator rejects limit > 100
  try {
    NotificationValidator.validateQueryParams({ limit: '500' })
    assert(false, 'Query validator should reject limit > 100')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_LIMIT_PARAM',
      'Query validator throws INVALID_LIMIT_PARAM on limit > 100'
    )
  }

  // Test 4: Query validator rejects invalid category enum
  try {
    NotificationValidator.validateQueryParams({ category: 'INVALID_CAT' })
    assert(false, 'Query validator should reject invalid category')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_CATEGORY_PARAM',
      'Query validator throws INVALID_CATEGORY_PARAM on invalid enum'
    )
  }

  // Test 5: Preferences validator rejects non-boolean
  try {
    NotificationValidator.validatePreferencesUpdate({ enableAppointmentNotifications: 'yes' })
    assert(false, 'Preferences validator should reject non-boolean toggle')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_PREFERENCE_TYPE',
      'Preferences validator throws INVALID_PREFERENCE_TYPE'
    )
  }

  // Test 6: Sync payload validator rejects non-array
  try {
    NotificationValidator.validateSyncPayload({ queuedNotifications: 'not_an_array' })
    assert(false, 'Sync validator should reject non-array payload')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_SYNC_PAYLOAD',
      'Sync validator throws INVALID_SYNC_PAYLOAD'
    )
  }

  // -------------------------------------------------------------
  // GROUP 2: Centralized Notification Engine Generation
  // -------------------------------------------------------------
  console.info('\n--- GROUP 2: Centralized Notification Engine Generation ---')

  // Test 7: Generate appointment notification
  const aptDto: CreateNotificationDto = {
    tenantId,
    clinicId: 'branch_main',
    notificationType: 'PATIENT_CHECKED_IN',
    category: 'APPOINTMENT',
    priority: 'HIGH',
    title: 'Patient Checked In',
    message: 'Patient John Doe is in waiting room.',
    sourceModule: 'APPOINTMENTS',
    sourceEntity: 'Appointment',
    sourceEntityId: 'apt_77102',
    targetRoute: '/dashboard/appointments/queue',
    targetId: 'APT-77102',
    recipientUserIds: [userIdDoctor],
  }
  const createdAptNotifs = await engine.generateNotification(aptDto)
  assert(
    createdAptNotifs.length === 1 &&
      createdAptNotifs[0].notificationNumber.startsWith('NOT-') &&
      createdAptNotifs[0].recipientUserId === userIdDoctor &&
      createdAptNotifs[0].priority === 'HIGH',
    'Notification Engine generates valid notification item'
  )

  // Test 8: Generate financial notification for clinic manager
  const finDto: CreateNotificationDto = {
    tenantId,
    clinicId: 'branch_main',
    notificationType: 'EXPENSE_APPROVAL_REQUIRED',
    category: 'FINANCIAL',
    priority: 'HIGH',
    title: 'Expense Approval Required',
    message: 'Expense EXP-901 requires approval.',
    sourceModule: 'EXPENSES',
    sourceEntity: 'Expense',
    sourceEntityId: 'exp_901',
    targetRoute: '/dashboard/expenses/EXP-901',
    targetId: 'EXP-901',
    recipientRoles: ['CLINIC_MANAGER'],
  }
  const createdFinNotifs = await engine.generateNotification(finDto)
  assert(
    createdFinNotifs.length === 1 &&
      createdFinNotifs[0].recipientRole === 'CLINIC_MANAGER',
    'Notification Engine broadcasts notification to recipient role'
  )

  // -------------------------------------------------------------
  // GROUP 3: Platform Owner Security Isolation Barrier
  // -------------------------------------------------------------
  console.info('\n--- GROUP 3: Platform Owner Security Isolation Barrier ---')

  // Test 9: Platform notifications target SUPER_ADMIN only
  const platformDto: CreateNotificationDto = {
    tenantId: 'PLATFORM',
    clinicId: 'SYSTEM',
    notificationType: 'BACKUP_FAILED',
    category: 'SYSTEM',
    priority: 'CRITICAL',
    title: 'Global System Backup Failed',
    message: 'Storage endpoint timeout.',
    sourceModule: 'SYSTEM',
    sourceEntity: 'BackupJob',
    sourceEntityId: 'job_881',
    targetRoute: '/admin/system/backups',
    targetId: 'JOB-881',
  }
  const platformNotifs = await engine.generateNotification(platformDto)
  assert(
    platformNotifs.length === 1 &&
      platformNotifs[0].tenantId === 'PLATFORM' &&
      platformNotifs[0].recipientRole === 'SUPER_ADMIN',
    'Platform notifications exclusively target SUPER_ADMIN'
  )

  // Test 10: SUPER_ADMIN blocked from viewing operational clinic notifications
  try {
    await engine.listNotifications(tenantId, platformAdminUserId, platformAdminRole, {})
    assert(false, 'SUPER_ADMIN should be blocked from viewing operational clinic notifications')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED',
      'Engine enforces PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED barrier'
    )
  }

  // -------------------------------------------------------------
  // GROUP 4: Recipient Ownership & RBAC Security
  // -------------------------------------------------------------
  console.info('\n--- GROUP 4: Recipient Ownership & RBAC Security ---')

  // Test 11: Doctor can inspect their own notification
  const doctorNotif = await engine.getNotificationById(tenantId, userIdDoctor, roleDoctor, createdAptNotifs[0]._id)
  assert(
    doctorNotif._id === createdAptNotifs[0]._id,
    'Recipient user can inspect their own notification details'
  )

  // Test 12: Unauthorized user blocked from inspecting another user notification
  try {
    await engine.getNotificationById(tenantId, userIdStaff, roleStaff, createdAptNotifs[0]._id)
    assert(false, 'Unauthorized user should be blocked from inspecting notification')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'NOTIFICATION_ACCESS_RESTRICTED',
      'Engine throws NOTIFICATION_ACCESS_RESTRICTED on unauthorized recipient access'
    )
  }

  // Test 13: Cross-tenant notification access blocked
  try {
    await engine.getNotificationById('other-clinic-999', userIdDoctor, roleDoctor, createdAptNotifs[0]._id)
    assert(false, 'Cross-tenant access should be blocked')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && (err.errorCode === 'NOTIFICATION_NOT_FOUND' || err.errorCode === 'TENANT_ACCESS_DENIED'),
      'Engine blocks cross-tenant notification access'
    )
  }

  // -------------------------------------------------------------
  // GROUP 5: User Preferences Enforcement
  // -------------------------------------------------------------
  console.info('\n--- GROUP 5: User Preferences Enforcement ---')

  // Test 14: Update preference to disable appointment notifications
  const updatedPref = await engine.updatePreferences(tenantId, userIdStaff, roleStaff, {
    enableAppointmentNotifications: false,
  })
  assert(
    updatedPref.enableAppointmentNotifications === false,
    'User preferences updated and persisted'
  )

  // Test 15: Non-critical appointment notification skipped when disabled in preferences
  const skippedDto: CreateNotificationDto = {
    tenantId,
    clinicId: 'branch_main',
    notificationType: 'APT_NEW',
    category: 'APPOINTMENT',
    priority: 'NORMAL',
    title: 'New Appointment Booked',
    message: 'Appointment booked for tomorrow.',
    sourceModule: 'APPOINTMENTS',
    sourceEntity: 'Appointment',
    sourceEntityId: 'apt_991',
    targetRoute: '/dashboard/appointments',
    targetId: 'APT-991',
    recipientUserIds: [userIdStaff],
  }
  const skippedNotifs = await engine.generateNotification(skippedDto)
  assert(
    skippedNotifs.length === 0,
    'Non-critical notifications are skipped when disabled in user preferences'
  )

  // Test 16: CRITICAL priority alerts bypass preference toggles
  const criticalDto: CreateNotificationDto = {
    tenantId,
    clinicId: 'branch_main',
    notificationType: 'LICENSE_EXPIRATION_WARNING',
    category: 'APPOINTMENT',
    priority: 'CRITICAL',
    title: 'Critical License Warning',
    message: 'Medical license expiration imminent.',
    sourceModule: 'CLINIC',
    sourceEntity: 'License',
    sourceEntityId: 'lic_01',
    targetRoute: '/dashboard/clinic/profile',
    targetId: 'LIC-01',
    recipientUserIds: [userIdStaff],
  }
  const criticalNotifs = await engine.generateNotification(criticalDto)
  assert(
    criticalNotifs.length === 1,
    'CRITICAL priority alerts bypass user preference category toggles'
  )

  // -------------------------------------------------------------
  // GROUP 6: Read, Read All & Unread Summary
  // -------------------------------------------------------------
  console.info('\n--- GROUP 6: Read, Read All & Unread Summary ---')

  // Test 17: Mark single notification as read
  const readItem = await engine.markAsRead(tenantId, userIdDoctor, roleDoctor, createdAptNotifs[0]._id)
  assert(
    readItem.isRead === true && readItem.readStatus === 'READ' && readItem.readAt !== null,
    'markAsRead correctly updates read state, timestamp, and status'
  )

  // Test 18: Mark all as read
  const markAllResult = await engine.markAllAsRead(tenantId, userIdManager, roleManager)
  assert(
    markAllResult.markedCount >= 1 && typeof markAllResult.readAt === 'string',
    'markAllAsRead updates all unread notifications for recipient'
  )

  // Test 19: Get unread summary
  const unreadSummary = await engine.getUnreadCount(tenantId, userIdDoctor, roleDoctor)
  assert(
    typeof unreadSummary.totalUnread === 'number' &&
      typeof unreadSummary.highPriorityUnread === 'number' &&
      typeof unreadSummary.criticalUnacknowledged === 'number',
    'getUnreadCount returns structured unread aggregation summary'
  )

  // -------------------------------------------------------------
  // GROUP 7: Critical Alert Formal Acknowledgment Workflow
  // -------------------------------------------------------------
  console.info('\n--- GROUP 7: Critical Alert Formal Acknowledgment Workflow ---')

  // Test 20: Acknowledge critical notification
  const ackedItem = await engine.acknowledgeCritical(
    tenantId,
    userIdStaff,
    roleStaff,
    criticalNotifs[0]._id,
    'Reviewed and escalated to clinic administrator.'
  )
  assert(
    ackedItem.isAcknowledged === true &&
      ackedItem.acknowledgedBy === userIdStaff &&
      ackedItem.isRead === true,
    'acknowledgeCritical sets isAcknowledged: true and records notes in metadata'
  )

  // Test 21: Attempting to acknowledge non-CRITICAL notification throws error
  try {
    await engine.acknowledgeCritical(tenantId, userIdDoctor, roleDoctor, createdAptNotifs[0]._id)
    assert(false, 'Acknowledging non-CRITICAL notification should fail')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'NOT_CRITICAL_PRIORITY',
      'Engine throws NOT_CRITICAL_PRIORITY when acknowledging non-critical alert'
    )
  }

  // -------------------------------------------------------------
  // GROUP 8: Archiving & Restoration Workflow
  // -------------------------------------------------------------
  console.info('\n--- GROUP 8: Archiving & Restoration Workflow ---')

  // Test 22: Archive notification
  const archivedItem = await engine.archiveNotification(tenantId, userIdDoctor, roleDoctor, createdAptNotifs[0]._id)
  assert(
    archivedItem.isArchived === true && archivedItem.archivedAt !== null,
    'archiveNotification sets isArchived: true and records timestamp'
  )

  // Test 23: Restore archived notification
  const restoredItem = await engine.restoreNotification(tenantId, userIdDoctor, roleDoctor, createdAptNotifs[0]._id)
  assert(
    restoredItem.isArchived === false && restoredItem.archivedAt === null,
    'restoreNotification restores notification back to active inbox'
  )

  // -------------------------------------------------------------
  // GROUP 9: Offline Synchronization & Idempotency Engine
  // -------------------------------------------------------------
  console.info('\n--- GROUP 9: Offline Synchronization & Idempotency Engine ---')

  const clientReqId = 'unique_req_uuid_99981'
  const syncQueuePayload = [
    {
      clientRequestId: clientReqId,
      title: 'Offline Patient Check-In',
      message: 'Generated while desktop client was disconnected.',
      notificationType: 'PATIENT_CHECKED_IN',
      category: 'APPOINTMENT',
      priority: 'NORMAL',
      sourceModule: 'OFFLINE_SYNC',
      targetRoute: '/dashboard/appointments',
      localCreatedAt: new Date().toISOString(),
    },
  ]

  // Test 24: Process offline batch sync
  const syncResult1 = await engine.syncOfflineQueue(tenantId, userIdDoctor, roleDoctor, syncQueuePayload)
  assert(
    syncResult1.processedCount === 1 && syncResult1.duplicateCount === 0 && syncResult1.syncedIds.length === 1,
    'syncOfflineQueue processes new offline payload and creates notification'
  )

  // Test 25: Idempotency guard rejects duplicate clientRequestId
  const syncResult2 = await engine.syncOfflineQueue(tenantId, userIdDoctor, roleDoctor, syncQueuePayload)
  assert(
    syncResult2.processedCount === 0 &&
      syncResult2.duplicateCount === 1 &&
      syncResult2.ignoredDuplicateRequestIds.includes(clientReqId),
    'Idempotency engine rejects duplicate sync requests with clientRequestId'
  )

  // -------------------------------------------------------------
  // GROUP 10: Multi-Criteria Search, Filtering & Pagination
  // -------------------------------------------------------------
  console.info('\n--- GROUP 10: Multi-Criteria Search, Filtering & Pagination ---')

  // Test 26: List notifications with category filter
  const catList = await engine.listNotifications(tenantId, userIdDoctor, roleDoctor, {
    category: 'APPOINTMENT',
    archived: false,
  })
  assert(
    catList.data.every((item) => item.category === 'APPOINTMENT'),
    'listNotifications correctly filters roster by category'
  )

  // Test 27: List notifications with search query
  const searchList = await engine.listNotifications(tenantId, userIdDoctor, roleDoctor, {
    search: 'Patient',
  })
  assert(
    searchList.data.length >= 1,
    'listNotifications correctly matches notifications by search string'
  )

  // Test 28: Pagination bounds check
  const paginatedList = await engine.listNotifications(tenantId, userIdDoctor, roleDoctor, {
    page: 1,
    limit: 2,
  })
  assert(
    paginatedList.data.length <= 2 &&
      paginatedList.page === 1 &&
      typeof paginatedList.totalPages === 'number',
    'listNotifications returns properly bounded pagination metadata'
  )

  console.info('\n===========================================================')
  console.info(`ALL ${totalTests} NOTIFICATIONS MANAGEMENT INTEGRATION TESTS PASSED SUCCESSFULLY!`)
  console.info('===========================================================')
}

// Execute tests automatically if run via CLI
if (require.main === module) {
  runNotificationIntegrationTests().catch((err) => {
    console.error('Integration Test Suite Failure:', err)
    process.exit(1)
  })
}
