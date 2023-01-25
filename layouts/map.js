import {useState, useContext} from 'react'

import {getProject} from '@/lib/pcrs.js'
import DeviceContext from '@/contexts/device.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar/index.js'

export const Mobile = () => {
  const {viewHeight} = useContext(DeviceContext)
  const [isOpen, setIsOpen] = useState(false)
  const [projet, setProjet] = useState()

  const handleClick = async e => {
    const projet = await getProject(e.features[0].properties.id)
    setProjet(projet)
    setIsOpen(true)
  }

  const handleTitleClick = () => {
    if (projet) {
      setIsOpen(!isOpen)
    }
  }

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
        <Map isMobile handleClick={handleClick} />
      </div>
      <div
        style={{
          height: isOpen ? viewHeight - 147 : '46px',
          overflowY: isOpen ? 'auto' : 'hidden',
          overflowX: 'hidden',
          padding: '2px',
          border: '1px solid lightgrey',
          borderBottom: '0'
        }}
      >
        <div
          className='fr-p-3v'
          style={{
            float: isOpen ? 'right' : 'left',
            width: '100%',
            display: 'flex',
            justifyContent: projet && isOpen ? 'end' : 'space-between'
          }}
        >
          {isOpen && projet ? (
            <span
              className='fr-icon--lg fr-icon-close-circle-line'
              style={{
                color: 'white',
                cursor: 'pointer'
              }}
              onClick={handleTitleClick}
            />
          ) : (
            (!isOpen && projet) ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <span>{projet?.nom}</span>
                <span
                  className='fr-icon--lg fr-icon-arrow-up-s-line'
                  aria-hidden='true'
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={handleTitleClick}
                />
              </div>
            ) : (
              <small>Sélectionnez un PCRS sur la carte</small>
            )
          )}
        </div>
        {isOpen && (
          <MapSidebar projet={projet} />
        )}
      </div>
    </div>
  )
}

export const Desktop = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [projet, setProjet] = useState()

  const handleClick = async e => {
    const projet = await getProject(e.features[0].properties.id)
    setProjet(projet)
    setIsOpen(true)
  }

  return (
    <div
      style={{
        display: 'flex',
        contain: 'content'
      }}
    >
      {projet && (
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
            <MapSidebar projet={projet} />
          )}
        </div>
      )}
      <div style={{width: '100%', height: 'calc(100vh - 117px)'}}>
        <Map handleClick={handleClick} />
      </div>
    </div>
  )
}
