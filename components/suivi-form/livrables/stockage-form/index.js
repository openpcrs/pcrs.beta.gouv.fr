import {useState} from 'react'
import PropTypes from 'prop-types'

import HttpForm from '@/components/suivi-form/livrables/stockage-form/http-form.js'
import FtpForm from '@/components/suivi-form/livrables/stockage-form/ftp-form.js'
import SelectInput from '@/components/select-input.js'

const StockageForm = ({initialValues, handleLivrableStockage, onClose}) => {
  const [stockageType, setStockageType] = useState(initialValues.stockage || undefined)

  const onSubmit = stockage => {
    handleLivrableStockage({...initialValues, stockage: stockageType, stockageParams: stockage})

    setStockageType(undefined)
    onClose()
  }

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
          initialValues={{
            host: initialValues.stockageParams?.host,
            port: initialValues.stockageParams?.port,
            user: initialValues.stockageParams?.user,
            password: initialValues.stockageParams?.password,
            path: initialValues.stockageParams?.path,
            secure: initialValues.stockageParams.secure
          }}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      )}

      {stockageType === 'http' && (
        <HttpForm
          initialValues={{url: initialValues.stockageParams?.url}}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      )}
    </div>
  )
}

StockageForm.propTypes = {
  initialValues: PropTypes.object,
  handleLivrableStockage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

StockageForm.defaultProps = {
  initialValues: {}
}

export default StockageForm
