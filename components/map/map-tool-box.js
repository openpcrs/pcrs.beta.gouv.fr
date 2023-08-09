import {useState} from 'react'
import PropTypes from 'prop-types'

const MapToolBox = ({children}) => {
  const [isOpen, setIsOpen] = useState()
  return (
    <div
      style={{
        position: 'absolute',
        right: '8px',
        top: '110px',
        backgroundColor: 'white',
        padding: '3px',
        borderRadius: '5px',
        width: isOpen ? '300px' : '',
        border: '2px solid #dfdbd8',
        zIndex: 2
      }}
    >
      {isOpen ? (
        <div
          className='fr-p-1w'
        >
          <span
            className='fr-icon-close-circle-line'
            aria-hidden='true'
            style={{
              position: 'absolute',
              verticalAlign: 'middle',
              cursor: 'pointer',
              right: '5px',
              top: '5px'
            }}
            onClick={() => setIsOpen(false)}
          />
          <span className='fr-pb-1w'><u>Affichage carte</u> :</span>
          <hr />
          {children}
        </div>
      ) : (
        <span
          className='fr-icon-filter-line'
          style={{
            cursor: 'pointer'
          }}
          onClick={() => setIsOpen(true)}
        />
      )}
    </div>
  )
}

MapToolBox.propTypes = {
  children: PropTypes.node
}

export default MapToolBox
