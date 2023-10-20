import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'

import {getStockage} from '@/lib/pcrs-scanner-api.js'

import colors from '@/styles/colors.js'

import CenteredSpinnder from '@/components/centered-spinner.js'
import StockageData from '@/components/projet/stockage-data.js'
import ScannedData from '@/components/projet/scanned-data.js'

const StockagePreview = ({stockageId, isStockagePublic}) => {
  const [stockage, setStockage] = useState()
  const [errorMessages, setErrorMessages] = useState({geojsonFetchError: null, dataFetchError: null})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setErrorMessages(prevErrors => ({...prevErrors, dataFetchError: null}))

    async function fetchStockage() {
      try {
        const data = await getStockage(stockageId)
        setStockage(prevStockage => ({...prevStockage, data}))
      } catch {
        setErrorMessages(prevErrors => ({...prevErrors, dataFetchError: 'Les données du livrable sont indisponibles'}))
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
            <CenteredSpinnder />
          </div>
        </div>
      ) : (
        <div className='stockage-preview-data-container fr-mt-2w fr-pl-3w fr-col-12'>
          {errorMessages.dataFetchError ? (
            <p className='fr-error-text'> {errorMessages.dataFetchError}</p>
          ) : (
            <StockageData isPublic={isStockagePublic} params={stockage.data.params} type={stockage.data.type} />
          )}

          {stockage.data.result ? (
            <ScannedData
              errorMessages={errorMessages}
              {...stockage}
              stockageId={stockageId}
              handleStorage={setStockage}
              handleErrorMessages={setErrorMessages}
            />
          ) : (
            <p className='fr-error-text'>Les données relatives à ce stockage ne sont pas encore disponibles</p>
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
