import React from 'react'

import { AuthProvider } from './auth'
import { ToastProvider } from './toast'
import { BalanceProvider } from './balance'

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <BalanceProvider>
      <ToastProvider>{children}</ToastProvider>
    </BalanceProvider>
  </AuthProvider>
)

export default AppProvider
