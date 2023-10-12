import {useState} from 'react'
import PropTypes from 'prop-types'

import HttpForm from '@/components/suivi-form/livrables/stockage-form/http-form.js'
import FtpForm from '@/components/suivi-form/livrables/stockage-form/ftp-form.js'
import SelectInput from '@/components/select-input.js'

const StockageForm = ({initialValues, handleLivrableStockage, onCancel}) => {
  const [stockageType, setStockageType] = useState(initialValues.stockage || undefined)

  const onSubmit = stockageParams => {
    handleLivrableStockage({
      stockage: stockageType,
      stockageParams
    })
  }

  return (
    <div className='fr-col-12 fr-mt-3w'>
      <div className='fr-grid-row'>
        <span className='fr-icon-database-fill fr-mr-1w' aria-hidden='true' />
        <div className='fr-label'>Stockage du livrable</div>
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
          initialValues={{...initialValues.stockageParams}}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}

      {stockageType === 'http' && (
        <HttpForm
          initialValues={{url: initialValues.stockageParams?.url}}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </div>
  )
}

StockageForm.propTypes = {
  initialValues: PropTypes.object,
  handleLivrableStockage: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

StockageForm.defaultProps = {
  initialValues: {}
}

export default StockageForm
