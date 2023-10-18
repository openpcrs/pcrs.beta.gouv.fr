/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'

import GeneralSettingsInputs from './general-settings-inputs.js'
import HttpParamsInputs from '@/components/suivi-form/livrables/stockage-form/http-params-inputs.js'
import FtpParamsInputs from '@/components/suivi-form/livrables/stockage-form/ftp-params-inputs.js'
import SftpParamsInputs from '@/components/suivi-form/livrables/stockage-form/sftp-params-inputs.js'
import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'

const StockageForm = ({initialValues, handleLivrableStockage, onCancel}) => {
  const [stockageType, setStockageType] = useState(initialValues.stockage || undefined)
  const [stockageParams, setStockageParams] = useState(initialValues.params || {})
  const [generalSettings, setGeneralSettings] = useState({
    isPublic: initialValues.isPublic || false,
    isDownloadable: initialValues.isDownloadable || false
  })

  const onSubmit = () => {
    handleLivrableStockage({
      stockage: stockageType,
      stockage_public: generalSettings.isPublic,
      stockage_download: generalSettings.isDownloadable,
      stockage_params: stockageParams
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
            {value: 'ftp', label: 'FTP'},
            {value: 'sftp', label: 'SFTP'}
          ]}
          onValueChange={e => setStockageType(e.target.value)}
        />
      </div>

      {stockageType === 'sftp' && (
        <SftpParamsInputs
          stockageParams={stockageParams}
          handleParams={setStockageParams}
        />
      )}

      {stockageType === 'ftp' && (
        <FtpParamsInputs
          stockageParams={stockageParams}
          handleParams={setStockageParams}
        />
      )}

      {stockageType === 'http' && (
        <HttpParamsInputs
          stockageParams={stockageParams}
          handleParams={setStockageParams}
        />
      )}

      {stockageType && (
        <GeneralSettingsInputs
          generalSettings={generalSettings}
          handleGeneralSettings={setGeneralSettings}
        />
      )}

      <div className='fr-mt-3w'>
        <Button
          label='Ajouter le serveur'
          isDisabled={stockageType === 'http' ? !stockageParams.url : !stockageParams.host}
          onClick={onSubmit}
        >
          Ajouter le serveur
        </Button>
        <Button
          style={{marginLeft: '1em'}}
          label='Annuler l’ajout du serveur'
          buttonStyle='secondary'
          onClick={onCancel}
        >
          Annuler
        </Button>
      </div>

      <style jsx>{`
        .input-container {
          display: flex;
        }

        .input-container label {
          padding-left: 1em;
        }
      `}</style>
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
