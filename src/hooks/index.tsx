import React from 'react'
import { AuthProvider } from './auth'
import { BalanceProvider } from './balance'
import { ToastProvider } from './toast'

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <BalanceProvider>
      <ToastProvider>{children}</ToastProvider>
    </BalanceProvider>
  </AuthProvider>
)

export default AppProvider
