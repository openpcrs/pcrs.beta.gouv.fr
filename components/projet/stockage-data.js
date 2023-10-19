import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Badge from '@/components/badge.js'

const StockageData = ({isPrivate, type, params}) => {
  const [isParamsShow, setIsParamsShow] = useState(false)
  const handleParamsShow = () => setIsParamsShow(!isParamsShow)

  return (
    <div className='fr-mt-3w'>
      <div className='fr-grid-row fr-grid-row--middle'>
        <span className='fr-icon-database-line fr-mr-1w' aria-hidden='true' />
        <h3 className='section-title fr-text--lead fr-m-0'>Stockage</h3>
      </div>

      <div className='fr-mt-3w'>
        <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Type de stockage :</div><span>{type.toUpperCase()}</span></div>
        <div className='fr-mt-1w fr-grid-row'>
          <div className='data-title fr-mr-1w'>Statut du stockage:</div>
          <Badge background={isPrivate ? colors.warningMain525 : colors.success425} textColor='white'> {isPrivate ? 'Privé' : 'Public'} </Badge>
        </div>

        {(!isPrivate && params?.host) && (
          <div className='fr-grid-row' onClick={handleParamsShow}>
            <div className='fr-grid-row fr-col-12'>
              <div className='data-title fr-mr-1w fr-grid-row'>Afficher les paramètres du stockage</div><span className={`fr-icon-arrow-${isParamsShow ? 'down' : 'right'}-s-line`} />
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
       .section-title {
         border-bottom: 4px solid ${colors.info425};
       }

       .data-title {
         color: ${colors.info425};
         font-weight: bold;
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
  isPrivate: PropTypes.bool
}

StockageData.defaultProps = {
  isPrivate: false
}

export default StockageData

