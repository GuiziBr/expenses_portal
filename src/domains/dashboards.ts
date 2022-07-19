export interface IExpense {
  id: string
  description: string
  category: string
  amount: number
  formattedAmount: string
  formattedDate: string
  type: 'income' | 'outcome'
  date: Date
  paymentType: string
  bank?: string
  store?: string
  dueDate: Date
  formattedDueDate?: string
  mobileFormatDate: string
  mobileFormatDueDate?: string
}

export interface IDates {
  startDate?: string
  endDate?: string
}

export interface IOrderByTypes {
  orderBy: string
  orderType: 'asc' | 'desc'
  isCurrent?: boolean
}
