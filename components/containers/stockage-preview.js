import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'

import {useRouter} from 'next/router'

import StockageFilesTree from './stockage-files-tree.js'
import {getStockageData, getStockageGeoJSON} from '@/lib/pcrs-scanner-api.js'

import Tab from '@/components/ui/tab.js'
import ScannerMap from '@/components/containers/scanner-map.js'
import CenteredSpinnder from '@/components/centered-spinner.js'

const StockagePreview = ({stockageId}) => {
  const [stockage, setStockage] = useState()
  const [selectedTab, setSelectedTab] = useState('map')
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
        <CenteredSpinnder />
      )}

      <style jsx>{`
        .stockage-preview-container {
            display: flex;
            height: 500px;
            overflow-y: auto;
        }

        .tab-content {
          min-height: 500px;
          overflow-y: auto;
        }

        .map-wrapper {
          width: 600px;
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
