import React from 'react'
import { AuthProvider } from './auth'
import { ExpenseProvider } from './expense'
import { ToastProvider } from './toast'

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ExpenseProvider>
      <ToastProvider>{children}</ToastProvider>
    </ExpenseProvider>
  </AuthProvider>
)

export default AppProvider
