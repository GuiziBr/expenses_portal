import React, { createContext, useCallback, useContext, useState } from 'react'
import constants from '../constants/constants'
import errors from '../constants/errors'
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
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const user = sessionStorage.getItem(constants.sessionStorage.user)
    if (token && user) return { token, user: JSON.parse(user) }
    return {} as AuthState
  })
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    })
    const { token, user } = response.data
    sessionStorage.setItem(constants.sessionStorage.token, token)
    sessionStorage.setItem(constants.sessionStorage.user, JSON.stringify(user))
    setData({ token, user })
  }, [])

  const signOut = useCallback(() => {
    sessionStorage.removeItem(constants.sessionStorage.token)
    sessionStorage.removeItem(constants.sessionStorage.user)
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
  if (!context) throw new Error(errors.providerErrorMsg('useAuth', 'AuthProvider'))
  return context
}
