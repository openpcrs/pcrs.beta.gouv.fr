import {useState, useEffect, useCallback, useMemo, createContext} from 'react'

import {authentificationRole} from '@/lib/authentification.js'

const AuthentificationContext = createContext()

const TOKEN_KEY = 'Token'

export const AuthentificationContextProvider = props => {
  const [token, setToken] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isAuthDataRecovering, setIsAuthDataRecovering] = useState(true)

  const storeToken = useCallback(value => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(value))
    setToken(value)
  }, [])

  const getStoredToken = () => {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY))
    } catch {
      storeToken(null)
      return null
    }
  }

  const disconnectUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUserRole(null)
    setToken(null)
  }, [])

  const checkUserRole = useCallback(async () => {
    try {
      const getUserRole = await authentificationRole(token)

      if (getUserRole.code === 403) {
        disconnectUser()
      } else {
        setUserRole(getUserRole.role)
      }

      setIsAuthDataRecovering(false)
    } catch {
      setUserRole(null)
    }
  }, [token, disconnectUser])

  // Initializes with data already stored if none is provided
  useEffect(() => {
    const t = getStoredToken()
    if (t) {
      setToken(t)
    } else {
      setIsAuthDataRecovering(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      checkUserRole()
    }
  }, [token, checkUserRole])

  const value = useMemo(() => ({
    userRole,
    token,
    isTokenRecovering: isAuthDataRecovering,
    storeToken,
    disconnectUser
  }), [userRole, token, isAuthDataRecovering, storeToken, disconnectUser])

  return (
    <AuthentificationContext.Provider
      value={value}
      {...props}
    />
  )
}

export const AuthentificationContextConsumer = AuthentificationContext.Consumer

export default AuthentificationContext
