import { AxiosRequestConfig } from 'axios'
import { format } from 'date-fns'
import React, { createContext, useCallback, useContext, useState } from 'react'
import constants from '../constants/constants'
import errors from '../constants/errors'
import api from '../services/apiClient'

interface BalanceState {
  personalBalance: number
  sharedBalance: {
    total: number
    paying: number
    payed: number
  }
}

interface ExpenseContextData {
  balance: BalanceState
  getBalance(date?: string): Promise<void>
  createExpense(payload: Payload, config: AxiosRequestConfig): Promise<void>
}

interface Payload {
  description: string
  'category_id': string
  'payment_type_id': string
  date: string
  amount: number
  personal: boolean
  split: boolean
  'bank_id'?: string
  'store_id'?: string
}

const BalanceContext = createContext<ExpenseContextData>({} as ExpenseContextData)

export const ExpenseProvider: React.FC = ({ children }) => {
  const [balance, setBalance] = useState<BalanceState>({} as BalanceState)
  const defaultDate = format(new Date(), constants.monthDateFormat)

  const getBalance = useCallback(async (date: string = defaultDate) => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }, params: { date }}
    const response = await api.get('/balance', config)
    const { data: { personalBalance, sharedBalance }} = response
    setBalance({ personalBalance, sharedBalance })
  }, [])

  const createExpense = useCallback(async (payload: Payload, config: AxiosRequestConfig) => {
    await api.post('/expenses', payload, config)
  }, [])

  return (
    <BalanceContext.Provider value={{ balance, getBalance, createExpense }}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useExpense(): ExpenseContextData {
  const context = useContext(BalanceContext)
  if (!context) throw new Error(errors.providerErrorMsg('useExpense', 'ExpenseProvider'))
  return context
}
