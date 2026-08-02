import type { RouteObject } from 'react-router-dom'
import { ExpensesDashboardView } from './views/ExpensesDashboardView'
import { ExpensesDirectoryView } from './views/ExpensesDirectoryView'
import { CreateExpenseView } from './views/CreateExpenseView'
import { EditExpenseView } from './views/EditExpenseView'
import { ExpenseDetailsView } from './views/ExpenseDetailsView'
import { ExpenseCategoriesView } from './views/ExpenseCategoriesView'

export const expenseDashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <ExpensesDashboardView />,
  },
  {
    path: 'directory',
    element: <ExpensesDirectoryView />,
  },
  {
    path: 'new',
    element: <CreateExpenseView />,
  },
  {
    path: 'categories',
    element: <ExpenseCategoriesView />,
  },
  {
    path: ':id',
    element: <ExpenseDetailsView />,
  },
  {
    path: ':id/edit',
    element: <EditExpenseView />,
  },
]
