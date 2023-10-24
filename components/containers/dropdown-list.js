
import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const DropdownList = ({title, list, isDefaultOpen}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className='fr-grid-row' onClick={toggleOpen}>
      <div className='fr-grid-row fr-col-12'>
        <div className='data-title dropdown fr-mr-1w fr-grid-row'>{title}</div><span className={`fr-icon-arrow-${isOpen ? 'down' : 'right'}-s-line`} />
      </div>

      {isOpen && (
        <div className='fr-col-12 wrapper-container fr-mt-1w fr-p-1w'>
          {list.map(({label, value}) => (
            <div key={label} className='fr-grid-row fr-text--sm'>
              <div className='dropdown-data-title fr-mr-1w'>{label} :</div>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .data-title {
          color: ${colors.info425};
          font-weight: bold;
        }

        .dropdown {
          cursor: pointer;
        }

        wrapper-container {
          background: ${colors.grey975};
        }
        
        .dropdown-data-title {
          color: ${colors.grey50};
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

DropdownList.propTypes = {
  isDefaultOpen: false
}

DropdownList.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  isDefaultOpen: PropTypes.bool
}

export default DropdownList
