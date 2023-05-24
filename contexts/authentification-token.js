import {useState, useEffect, useCallback, useMemo, createContext} from 'react'

import {authentificationRole} from '@/lib/authentification.js'

const AuthentificationContext = createContext()

const TOKEN_KEY = 'Token'

export const AuthentificationContextProvider = props => {
  const [token, setToken] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isTokenRecovering, setIsTokenRecovering] = useState(true)

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

  const checkUserRole = useCallback(async () => {
    try {
      const getUserRole = await authentificationRole(token)
      setUserRole(getUserRole.role)
    } catch {
      setUserRole(null)
    }
  }, [token])

  // Initializes with data already stored if none is provided
  useEffect(() => {
    const t = getStoredToken()
    if (t) {
      setToken(t)
    }

    setIsTokenRecovering(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      checkUserRole()
    }
  }, [token, checkUserRole])

  const value = useMemo(() => ({
    userRole,
    token,
    isTokenRecovering,
    storeToken
  }), [userRole, token, isTokenRecovering, storeToken])

  return (
    <AuthentificationContext.Provider
      value={value}
      {...props}
    />
  )
}

export const AuthentificationContextConsumer = AuthentificationContext.Consumer

export default AuthentificationContext
