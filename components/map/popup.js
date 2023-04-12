import PropTypes from 'prop-types'
import Badge from '@/components/badge.js'

import colors from '@/styles/colors.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import {formatDate} from '@/lib/date-utils.js'

const Popup = ({projet, otherProjets}) => {
  const {aplc, dateStatut, nom, nature, statut} = projet
  const {status, natures} = PCRS_DATA_COLORS

  return (
    <div
      className='fr-container'
      style={{
        textAlign: 'center'
      }}
    >
      <h6 className='title fr-text fr-text--md'><u>{nom}</u></h6>
      <div className='fr-text fr-text--sm fr-grid-row fr-pb-3v'>
        {statut !== 'livre' && (
          <span>En</span>
        )}
        <p
          style={{
            backgroundColor: status[statut],
            color: statut === 'livre' || statut === 'obsolete' ? 'white' : 'black'
          }}
          className='fr-badge fr-badge--sm fr-mx-1w'
        >
          {statut === 'livre' ? 'livré' : statut}
        </p>
        {dateStatut && (
          <>
            depuis <b className='fr-text fr-px-2v'>{formatDate(dateStatut)}</b>
          </>
        )}
      </div>
      <hr className='fr-p-1v' />
      <div className='container'>
        <div className='block'>
          <div className='block-title fr-pb-1v'>Nature</div>
          <Badge size='small'
            background={natures[nature]}
          >
            {nature}
          </Badge>
        </div>
        <div className='block'>
          <div className='block-title fr-pb-1v'><b>Porteur</b></div>
          <div><i>{aplc}</i></div>
        </div>
      </div>
      {otherProjets > 1 && (
        <p className='fr-pt-5v'>
          <i>Et {otherProjets - 1} {otherProjets === 2 ? 'autre projet' : 'autres projets'}</i>
        </p>
      )}
      <style>{`
        .title {
          color: ${colors.blueFranceSun113};
        }
        .container {
          display: flex;
        }
        .block {
          width: 100%;
        }
        .block-title {
          font-size: 1.4em;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

Popup.propTypes = {
  projet: PropTypes.object.isRequired,
  otherProjets: PropTypes.number
}

export default Popup

