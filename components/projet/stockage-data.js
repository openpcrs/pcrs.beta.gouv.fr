import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Badge from '@/components/badge.js'

const StockageData = ({isPublic, type, params}) => {
  const [isParamsShow, setIsParamsShow] = useState(false)
  const handleParamsShow = () => setIsParamsShow(!isParamsShow)

  return (
    <div className='fr-mt-3w'>
      <div className='fr-grid-row fr-grid-row--middle'>
        <span className='fr-icon-database-line fr-mr-1w' aria-hidden='true' />
        <h3 className='section-title fr-text--md fr-m-0'>Stockage</h3>
      </div>

      <div className='fr-mt-1w'>
        <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Type de stockage :</div><span>{type.toUpperCase()}</span></div>
        <div className='fr-mt-1w fr-grid-row'>
          <div className='data-title fr-mr-1w'>Statut du stockage:</div>
          <Badge background={isPublic ? colors.success425 : colors.warningMain525} textColor='white'> {isPublic ? 'Public' : 'Privé'} </Badge>
        </div>

        {(isPublic && params?.host) && (
          <div className='fr-grid-row' onClick={handleParamsShow}>
            <div className='fr-grid-row fr-col-12'>
              <div className='data-title dropdown fr-mr-1w fr-grid-row'>Afficher les paramètres du stockage</div><span className={`fr-icon-arrow-${isParamsShow ? 'down' : 'right'}-s-line`} />
            </div>

            {isParamsShow && (
              <div className='fr-col-12 params-wrapper fr-mt-1w fr-p-1w'>
                <div className='fr-grid-row fr-text--sm'><div className='dropdown-data-title fr-mr-1w'>Adresse du serveur :</div><span>{params.host || 'Non renseigné'}</span></div>
                <div className='fr-grid-row fr-text--sm'><div className='dropdown-data-title fr-mr-1w'>Identifiant :</div><span>{params.username || 'Non renseigné'}</span></div>
                <div className='fr-grid-row fr-text--sm'><div className='dropdown-data-title fr-mr-1w'>Mot de passe :</div><span>{params.password || 'Non renseigné'}</span></div>
                <div className='fr-grid-row fr-text--sm'><div className='dropdown-data-title fr-mr-1w'>Chemin du répertoire :</div><span>{params.startPath || '/ (défaut)'}</span></div>
                <div className='fr-grid-row fr-text--sm'><div className='dropdown-data-title fr-mr-1w'>Port :</div><span>{params.port || 'Non renseigné'}</span></div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
       .data-title {
         color: ${colors.info425};
         font-weight: bold;
       }

       .dropdown {
        cursor: pointer;
       }

       .content-wrapper span {
         font-weight: normal;
       }

       .params-wrapper {
         background: ${colors.grey975};
       }

       .dropdown-data-title {
         color: ${colors.grey50};
         font-weight: bold;
       }
     `}</style>
    </div>
  )
}

StockageData.propTypes = {
  type: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  isPublic: PropTypes.bool
}

StockageData.defaultProps = {
  isPublic: false
}

export default StockageData

