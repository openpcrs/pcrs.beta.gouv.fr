import {createContext, useState, useMemo} from 'react'

const ToasterContext = createContext()

export const ToasterContextProvider = props => {
  const [toastContent, setToastContent] = useState(null)
  const [toastType, setToastType] = useState('info')

  const value = useMemo(() => ({
    toastContent,
    toastType,
    setToastContent,
    setToastType
  }), [toastContent, setToastContent, toastType, setToastType])

  return (
    <ToasterContext.Provider value={value} {...props} />
  )
}

export default ToasterContext

