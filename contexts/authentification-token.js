
import {useState, useEffect, useCallback, useMemo, createContext} from 'react'

// Import {useLocalStorage} from '@/hooks/local-storage'

const AuthentificationContext = createContext()

const TOKEN_KEY = 'Token'

export const AuthentificationContextProvider = props => {
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const storeToken = useCallback(value => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(value))
    setToken(value)
  }, [])

  useEffect(() => {
    if (token) {
      setIsAdmin(true)
    }
  }, [token])

  const value = useMemo(() => ({
    isAdmin,
    token,
    storeToken
  }), [isAdmin, token, storeToken])

  return (
    <AuthentificationContext.Provider
      value={value}
      {...props}
    />
  )
}

export const AuthentificationContextConsumer = AuthentificationContext.Consumer

export default AuthentificationContext
