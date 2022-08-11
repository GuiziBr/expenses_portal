export interface INewExpenseModalProps {
  isOpen: boolean
  onRequestClose: (shouldLoadExpenses?: boolean) => void
  isDeskTopScreen: boolean
}

export interface ICategory {
  id: string
  description: string
}

export interface IPaymentType {
  id: string
  description: string
  hasStatement: boolean
}

export interface IBank {
  id: string
  name: string
}

export interface IStore {
  id: string
  name: string
}

export interface ICheckboxOption {
  id: string
  value: string
  label: string
}

export interface INewExpense {
  description: string
  category: string
  date: string
  amount: string
  options: [string]
  paymentType: string
  bank?: string
  store?: string
}
