import { formatAmount } from '../utils/formatAmount'
import formatDate from '../utils/formatDate'

interface Expense {
  id: string;
  description: string;
  amount: number;
  formattedAmount: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  date: Date;
}

export const assembleExpense = (expense: Expense): Expense => ({
  id: expense.id,
  description: expense.description,
  amount: expense.amount,
  formattedAmount: `${expense.type === 'outcome' ? '- ' : ''}${formatAmount(expense.amount)}`,
  formattedDate: formatDate(expense.date),
  type: expense.type,
  date: expense.date,
})
