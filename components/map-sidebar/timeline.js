import PropTypes from 'prop-types'

import TimelineStep from '@/components/ui/timeline-step.js'
import {STATUS} from '@/lib/utils/projet.js'

const TIMELINE = STATUS

const Timeline = ({currentStatus, steps}) => (
  <div className='fr-mb-3w'>
    <div className='timeline fr-mt-3w'>
      {Object.keys(STATUS).slice(0, -1).map((stepValue, index) => (
        <TimelineStep
          key={stepValue}
          step={steps[index]}
          status={STATUS[stepValue]}
          isCurrentStep={currentStatus === stepValue}
          isLastStep={stepValue === 'disponible'}
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

