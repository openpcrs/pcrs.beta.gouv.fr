import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

import {getStockage, getStockageGeoJSON} from '@/lib/pcrs-scanner-api.js'

import CenteredSpinnder from '@/components/centered-spinner.js'
import StockageData from '@/components/projet/stockage-data.js'
import ScannedData from '@/components/projet/scanned-data.js'

const StockagePreview = ({stockageId}) => {
  const [stockage, setStockage] = useState()
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)
    async function fetchStockage() {
      try {
        const data = await getStockage(stockageId)
        const geojson = await getStockageGeoJSON(stockageId)

        setStockage({data, geojson})
      } catch {
        setFetchError('Les ressources du livrable sont indisponibles')
      }

      setIsLoading(false)
    }

    if (stockageId) {
      fetchStockage()
    } else {
      router.push('/404')
    }
  }, [stockageId])

  if (fetchError) {
    return (
      <div>
        {fetchError && <p id='text-input-error-desc-error' className='fr-error-text'> {fetchError}</p>}
      </div>
    )
  }

  return (
    <div className='fr-grid-row'>
      {isLoading ? (
        <div className='spinner-container fr-col-12 fr-grid-row fr-grid-row--center fr-grid-row--middle'>
          <div className='fr-col-12'>
            <CenteredSpinnder />
          </div>
        </div>
      ) : (
        <div className='stockage-preview-data-container fr-col-12'>
          <StockageData isPrivate={stockage.data?.stockagePublic === false} params={stockage.data.params} type={stockage.data.type} />
          {stockage.data.result ? (
            <ScannedData {...stockage} />
          ) : (
            <p id='text-input-error-desc-error' className='fr-error-text'>Les données relatives à ce stockage de sont pas encore disponibles</p>
          )}
        </div>
      )}

      <style jsx>{`
        .map-wrapper {
          width: 100%;
          height: 500px;
        }
      `}</style>
    </div>
  )
}

StockagePreview.propTypes = {
  stockageId: PropTypes.string.isRequired
}

export default StockagePreview
