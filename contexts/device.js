import {useEffect, createContext, useState, useMemo} from 'react'

const MOBILE_WIDTH = 992

const DeviceContext = createContext()

export const DeviceContextProvider = props => {
  const [viewHeight, setViewHeight] = useState('100vh')
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  const handleResize = () => {
    setViewHeight(window.innerHeight)
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const value = useMemo(() => ({
    viewHeight,
    isMobileDevice
  }), [viewHeight, isMobileDevice])

  return (
    <DeviceContext.Provider
      value={value}
      {...props}
    />
  )
}

export default DeviceContext

