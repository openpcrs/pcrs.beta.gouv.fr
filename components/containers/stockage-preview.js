import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'

import {useRouter} from 'next/router'

import {getStockageData, getStockageGeoJSON} from '@/lib/pcrs-scanner-api.js'

import ScannerMap from '@/components/containers/scanner-map.js'
import CenteredSpinnder from '@/components/centered-spinner.js'

const StockagePreview = ({stockageId}) => {
  const [stockage, setStockage] = useState()
  const [fetchError, setFetchError] = useState()

  const router = useRouter()

  useEffect(() => {
    async function fetchStockage() {
      try {
        const data = await getStockageData(stockageId)
        const geojson = await getStockageGeoJSON(stockageId)

        setStockage({data, geojson})
      } catch (error) {
        setFetchError(error)
      }
    }

    if (stockageId) {
      fetchStockage()
    } else {
      router.push('/404')
    }
  }, [stockageId])

  if (fetchError) {
    return <p id='text-input-error-desc-error' className='fr-error-text'>{fetchError}</p>
  }

  return (
    <div className='stockage-preview-container'>
      {stockage ? (
        <ScannerMap geojson={stockage.geojson} />
      ) : (
        <CenteredSpinnder />
      )}

      <style jsx>{`
        .stockage-preview-container {
            display: flex;
            width: 400px;
            height: 400px;
        }
        `}</style>
    </div>
  )
}

StockagePreview.propTypes = {
  stockageId: PropTypes.string.isRequired
}

export default StockagePreview
