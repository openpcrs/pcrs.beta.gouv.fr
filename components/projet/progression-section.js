import PropTypes from 'prop-types'

import {findClosestEtape} from '@/shared/find-closest-etape.js'
import {formatDate} from '@/lib/date-utils.js'

import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import Timeline from '@/components/map-sidebar/timeline.js'
import Badge from '@/components/badge.js'

const {status} = PCRS_DATA_COLORS

const ProgressionSection = ({etapes}) => {
  const statutIndex = etapes.length > 0 ? etapes.length - 1 : 0
  const {statut} = etapes[statutIndex]

  const isObsolete = statut === 'obsolete'
  const projectStartDate = formatDate(find(etapes, {statut: 'investigation'}).date_debut)
  const closestPostStep = findClosestEtape(etapes)

  return (
    <>
      <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>État d’avancement</h3>
      <div>
        <div className='actual-status fr-mb-3w'>
          <Badge
            background={status[closestPostStep.statut]}
            textColor={closestPostStep.statut === 'livre' || closestPostStep.statut === 'obsolete' ? 'white' : 'black'}
          >
            {closestPostStep.statut === 'livre' ? 'livré' : closestPostStep.statut}
          </Badge>

          {projectStartDate && (
            <div className='start-date fr-text--sm fr-m-0'>Lancement du projet le {projectStartDate}</div>
          )}
        </div>
        {!isObsolete && (
          <Timeline
            stepsColors={status}
            currentStatus={closestPostStep.statut}
            steps={etapes}
          />
        )}
      </div>
    </>
  )
}

ProgressionSection.propTypes = {
  etapes: PropTypes.array.isRequired
}

export default ProgressionSection
