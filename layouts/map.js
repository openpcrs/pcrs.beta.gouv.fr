import {useState, useContext} from 'react'

import DeviceContext from '@/contexts/device.js'

import Map from '@/components/map/map.js'

export const Mobile = () => {
  const {viewHeight} = useContext(DeviceContext)
  const isOpen = false

  console.log(isOpen)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        contain: 'content'
      }}
    >
      <div
        style={{
          height: isOpen ? 0 : viewHeight - 204,
          width: '100%'
        }}
      >
        <Map isMobile />
      </div>
    </div>
  )
}

export const Desktop = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        contain: 'content'
      }}
    >
      <div
        style={{
          minWidth: isOpen ? '460px' : '5px',
          maxWidth: '460px',
          boxShadow: '0px 0px 5px grey',
          height: 'calc(100vh - 117px)',
          zIndex: 1,
          overflow: 'auto',
          overflowX: 'hidden'
        }}
      >
        <button
          type='button'
          className={`fr-icon-arrow-${isOpen ? 'left' : 'right'}-s-line`}
          style={{
            position: 'absolute',
            top: '25px',
            left: isOpen ? '460px' : '5px',
            backgroundColor: 'white',
            height: '50px',
            width: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '0 5px 5px 0',
            boxShadow: '2px 2px 5px grey'
          }}
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && (
          <div>test</div>
        )}
      </div>
      <div style={{width: '100%', height: 'calc(100vh - 117px)'}}>
        <Map />
      </div>
    </div>
  )
}

