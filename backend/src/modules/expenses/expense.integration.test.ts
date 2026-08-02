import { InMemoryExpenseRepository } from './repositories/expense.repository'
import { ExpenseService, UserContext } from './services/expense.service'
import { ExpenseValidator } from './validators/expense.validator'
import type { CreateExpenseDto, PaymentMethod } from './types/expense.types'
import { AppError } from '@/shared/errors/AppError'

async function runExpenseIntegrationTests() {
  console.info('===========================================================')
  console.info('STARTING TASK-090: EXPENSES MANAGEMENT INTEGRATION TESTS')
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

  const repo = new InMemoryExpenseRepository()
  const service = new ExpenseService(repo)

  const tenantId = 'clinic-101'
  const managerContext: UserContext = {
    userId: 'usr-manager-1',
    role: 'CLINIC_MANAGER',
    tenantId,
    clinicId: 'branch_main',
  }
  const receptionistContext: UserContext = {
    userId: 'usr-receptionist-1',
    role: 'RECEPTIONIST',
    tenantId,
    clinicId: 'branch_main',
  }
  const platformAdminContext: UserContext = {
    userId: 'usr-admin-99',
    role: 'PLATFORM_ADMIN',
    tenantId: 'system-tenant',
  }

  // -------------------------------------------------------------
  // GROUP 1: Pre-database Validation (Validator Unit Contracts)
  // -------------------------------------------------------------

  // TEST 1: Rejects zero or negative amount
  {
    let errorCaught = false
    try {
      ExpenseValidator.validateCreateExpense({
        categoryId: 'cat-medsup-01',
        title: 'Invalid Amount Expense',
        amount: -50,
        currency: 'USD',
        expenseDate: '2026-07-30',
        paymentMethod: 'CASH',
      })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'INVALID_AMOUNT') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Validator rejects negative amount with INVALID_AMOUNT')
  }

  // TEST 2: Rejects invalid currency format
  {
    let errorCaught = false
    try {
      ExpenseValidator.validateCreateExpense({
        categoryId: 'cat-medsup-01',
        title: 'Invalid Currency Expense',
        amount: 100,
        currency: 'USDOLLARS',
        expenseDate: '2026-07-30',
        paymentMethod: 'CASH',
      })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'INVALID_CURRENCY') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Validator rejects non-3-letter currency with INVALID_CURRENCY')
  }

  // TEST 3: Rejects invalid payment method
  {
    let errorCaught = false
    try {
      ExpenseValidator.validateCreateExpense({
        categoryId: 'cat-medsup-01',
        title: 'Invalid Payment Method',
        amount: 100,
        currency: 'USD',
        expenseDate: '2026-07-30',
        paymentMethod: 'GOLD_BARS' as unknown as PaymentMethod,
      })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'INVALID_PAYMENT_METHOD') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Validator rejects unsupported payment method with INVALID_PAYMENT_METHOD')
  }

  // TEST 4: Rejects empty rejection reason
  {
    let errorCaught = false
    try {
      ExpenseValidator.validateRejectExpense({ reason: '   ' })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'MISSING_REJECTION_REASON') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Validator rejects whitespace-only rejection reason')
  }

  // TEST 5: Rejects empty archive reason
  {
    let errorCaught = false
    try {
      ExpenseValidator.validateArchiveExpense({ reason: '' })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'MISSING_ARCHIVE_REASON') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Validator rejects empty archival reason')
  }

  // -------------------------------------------------------------
  // GROUP 2: Security & Multi-Tenant Boundaries
  // -------------------------------------------------------------

  // TEST 6: Platform Owner Financial Privacy Barrier (PLATFORM_ADMIN_FINANCIAL_RESTRICTED)
  {
    let errorCaught = false
    try {
      await service.listExpenses(platformAdminContext, {})
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'PLATFORM_ADMIN_FINANCIAL_RESTRICTED') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Platform Owner receives 403 PLATFORM_ADMIN_FINANCIAL_RESTRICTED on listExpenses')
  }

  // TEST 7: Platform Owner barred from expense creation
  {
    let errorCaught = false
    try {
      await service.createExpense(platformAdminContext, {
        clinicId: 'branch_main',
        categoryId: 'cat-medsup-01',
        title: 'Platform Admin Attempt',
        amount: 500,
        currency: 'USD',
        expenseDate: '2026-07-30',
        paymentMethod: 'CASH',
      })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'PLATFORM_ADMIN_FINANCIAL_RESTRICTED') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Platform Owner receives 403 PLATFORM_ADMIN_FINANCIAL_RESTRICTED on createExpense')
  }

  // TEST 8: Multi-Tenant Workspace Isolation - Cross-Tenant Access
  {
    const otherTenantContext: UserContext = {
      userId: 'usr-other-1',
      role: 'CLINIC_MANAGER',
      tenantId: 'clinic-999',
    }
    let errorCaught = false
    try {
      await service.getExpenseById(otherTenantContext, 'exp-101') // exp-101 belongs to clinic-101
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'EXPENSE_NOT_FOUND') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Cross-tenant expense access returns 404 EXPENSE_NOT_FOUND')
  }

  // -------------------------------------------------------------
  // GROUP 3: Expense CRUD & Workflow State Machine Transitions
  // -------------------------------------------------------------

  let createdExpId = ''

  // TEST 9: Create Expense in DRAFT Status
  {
    const payload: CreateExpenseDto = {
      clinicId: 'branch_main',
      categoryId: 'cat-medsup-01',
      title: 'Lab Syringes Order',
      description: '100 boxes of sterile disposable 5ml syringes',
      amount: 450.0,
      currency: 'USD',
      expenseDate: '2026-07-30',
      paymentMethod: 'BANK_TRANSFER',
      vendorName: 'Apex Medical Distributors Ltd.',
      submitForApproval: false,
    }
    const result = await service.createExpense(receptionistContext, payload)
    createdExpId = result._id
    assert(result.status === 'DRAFT', 'Newly created expense defaults to DRAFT status')
    assert(result.expenseNumber.startsWith('EXP-'), 'Generates EXP- prefix code')
    assert(result.amount === 450.0, 'Persists correct expense amount')
  }

  // TEST 10: Get Expense Details By ID
  {
    const fetched = await service.getExpenseById(receptionistContext, createdExpId)
    assert(fetched._id === createdExpId, 'Fetches created expense by ID')
    assert(fetched.categoryName === 'Medical & Pharmaceutical Supplies', 'Includes denormalized categoryName')
  }

  // TEST 11: Update Draft Expense
  {
    const updated = await service.updateExpense(receptionistContext, createdExpId, {
      title: 'Lab Syringes Order - Corrected Quantities',
      amount: 480.0,
    })
    assert(updated.amount === 480.0, 'Updates expense amount in DRAFT state')
    assert(updated.title === 'Lab Syringes Order - Corrected Quantities', 'Updates title')
    assert(updated.version === 2, 'Increments document version counter')
  }

  // TEST 12: Submit Expense for Approval (DRAFT -> PENDING_APPROVAL)
  {
    const submitted = await service.submitExpense(receptionistContext, createdExpId)
    assert(submitted.status === 'PENDING_APPROVAL', 'Transitions status to PENDING_APPROVAL')
    assert(Boolean(submitted.auditInfo.submittedAt), 'Records submittedAt timestamp in auditInfo')
  }

  // TEST 13: Illegal Transition Check (Cannot submit already PENDING_APPROVAL expense)
  {
    let errorCaught = false
    try {
      await service.submitExpense(receptionistContext, createdExpId)
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'INVALID_STATUS_TRANSITION') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Rejects re-submitting an expense already in PENDING_APPROVAL state')
  }

  // TEST 14: Non-Manager Approval Block (Receptionist cannot approve)
  {
    let errorCaught = false
    try {
      await service.approveExpense(receptionistContext, createdExpId)
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'INSUFFICIENT_PERMISSIONS') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Rejects receptionist approval with 403 INSUFFICIENT_PERMISSIONS')
  }

  // TEST 15: Manager Rejects Expense (PENDING_APPROVAL -> REJECTED)
  {
    const rejected = await service.rejectExpense(managerContext, createdExpId, {
      reason: 'Incorrect vendor tax ID specified',
    })
    assert(rejected.status === 'REJECTED', 'Transitions status to REJECTED')
    assert(rejected.auditInfo.rejectedBy === managerContext.userId, 'Logs rejectedBy manager ID')
    assert(rejected.auditInfo.rejectionReason === 'Incorrect vendor tax ID specified', 'Logs rejection reason')
  }

  // TEST 16: Re-open Rejected Expense back to DRAFT via Submit
  {
    // Update rejected expense first
    await service.updateExpense(receptionistContext, createdExpId, { vendorTaxId: 'TAX-998201-US' })
    const resubmitted = await service.submitExpense(receptionistContext, createdExpId)
    assert(resubmitted.status === 'PENDING_APPROVAL', 'Re-submits corrected rejected expense to PENDING_APPROVAL')
  }

  // TEST 17: Manager Approves Expense (PENDING_APPROVAL -> APPROVED)
  {
    const approved = await service.approveExpense(managerContext, createdExpId)
    assert(approved.status === 'APPROVED', 'Transitions status to APPROVED')
    assert(approved.auditInfo.approvedBy === managerContext.userId, 'Logs approvedBy manager ID')
    assert(Boolean(approved.auditInfo.approvedAt), 'Logs approvedAt timestamp')
  }

  // TEST 18: Attempt edit on APPROVED expense rejected
  {
    let errorCaught = false
    try {
      await service.updateExpense(receptionistContext, createdExpId, { amount: 500 })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'EXPENSE_LOCKED') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Rejects editing an APPROVED expense with 409 EXPENSE_LOCKED')
  }

  // TEST 19: Execute Payment Disbursement (APPROVED -> PAID)
  {
    const paid = await service.payExpense(managerContext, createdExpId, {
      paymentDate: '2026-07-30',
      paymentMethod: 'BANK_TRANSFER',
    })
    assert(paid.status === 'PAID', 'Transitions status to PAID')
    assert(paid.paymentDate === '2026-07-30', 'Records payment date')
    assert(paid.auditInfo.paidBy === managerContext.userId, 'Logs paidBy manager ID')
  }

  // TEST 20: Immutability Lock on PAID Expense (EXPENSE_LOCKED)
  {
    let errorCaught = false
    try {
      await service.updateExpense(receptionistContext, createdExpId, { title: 'Illegal Edit' })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'EXPENSE_LOCKED') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Rejects editing a PAID expense with 409 EXPENSE_LOCKED')
  }

  // TEST 21: Archive Soft-Delete Expense (PAID -> ARCHIVED)
  {
    const archived = await service.archiveExpense(managerContext, createdExpId, {
      reason: 'Duplicate entry entered in error',
    })
    assert(archived.archived === true, 'Sets archived flag to true')
    assert(archived.status === 'ARCHIVED', 'Sets status to ARCHIVED')
    assert(archived.auditInfo.archivedReason === 'Duplicate entry entered in error', 'Logs archival reason')
  }

  // TEST 22: Restore Soft-Deleted Expense (ARCHIVED -> APPROVED/DRAFT)
  {
    const restored = await service.restoreExpense(managerContext, createdExpId)
    assert(restored.archived === false, 'Resets archived flag to false')
    assert(restored.status === 'APPROVED', 'Restores status to APPROVED (since approvedBy existed)')
  }

  // -------------------------------------------------------------
  // GROUP 4: Category Management & Protection Rules
  // -------------------------------------------------------------

  // TEST 23: List Expense Categories
  {
    const categories = await service.getCategories(receptionistContext)
    assert(categories.length >= 5, 'Fetches active tenant expense categories (at least 5 seeded)')
  }

  // TEST 24: Create Custom Category
  let newCatId = ''
  {
    const newCat = await service.createCategory(managerContext, {
      categoryName: 'Laboratory Consumables',
      categoryCode: 'CAT-LABCONS',
      description: 'Reagents, glass slides, and test tubes',
      color: '#10B981',
      icon: 'TestTube',
    })
    newCatId = newCat._id
    assert(newCat.categoryCode === 'CAT-LABCONS', 'Creates custom category with code CAT-LABCONS')
    assert(newCat.isSystem === false, 'Custom category isSystem flag is false')
  }

  // TEST 25: Prevent Duplicate Category Code (DUPLICATE_CATEGORY_CODE)
  {
    let errorCaught = false
    try {
      await service.createCategory(managerContext, {
        categoryName: 'Duplicate Category',
        categoryCode: 'CAT-LABCONS',
      })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'DUPLICATE_CATEGORY_CODE') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Prevents duplicate categoryCode with 409 DUPLICATE_CATEGORY_CODE')
  }

  // TEST 26: System Category Protection - Renaming Blocked
  {
    let errorCaught = false
    try {
      await service.updateCategory(managerContext, 'cat-rent-01', { categoryName: 'Renamed Rent' })
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'SYSTEM_CATEGORY_PROTECTED') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Rejects renaming protected system category with SYSTEM_CATEGORY_PROTECTED')
  }

  // TEST 27: System Category Protection - Archiving Blocked
  {
    let errorCaught = false
    try {
      await service.archiveCategory(managerContext, 'cat-rent-01')
    } catch (err: unknown) {
      if (err instanceof AppError && err.errorCode === 'SYSTEM_CATEGORY_PROTECTED') {
        errorCaught = true
      }
    }
    assert(errorCaught, 'Rejects archiving protected system category with SYSTEM_CATEGORY_PROTECTED')
  }

  // TEST 28: Archive Custom Category
  {
    const archivedCat = await service.archiveCategory(managerContext, newCatId)
    assert(archivedCat.archived === true, 'Archives custom category')
  }

  // TEST 29: Restore Custom Category
  {
    const restoredCat = await service.restoreCategory(managerContext, newCatId)
    assert(restoredCat.archived === false, 'Restores custom category')
  }

  // -------------------------------------------------------------
  // GROUP 5: Financial Rules & Realized P&L Calculation Invariants
  // -------------------------------------------------------------

  // TEST 30: Realized Net Profit Recognition Rule
  {
    const summary = await service.getDashboardSummary(managerContext)
    // Only exp-101 ($1450.50) is PAID and active in seed data
    assert(summary.paidExpenseAmountMonth >= 1450.5, 'Only PAID expenses are included in paidExpenseAmountMonth')
    assert(summary.pendingApprovalAmount >= 3200.0, 'PENDING_APPROVAL items are tracked separately under liabilities')
  }

  // -------------------------------------------------------------
  // GROUP 6: Search, Multi-Criteria Filtering, & Pagination
  // -------------------------------------------------------------

  // TEST 31: Filter Roster by Status
  {
    const listResult = await service.listExpenses(receptionistContext, { status: 'PAID' })
    assert(listResult.data.every((e) => e.status === 'PAID'), 'Filters roster by status PAID')
  }

  // TEST 32: Filter Roster by Category
  {
    const listResult = await service.listExpenses(receptionistContext, { categoryId: 'cat-medsup-01' })
    assert(listResult.data.every((e) => e.categoryId === 'cat-medsup-01'), 'Filters roster by categoryId')
  }

  // TEST 33: Full-Text Search Roster
  {
    const searchResult = await service.listExpenses(receptionistContext, { search: 'Apex Medical' })
    assert(searchResult.data.length > 0, 'Finds expenses by vendor search query Apex Medical')
    assert(searchResult.data[0].vendorName === 'Apex Medical Distributors Ltd.', 'Matches vendor name correctly')
  }

  // TEST 34: Pagination Parameters
  {
    const pageResult = await service.listExpenses(receptionistContext, { page: 1, limit: 2 })
    assert(pageResult.data.length <= 2, 'Respects pagination limit parameter')
    assert(pageResult.page === 1, 'Returns current page 1')
  }

  // TEST 35: Audit Log Emission Engine
  {
    const logs = await repo.getAuditLogs(tenantId, createdExpId)
    assert(logs.length > 0, 'Emits and records governance audit log entries')
    assert(logs.some((l) => l.action === 'EXPENSE_APPROVED'), 'Contains EXPENSE_APPROVED audit action')
  }

  console.info('===========================================================')
  console.info(`ALL ${totalTests} INTEGRATION TESTS PASSED SUCCESSFULLY (100% SUCCESS)`)
  console.info('===========================================================')
}

// Execute runner if executed directly
if (require.main === module) {
  runExpenseIntegrationTests().catch((err) => {
    console.error('Integration Test Suite Execution Failed:', err)
    process.exit(1)
  })
}

export { runExpenseIntegrationTests }
