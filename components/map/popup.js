import PropTypes from 'prop-types'
import Badge from '@/components/badge.js'

import colors from '@/styles/colors.js'

import {formatDate} from '@/lib/date-utils.js'

const TIMELINE = [
  {step: 1, label: 'Investigation', color: '#6b5200', background: '#ffe386', isProgressingStep: true},
  {step: 2, label: 'Production', color: '#114900', background: '#a7f192', isProgressingStep: true},
  {step: 3, label: 'Produit', color: '#06314f', background: '#87c1ea'},
  {step: 4, label: 'Livré', color: '#ffffff', background: '#175c8b'}
]

const Popup = ({project}) => {
  const {nom, statut, nature, acteurs, steps} = project
  const date = steps.find(s => s.statut === statut).date_debut
  const currentStep = TIMELINE.find(t => t.label.toLowerCase() === project.statut)

  return (
    <div
      className='fr-container'
      style={{
        textAlign: 'center'
      }}
    >
      <h6 className='title fr-text fr-text--md'><u>{nom}</u></h6>
      <div className='fr-text fr-text--sm fr-grid-row fr-pb-3v'>
        {(statut === 'production' || statut === 'investigation') && 'En '}
        <p
          style={{color: currentStep.color, backgroundColor: currentStep.background}}
          className='fr-badge fr-badge--sm fr-mx-1v'
        >
          {statut}
        </p> depuis <b className='fr-text fr-px-2v'>{formatDate(date)}</b>
      </div>
      <hr className='fr-p-1v' />
      <div className='container'>
        <div className='block'>
          <div className='block-title fr-pb-1v'>Nature</div>
          <Badge size='small' background='#b6e5ff'>{nature}</Badge>
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

