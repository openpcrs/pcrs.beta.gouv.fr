import {useState, useCallback} from 'react'

let id = 0

export const useToaster = () => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback(id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback(toastData => {
    const toast = {
      id: id++,
      toastData
    }

    setToasts(prevToasts => [...prevToasts, toast])

    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, toastData.duration || 3000)

    return () => clearTimeout(timer)
  }, [removeToast])

  return [toasts, addToast, removeToast]
}

export default useToaster
