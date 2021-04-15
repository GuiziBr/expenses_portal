import React, { createContext, useCallback, useState, useContext } from 'react'
import api from '../services/apiClient'

interface AuthState {
  token: string
  user: object
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: object
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = sessionStorage.getItem('@expenses:token')
    const user = sessionStorage.getItem('@expenses:user')
    if (token && user) return { token, user: JSON.parse(user) }
    return {} as AuthState
  })
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    })
    const { token, user } = response.data
    sessionStorage.setItem('@expenses:token', token)
    sessionStorage.setItem('@expenses:user', JSON.stringify(user))
    setData({ token, user })
  }, [])

  const signOut = useCallback(() => {
    sessionStorage.removeItem('@expenses:token')
    sessionStorage.removeItem('@expenses:user')
    setData({} as AuthState)
  }, [])

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
