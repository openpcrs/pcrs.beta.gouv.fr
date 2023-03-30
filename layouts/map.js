import {useContext} from 'react'
import PropTypes from 'prop-types'

import DeviceContext from '@/contexts/device.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar/index.js'

export const Mobile = ({handleClick, handleTitleClick, projet, isOpen, setIsOpen, geometry}) => {
  const {viewHeight} = useContext(DeviceContext)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        contain: 'content'
      }}
    >
      {geometry && (
        <div
          style={{
            height: isOpen ? 0 : viewHeight - 204,
            width: '100%'
          }}
        >
          <Map isMobile handleClick={handleClick} geometry={geometry} />
        </div>
      )}
      <div
        style={{
          height: isOpen ? viewHeight - 147 : '46px',
          overflowY: isOpen ? 'auto' : 'hidden',
          overflowX: 'hidden',
          padding: '2px',
          border: '1px solid lightgrey',
          borderBottom: '0',
          zIndex: 5
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
          <MapSidebar projet={projet} onClose={() => setIsOpen(false)} />
        )}
      </div>
    </div>
  )
}

Mobile.defaultProps = {
  handleTitleClick: null,
  projet: null,
  isOpen: false
}

Mobile.propTypes = {
  handleClick: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  handleTitleClick: PropTypes.func,
  projet: PropTypes.object,
  isOpen: PropTypes.bool,
  geometry: PropTypes.object
}

export const Desktop = ({handleClick, projet, isOpen, setIsOpen, geometry}) => (
  <div
    style={{
      display: 'flex',
      contain: 'content'
    }}
  >
    {projet && (
      <>
        <div
          style={{
            minWidth: isOpen ? '460px' : '5px',
            maxWidth: '460px',
            boxShadow: '0px 0px 5px grey',
            height: 'calc(100vh - 117px)',
            overflow: 'auto',
            overflowX: 'hidden'
          }}
        >
          {isOpen && (
            <MapSidebar projet={projet} onClose={() => setIsOpen(false)} />
          )}
        </div>
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
            alignItems: 'center',
            borderRadius: '0 5px 5px 0',
            boxShadow: '2px 2px 5px grey',
            zIndex: 3
          }}
          onClick={() => setIsOpen(!isOpen)}
        />
      </>
    )}

    {geometry && (
      <div style={{width: '100%', height: 'calc(100vh - 117px)'}}>
        <Map style={{pointerEvents: 'all'}} handleClick={handleClick} geometry={geometry} />
      </div>
    )}
  </div>
)

Desktop.defaultProps = {
  projet: null,
  isOpen: false
}

Desktop.propTypes = {
  handleClick: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func,
  projet: PropTypes.object,
  isOpen: PropTypes.bool,
  geometry: PropTypes.object
}

