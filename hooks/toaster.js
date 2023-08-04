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

    setTimeout(() => {
      removeToast(toast.id)
    }, 3000)
  }, [removeToast])

  return [toasts, addToast, removeToast]
}

export default useToaster
