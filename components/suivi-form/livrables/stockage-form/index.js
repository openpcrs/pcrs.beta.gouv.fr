import {useState} from 'react'
import PropTypes from 'prop-types'

import HttpForm from '@/components/suivi-form/livrables/stockage-form/http-form.js'
import FtpForm from '@/components/suivi-form/livrables/stockage-form/ftp-form.js'
import SelectInput from '@/components/select-input.js'

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
    user: '',
    password: '',
    path: '',
    secure: false
  }
}

const StockageForm = ({initialValues, onValueChange}) => {
  const [stockageType, setStockageType] = useState(initialValues?.stockage)
  const [stockageParams, setStockageParams] = useState(initialValues?.stockageParams)

  return (
    <div className='fr-col-12'>
      <div className='fr-grid-row'>
        <span className='fr-icon-database-fill fr-mr-1w' aria-hidden='true' />
        <div className='fr-label'>Choix de la source de stockage</div>
      </div>

      <div className='fr-col-12 fr-mt-3w'>
        <SelectInput
          label='Type de stockage'
          value={stockageType}
          options={[
            {value: 'http', label: 'HTTP'},
            {value: 'ftp', label: 'FTP'}
          ]}
          onValueChange={e => setStockageType(e.target.value)}
        />
      </div>
      {stockageType === 'ftp' && (
        <FtpForm
          initialValues={ftpSchema}
          onSubmit={onValueChange}
          onCancel={() => setStockageType(null)}
        />
      )}

      {stockageType === 'http' && (
        <HttpForm
          initialValues={httpSchema}
          onSubmit={onValueChange}
          onCancel={() => setStockageType(null)}
        />
      )}
    </div>
  )
}

StockageForm.propTypes = {
  initialValues: PropTypes.object,
  onValueChange: PropTypes.func.isRequired
}

export default StockageForm
