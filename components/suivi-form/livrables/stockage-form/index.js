/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'

import GeneralSettingsInputs from './general-settings-inputs.js'
import HttpParamsInputs from '@/components/suivi-form/livrables/stockage-form/http-params-inputs.js'
import FtpParamsInputs from '@/components/suivi-form/livrables/stockage-form/ftp-params-inputs.js'
import SftpParamsInputs from '@/components/suivi-form/livrables/stockage-form/sftp-params-inputs.js'
import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'

import {isURLValid} from '@/components/suivi-form/livrables/utils/url.js'

const StockageForm = ({initialValues, handleLivrableStockage, onCancel}) => {
  const [validationMessage, setValidationMessage] = useState(null)
  const [stockageType, setStockageType] = useState(initialValues?.stockage || undefined)
  const [stockageParams, setStockageParams] = useState(initialValues?.stockage_params || {})
  const [generalSettings, setGeneralSettings] = useState({
    isPublic: initialValues?.stockage_public || false,
    isDownloadable: initialValues?.stockage_telechargement || false
  })

  const onSubmit = () => {
    handleLivrableStockage({
      stockage: stockageType,
      stockage_public: generalSettings.isPublic,
      stockage_telechargement: generalSettings.isDownloadable,
      stockage_params: stockageParams
    })
  }

  const handleUrl = url => {
    setStockageParams(prev => ({...prev, url}))

    if (isURLValid(url)) {
      setValidationMessage(null)
    } else {
      setValidationMessage({httpParams: {url: 'Cette URL n’est pas valide'}})
    }
  }

  return (
    <div className='fr-col-12'>
      <div className='fr-col-12'>
        <SelectInput
          isDisabled={Boolean(stockageType)}
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
          url={stockageParams?.url}
          handleUrl={handleUrl}
          validationMessage={validationMessage?.httpParams.url}
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
          label='Valider le stockage'
          isDisabled={stockageType === 'http' ? (!stockageParams.url || !isURLValid(stockageParams.url)) : !stockageParams.host}
          onClick={onSubmit}
        >
          {(!initialValues || initialValues.stockage === null) ? 'Ajouter le serveur' : 'Modifier le serveur'}
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
