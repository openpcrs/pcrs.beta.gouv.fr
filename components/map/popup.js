import PropTypes from 'prop-types'
import Badge from '@/components/badge.js'

import colors from '@/styles/colors.js'
import {STATUS, NATURES} from '@/lib/utils/projet.js'

import {formatDate} from '@/lib/date-utils.js'

const Popup = ({projet, numberOfProjets}) => {
  const {aplc, dateStatut, nom, nature, statut} = projet
  const status = STATUS[statut]

  return (
    <div
      className='fr-container'
      style={{
        textAlign: 'center'
      }}
    >
      <div className='title'><u>{nom}</u></div>
      {numberOfProjets > 1 && (
        <div className='more'>
          <i>...et {numberOfProjets - 1} {numberOfProjets === 2 ? 'autre projet' : 'autres projets'}</i>
        </div>
      )}
      <div className='fr-text fr-text--sm fr-grid-row--center fr-pt-3v'>
        <p
          style={{
            backgroundColor: status.color,
            color: status.textColor
          }}
          className='fr-badge fr-badge--sm fr-mx-1w'
        >
          {status.label}
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
            background={NATURES[nature].color}
          >
            {NATURES[nature].label}
          </Badge>
        </div>
        <div className='block'>
          <div className='block-title fr-pb-1v'><b>Porteur</b></div>
          <div><i>{aplc}</i></div>
        </div>
      </div>
      <style>{`
        .title {
          color: ${colors.blueFranceSun113};
          font-size: 1.4em;
          font-weight: bold;
          padding-bottom: 5px;
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
  numberOfProjets: PropTypes.number
}

export default Popup

