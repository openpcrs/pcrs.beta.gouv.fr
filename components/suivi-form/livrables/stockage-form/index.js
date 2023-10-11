import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import HttpForm from '@/components/suivi-form/livrables/stockage-form/http-form.js'
import FtpForm from '@/components/suivi-form/livrables/stockage-form/ftp-form.js'

const httpSchema = {
  stockage: 'http',
  stockageParams: {
    url: ''
  }
}

const ftpSchema = {
  stockage: 'ftp',
  stockageParams: {
    host: '',
    port: '',
    username: '',
    password: '',
    path: '',
    secure: false
  }
}

const StockageForm = ({values, onValueChange}) => {
  const [activeTab, setActiveTab] = useState('ftp')
  const labels = [{value: 'ftp', label: 'FTP'}, {value: 'http', label: 'HTTP'}]

  useEffect(() => {
    if (activeTab === 'ftp') {
      onValueChange(ftpSchema)
    } else {
      onValueChange(httpSchema)
    }
  }, [activeTab, onValueChange])

  return (
    <div className='fr-input-group fr-col-12'>
      <div className='fr-grid-row'>
        <span className='fr-icon-database-fill fr-mr-1w' aria-hidden='true' />
        <div className='fr-label'>Choix de la source de stockage</div>
      </div>

      <div className='fr-col-12 fr-mt-3w'>
        <div className='fr-tabs'>
          <ul className='fr-tabs__list' role='tablist' aria-label='Choix du type d’utilisateurs'>
            <li role='presentation'>
              <button
                type='button'
                className='fr-tabs__tab fr-icon-checkbox-line fr-tabs__tab--icon-left'
                role='tab'
                aria-selected={activeTab === 'http' ? 'true' : 'false'}
                onClick={() => setActiveTab('http')}
              >
                Stockage HTTP
              </button>
            </li>
            <li role='presentation'>
              <button
                type='button'
                className='fr-tabs__tab fr-icon-checkbox-line fr-tabs__tab--icon-left'
                role='tab'
                aria-selected={activeTab === 'ftp' ? 'true' : 'false'}
                onClick={() => setActiveTab('ftp')}
              >
                Stockage FTP
              </button>
            </li>
          </ul>
        </div>
      </div>
      {activeTab === 'ftp' && (
        <FtpForm
          values={ftpSchema}
          onValueChange={() => console.log('change ftp')}
        />
      )}

      {activeTab === 'http' && (
        <HttpForm
          values={httpSchema}
          onValueChange={() => console.log('change http')}
        />
      )}
    </div>
  )
}

StockageForm.propTypes = {
  values: PropTypes.object,
  onValueChange: PropTypes.func.isRequired
}

export default StockageForm
