import PropTypes from 'prop-types'

const GeneralSettingsInputs = ({generalSettings, handleGeneralSettings}) => {
  const handleValuesChange = e => {
    handleGeneralSettings({...generalSettings, [e.target.name]: e.target.checked})
  }

  return (
    <>
      <div
        className='fr-checkbox-group fr-mt-3w'
        onClick={() => handleGeneralSettings({...generalSettings, isPublic: !generalSettings.isPublic})}
      >
        <input
          name='isPublic'
          type='checkbox'
          checked={generalSettings.isPublic}
          onChange={handleValuesChange}
        />
        <label className='fr-label'>
          Rendre publiques les informations de connexion à l’espace de stockage
        </label>
      </div>

      <div
        className='fr-checkbox-group fr-mt-3w'
        onClick={() => handleGeneralSettings({...generalSettings, isDownloadable: !generalSettings.isDownloadable})}
      >
        <input
          type='checkbox'
          name='isDownload'
          checked={generalSettings.isDownloadable}
          onChange={handleValuesChange}
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
  )
}

GeneralSettingsInputs.propTypes = {
  generalSettings: PropTypes.shape({
    isPublic: PropTypes.bool,
    isDownloadable: PropTypes.bool
  }),
  handleGeneralSettings: PropTypes.func.isRequired
}

export default GeneralSettingsInputs
