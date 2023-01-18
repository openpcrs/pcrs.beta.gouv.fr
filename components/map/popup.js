import PropTypes from 'prop-types'
import Badge from '@/components/badge'

import colors from '@/styles/colors'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors'

import {formatDate} from '@/lib/utils'

const Popup = ({project}) => {
  const {status, natures} = PCRS_DATA_COLORS
  const {nom, statut, nature, acteurs, steps} = project
  const date = steps.find(s => s.statut === statut).date_debut

  return (
    <div
      className='fr-container'
      style={{
        textAlign: 'center'
      }}
    >
      <h6 className='title fr-text fr-text--md'><u>{nom}</u></h6>
      <div className='fr-text fr-text--sm fr-grid-row fr-pb-3v'>
        En
        <p
          style={{backgroundColor: status[statut], color: statut === 'livré' || statut === 'obsolete' ? 'white' : 'black'}}
          className='fr-badge fr-badge--sm fr-mx-1w'
        >
          {statut}
        </p>
        depuis <b className='fr-text fr-px-2v'>{formatDate(date)}</b>
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
          <div className='block-title fr-pb-1v'><b>APLC</b></div>
          <div><i>{acteurs.aplc.nom}</i></div>
        </div>
      </div>
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
  project: PropTypes.object.isRequired
}

export default Popup

