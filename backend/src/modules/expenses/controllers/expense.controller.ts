import { Request, Response, NextFunction } from 'express'
import { ExpenseService, UserContext } from '../services/expense.service'
import { ExpenseValidator } from '../validators/expense.validator'

// Utility interface for Express request extended with auth user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    role: string
    tenantId: string
    clinicId?: string
  }
}

export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  private getUserContext(req: AuthenticatedRequest): UserContext {
    return {
      userId: req.user?.id || 'usr-anon',
      role: req.user?.role || 'CLINIC_MANAGER',
      tenantId: req.user?.tenantId || (req.headers['x-tenant-id'] as string) || 'clinic-101',
      clinicId: req.user?.clinicId || 'branch_main',
    }
  }

  createExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const dto = ExpenseValidator.validateCreateExpense(req.body)
      const data = await this.expenseService.createExpense(userContext, dto)
      res.status(201).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  getExpenseById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.expenseService.getExpenseById(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  updateExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = ExpenseValidator.validateUpdateExpense(req.body)
      const data = await this.expenseService.updateExpense(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  submitExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.expenseService.submitExpense(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  approveExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.expenseService.approveExpense(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  rejectExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = ExpenseValidator.validateRejectExpense(req.body)
      const data = await this.expenseService.rejectExpense(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  payExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = ExpenseValidator.validatePayExpense(req.body)
      const data = await this.expenseService.payExpense(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  archiveExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = ExpenseValidator.validateArchiveExpense(req.body)
      const data = await this.expenseService.archiveExpense(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  restoreExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.expenseService.restoreExpense(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  listExpenses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const params = ExpenseValidator.validateQuery(req.query as Record<string, unknown>)
      const result = await this.expenseService.listExpenses(userContext, params)
      res.status(200).json({
        success: true,
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (err) {
      next(err)
    }
  }

  getDashboardSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const data = await this.expenseService.getDashboardSummary(userContext)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  // Category Management Controllers
  getCategories = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const includeArchived = req.query.includeArchived === 'true'
      const data = await this.expenseService.getCategories(userContext, includeArchived)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  createCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const dto = ExpenseValidator.validateCreateCategory(req.body)
      const data = await this.expenseService.createCategory(userContext, dto)
      res.status(201).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  updateCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = ExpenseValidator.validateUpdateCategory(req.body)
      const data = await this.expenseService.updateCategory(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  archiveCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.expenseService.archiveCategory(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  restoreCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.expenseService.restoreCategory(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }
}
