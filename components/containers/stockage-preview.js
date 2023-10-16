import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'
import Image from 'next/image.js'
import {useRouter} from 'next/router'

import StockageFilesTree from './stockage-files-tree.js'

import colors from '@/styles/colors.js'
import {getStockageData, getStockageGeoJSON} from '@/lib/pcrs-scanner-api.js'

import Tab from '@/components/ui/tab.js'
import ScannerMap from '@/components/containers/scanner-map.js'
import CenteredSpinnder from '@/components/centered-spinner.js'

const StockagePreview = ({stockageId}) => {
  const [stockage, setStockage] = useState()
  const [selectedTab, setSelectedTab] = useState('map')
  const [fetchError, setFetchError] = useState(null)

  const router = useRouter()

  useEffect(() => {
    async function fetchStockage() {
      try {
        const data = await getStockageData(stockageId)
        const geojson = await getStockageGeoJSON(stockageId)

        setStockage({data, geojson})
      } catch {
        setFetchError('Les ressources du livrable sont indisponibles')
      }
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
        { fetchError && <p id='text-input-error-desc-error' className='fr-error-text'> {fetchError}</p>}
      </div>
    )
  }

  return (
    <div className='stockage-preview-container'>
      {stockage ? (
        <Tab
          handleActiveTab={setSelectedTab}
          activeTab={selectedTab}
          tabs={[
            {value: 'map', label: 'Carte'},
            {value: 'files', label: 'Fichiers'}
          ]}
        >
          <div className='tab-content'>
            {selectedTab === 'map' && (
              <div className='map-wrapper'>
                <ScannerMap geojson={stockage.geojson} />
              </div>
            )}
            {selectedTab === 'files' && (
              <StockageFilesTree data={stockage.data} />
            )}
          </div>
        </Tab>
      ) : (
        <div className='spinner-container fr-grid-row fr-grid-row--center fr-grid-row--middle'>
          <div className='fr-col-12'>
            <CenteredSpinnder />
          </div>
        </div>
      )}

      <style jsx>{`
        .stockage-preview-container {
          display: flex;
          height: 500px;
        }

        .spinner-container {
          width: 100%;
        }

        .tab-content {
          min-height: 500px;
          overflow-y: auto;
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
  stockageId: PropTypes.string.isRequired
}

export default StockagePreview
