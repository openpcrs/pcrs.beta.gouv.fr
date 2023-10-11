import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const ListItem = ({title, children}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='fr-my-1w fr-p-1w dropdown-item-container'>
      <div className='title-action-container'>
        <div>{title}</div>
        <div onClick={handleOpen}>
          <span className={`fr-icon-arrow-${isOpen ? 'down' : 'right'}-s-line`} aria-hidden='true' />
        </div>
      </div>
      {isOpen && (
        <div className='fr-mt-4w'>
          {children}
        </div>
      )}

      <style jsx>{`
        .dropdown-item-container {
          max-width: 90%;
          background: ${colors.grey975};
        }

        .title-action-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  )
}

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}

ListItem.defaultProps = {
  children: null
}

export default ListItem
