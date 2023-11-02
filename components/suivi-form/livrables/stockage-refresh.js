import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const StockageRefresh = ({handleRefreshScan, stockageId}) => {
  const [isScanRefreshing, setIsScanRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleClick = async () => {
    try {
      await handleRefreshScan(stockageId)
      setIsScanRefreshing(true)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className='fr-grid-row'>
      <button
        type='button'
        disabled={isScanRefreshing}
        className='fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-refresh-line'
        onClick={() => handleClick()}
      >
        {isScanRefreshing ? 'Scan en cours…' : 'Relancer le scan'}
      </button>
      <span className='fr-col-12 error-message'>
        <small><i>{errorMessage}</i></small>
      </span>
      <style jsx>{`
        .error-message {
          color: ${colors.error425};
        }
      `}</style>
    </div>
  )
}

StockageRefresh.propTypes = {
  handleRefreshScan: PropTypes.func,
  stockageId: PropTypes.string
}

export default StockageRefresh
