import {useState, useEffect, useCallback, useMemo, createContext} from 'react'

import {authentification} from '@/lib/authentification.js'

const AuthentificationContext = createContext()

const TOKEN_KEY = 'Token'

export const AuthentificationContextProvider = props => {
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
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

  const checkIsAdmin = useCallback(async () => {
    try {
      const checkIfIsAdmin = await authentification(token)

      if (checkIfIsAdmin.isAdmin) {
        setIsAdmin(true)
      }
    } catch {
      setIsAdmin(false)
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
      checkIsAdmin()
    }
  }, [token, checkIsAdmin])

  const value = useMemo(() => ({
    isAdmin,
    token,
    isTokenRecovering,
    storeToken
  }), [isAdmin, token, isTokenRecovering, storeToken])

  return (
    <AuthentificationContext.Provider
      value={value}
      {...props}
    />
  )
}

export const AuthentificationContextConsumer = AuthentificationContext.Consumer

export default AuthentificationContext
