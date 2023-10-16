import PropTypes from 'prop-types'

import TimelineStep from '@/components/ui/timeline-step.js'
import {STATUS} from '@/lib/utils/projet.js'

const TIMELINE = STATUS.slice(0, -1)

const Timeline = ({currentStatus, steps}) => (
  <div className='fr-mb-3w'>
    <div className='timeline fr-mt-3w'>
      {TIMELINE.map((step, index) => (
        <TimelineStep
          key={step.value}
          stepDateDebut={steps[index]?.date_debut}
          status={step}
          isCurrentStep={currentStatus === step.value}
          isLastStep={step.value === 'disponible'}
        />
      ))}
    </div>

    {steps.length < TIMELINE.length && (
      <div className='fr-text--sm fr-mt-1w'>
        Prochaine étape: <span className='next-step'>
          {TIMELINE[steps.length].label}
        </span>
      </div>
    )}

    <style jsx>{`
        .timeline {
          display: flex;
          align-items: center;
        }
        .next-step {
          font-weight: bold;
        }
        .start-date {
          font-style: italic;
        }
      `}</style>
  </div>
)

Timeline.propTypes = {
  steps: PropTypes.array.isRequired,
  currentStatus: PropTypes.string.isRequired
}

export default Timeline

