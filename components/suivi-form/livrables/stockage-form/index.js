/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'

import HttpParamsInputs from '@/components/suivi-form/livrables/stockage-form/http-params.inputs.js'
import FtpParamsInputs from '@/components/suivi-form/livrables/stockage-form/ftp-params.inputs.js'
import SftpParamsInputs from '@/components/suivi-form/livrables/stockage-form/sftp-sftp-params-inputs.js'
import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'

const StockageForm = ({initialValues, handleLivrableStockage, onCancel}) => {
  const [stockageType, setStockageType] = useState(initialValues.stockage || undefined)
  const [stockageParams, setStockageParams] = useState(initialValues.params || {})
  const [isPublic, setIsPublic] = useState(initialValues?.stockage_public || false)
  const [isDownloadable, setIsDownloadable] = useState(initialValues?.stockage_download || false)

  const onSubmit = () => {
    handleLivrableStockage({
      stockage: stockageType,
      stockage_public: isPublic,
      stockage_download: isDownloadable,
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
          stockageParams={{...initialValues.stockage_params}}
          handleParams={setStockageParams}
        />
      )}

      {stockageType === 'ftp' && (
        <FtpParamsInputs
          stockageParams={{...initialValues.stockage_params}}
          handleParams={setStockageParams}
        />
      )}

      {stockageType === 'http' && (
        <HttpParamsInputs
          stockageParams={{url: initialValues.stockage_params?.url}}
          handleParams={setStockageParams}
        />
      )}

      {stockageType && (
        <>
          <div className='fr-mt-6w input-container'>
            <input
              type='checkbox'
              name='public'
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
            <label className='fr-label'>
              Rendre publiques les informations de connexion à l’espace de stockage
            </label>
          </div>

          <div className='fr-mt-3w input-container'>
            <input
              type='checkbox'
              name='download'
              checked={isDownloadable}
              onChange={() => setIsDownloadable(!isDownloadable)}
            />
            <label className='fr-label'>
              Autoriser le téléchargement via pcrs.beta.gouv.fr
            </label>
          </div>
          <div className='fr-notice fr-notice--info fr-mt-3w'>
            <div className='fr-mx-2w fr-notice__body'>
              <p>En autorisant la fonction de téléchargement, j’ai conscience que je suis responsable de la disponibilité du service de stockage. Si le service est de type FTP ou SFTP, les données transiteront obligatoirement par la plateforme pcrs.beta.gouv.fr</p>
            </div>
          </div>
        </>
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
