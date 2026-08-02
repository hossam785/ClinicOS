import { Router } from 'express'
import { InMemoryExpenseRepository } from '../repositories/expense.repository'
import { ExpenseService } from '../services/expense.service'
import { ExpenseController } from '../controllers/expense.controller'
import { auth } from '@/middleware/auth'

const expenseRepo = new InMemoryExpenseRepository()
const expenseService = new ExpenseService(expenseRepo)
const expenseController = new ExpenseController(expenseService)

export const expenseRouter = Router()
export const expenseCategoryRouter = Router()

// All expense routes require valid authentication token
expenseRouter.use(auth)
expenseCategoryRouter.use(auth)

// Dashboard Summary Route
expenseRouter.get('/dashboard/summary', expenseController.getDashboardSummary)

// CRUD & Query Routes for Expenses
expenseRouter.post('/', expenseController.createExpense)
expenseRouter.get('/', expenseController.listExpenses)
expenseRouter.get('/:id', expenseController.getExpenseById)
expenseRouter.put('/:id', expenseController.updateExpense)

// Workflow Lifecycle Routes
expenseRouter.patch('/:id/submit', expenseController.submitExpense)
expenseRouter.patch('/:id/approve', expenseController.approveExpense)
expenseRouter.patch('/:id/reject', expenseController.rejectExpense)
expenseRouter.patch('/:id/pay', expenseController.payExpense)
expenseRouter.patch('/:id/archive', expenseController.archiveExpense)
expenseRouter.patch('/:id/restore', expenseController.restoreExpense)

// Category Management Routes (/api/v1/expense-categories)
expenseCategoryRouter.get('/', expenseController.getCategories)
expenseCategoryRouter.post('/', expenseController.createCategory)
expenseCategoryRouter.put('/:id', expenseController.updateCategory)
expenseCategoryRouter.patch('/:id/archive', expenseController.archiveCategory)
expenseCategoryRouter.patch('/:id/restore', expenseController.restoreCategory)
