import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'

import {getStockage} from '@/lib/pcrs-scanner-api.js'

import colors from '@/styles/colors.js'

import CenteredSpinner from '@/components/centered-spinner.js'
import StockageData from '@/components/projet/stockage-data.js'
import ScannedData from '@/components/projet/scanned-data.js'

const StockagePreview = ({stockageId, isStockagePublic}) => {
  const [stockage, setStockage] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    async function fetchStockage() {
      try {
        const data = await getStockage(stockageId)
        setStockage(prevStockage => ({...prevStockage, data}))
      } catch {
        setError('Impossible de récupérer les données du livrable')
      }

      setIsLoading(false)
    }

    fetchStockage()
  }, [stockageId])

  return (
    <div className='fr-grid-row'>
      {isLoading ? (
        <div className='spinner-container fr-col-12 fr-grid-row fr-grid-row--center fr-grid-row--middle'>
          <div className='fr-col-12'>
            <CenteredSpinner />
          </div>
        </div>
      ) : (
        <div className='stockage-preview-data-container fr-mt-2w fr-pl-3w fr-col-12'>
          {error ? (
            <p className='fr-error-text'>{error}</p>
          ) : (
            <>
              <StockageData isPublic={isStockagePublic} params={stockage.data.params} type={stockage.data.type} />
              {!stockage.data && ['pending', 'processing'].includes(stockage.scan) && (
                <div className='fr-alert fr-alert--info fr-alert--sm'>
                  <p>Scan du livrable en cours…</p>
                </div>
              )}

              {stockage.data && (
                <ScannedData {...stockage} stockageId={stockageId} />
              )}
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .stockage-preview-data-container {
          border-top: solid 3px ${colors.blueFrance925};
        }

        .map-wrapper {
          width: 100%;
          height: 500px;
        }
      `}</style>
    </div>
  )
}

StockagePreview.propTypes = {
  stockageId: PropTypes.string.isRequired,
  isStockagePublic: PropTypes.bool
}

StockagePreview.defaultProps = {
  isStockagePublic: true
}

export default StockagePreview
