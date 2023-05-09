
import {useState, useEffect, useCallback, useMemo, createContext} from 'react'

const AuthentificationContext = createContext()

const TOKEN_KEY = 'Token'

export const AuthentificationContextProvider = props => {
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const storeToken = useCallback(value => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(value))
    setToken(value)
  }, [])

  const getData = () => {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY))
    } catch {
      storeToken(null)
      return null
    }
  }

  // Initializes with data already stored if none is provided
  useEffect(() => {
    const t = getData()
    if (t) {
      setToken(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
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
