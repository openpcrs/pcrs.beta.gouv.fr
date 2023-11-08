import PropTypes from 'prop-types'
import {find} from 'lodash-es'

import {formatDate} from '@/lib/date-utils.js'
import {findClosestEtape} from '@/shared/find-closest-etape.js'
import {STATUS} from '@/lib/utils/projet.js'

import Badge from '@/components/badge.js'
import Timeline from '@/components/map-sidebar/timeline.js'

const Progression = ({etapes}) => {
  const {statut} = etapes.at(-1)
  const projectStartDate = formatDate(find(etapes, {statut: 'investigation'}).date_debut)
  const isObsolete = statut === 'obsolete'
  const closestPostStep = findClosestEtape(etapes)
  const closestPostStepStatus = STATUS[closestPostStep.statut]

  return (
    <>
      <div className='actual-status fr-mb-3w'>
        <Badge
          background={closestPostStepStatus.color}
          textColor={closestPostStepStatus.textColor}
        >
          {closestPostStepStatus.label}
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

      <style jsx>{`
      .actual-status {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .start-date {
        font-style: italic;
      }
    `}</style>
    </>
  )
}

Progression.propTypes = {
  etapes: PropTypes.array.isRequired
}

export default Progression
