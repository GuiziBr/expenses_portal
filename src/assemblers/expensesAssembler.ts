import constants from '../constants/constants'
import { formatAmount, unformatAmount } from '../utils/formatAmount'
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
  'payment_type': { description: string }
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
  paymentType: string
}

interface Payload {
  description: string
  category: string
  date: string
  amount: string
  options: [string]
  paymentType: string
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
  paymentType: expense.payment_type.description,
})

export const assemblePersonalExpense = (expense: Omit<Expense, 'type'>): Omit<FormattedExpense, 'type'> => ({
  id: expense.id,
  description: expense.description,
  category: expense.category.description,
  amount: expense.amount,
  formattedAmount: formatAmount(expense.amount),
  formattedDate: formatDate(expense.date),
  date: expense.date,
  paymentType: expense.payment_type.description,
})

export const assemblePayload = (data: Payload) => ({
  description: data.description,
  category_id: data.category,
  date: data.date,
  amount: unformatAmount(data.amount),
  personal: data.options[0] === constants.expenseModel.personal,
  split: data.options[0] === constants.expenseModel.split,
  payment_type_id: data.paymentType,
})
