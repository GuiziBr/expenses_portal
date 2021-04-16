import React, { createContext, useCallback, useState, useContext } from 'react'
import api from '../services/apiClient'

interface BalanceState {
  balance: {
    paying: number,
    payed: number,
    total: number
  }
}

interface BalanceContextData {
  balance: object
  getBalance(): Promise<void>
}

const BalanceContext = createContext<BalanceContextData>({} as BalanceContextData)

export const BalanceProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<BalanceState>(() => {
    const balance = sessionStorage.getItem('@expenses:balance')
    if (balance) return { balance: JSON.parse(balance) }
    return {} as BalanceState
  })
  const getBalance = useCallback(async () => {
    const token = sessionStorage.getItem('@expenses:token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const { data: { paying, payed, total } } = await api.get('/expenses/balance', config)
    const balance = { paying, payed, total }
    sessionStorage.setItem('@expenses:balance', JSON.stringify(balance))
    setData({ balance })
  }, [])
  return (
    <BalanceContext.Provider value={{ balance: data.balance, getBalance }}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance(): BalanceContextData {
  const context = useContext(BalanceContext)
  if (!context) throw new Error('getBalance must be used within an BalanceProvider')
  return context
}
