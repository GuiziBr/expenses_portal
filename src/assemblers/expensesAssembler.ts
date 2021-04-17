import constants from '../constants'
import { formatAmount } from '../utils/formatAmount'
import formatDate from '../utils/formatDate'

interface Expense {
  id: string
  description: string
  category: { description: string }
  amount: number
  formattedAmount: string
  formattedDate: string
  type: 'income' | 'outcome'
  date: Date
}

interface FormattedExpense {
  id: string
  description: string
  category: string
  amount: number
  formattedAmount: string
  formattedDate: string
  type: 'income' | 'outcome'
  date: Date
}

export const assembleExpense = (expense: Expense): FormattedExpense => ({
  id: expense.id,
  description: expense.description,
  category: expense.category.description,
  amount: expense.amount,
  formattedAmount: `${expense.type === constants.expenseType.outcome ? '- ' : ''}${formatAmount(expense.amount)}`,
  formattedDate: formatDate(expense.date),
  type: expense.type,
  date: expense.date,
})

export const assemblePersonalExpense = (expense: Omit<Expense, 'type'>): Omit<FormattedExpense, 'type'> => ({
  id: expense.id,
  description: expense.description,
  category: expense.category.description,
  amount: expense.amount,
  formattedAmount: formatAmount(expense.amount),
  formattedDate: formatDate(expense.date),
  date: expense.date,
})
