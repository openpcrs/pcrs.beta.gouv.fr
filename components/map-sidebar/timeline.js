import PropTypes from 'prop-types'
import {find, indexOf} from 'lodash'

import {formatDate} from '@/lib/date-utils.js'

import colors from '@/styles/colors.js'

import Tooltip from '@/components/tooltip.js'
import Loader from '@/components/loader.js'

const TIMELINE = [
  {step: 1, label: 'investigation', isProgressingStep: true},
  {step: 2, label: 'production', isProgressingStep: true},
  {step: 3, label: 'produit'},
  {step: 4, label: 'livre'}
]

const Timeline = ({currentStatus, stepsColors, steps, isObsolete}) => {
  const timelineLength = TIMELINE.length
  const currentStep = find(TIMELINE, step => step.label.toLowerCase() === currentStatus)
  const currentIndex = indexOf(TIMELINE, currentStep)

  return (
    <div className='fr-mb-3w'>
      <div className='timeline fr-mt-3w'>
        {Object.keys(TIMELINE).map((step, idx) => {
          const {label} = TIMELINE[step]
          const stepStartingDate = idx + 1 <= currentStep.step && formatDate(find(steps, {statut: TIMELINE[step].label.toLowerCase()}).date_debut)

          const isCurrentStep = currentStep.step === idx + 1
          const isProgressing = isCurrentStep && TIMELINE[step].isProgressingStep

          const tooltipContent = () => (
            <>
              <div className={`tooltip-label ${idx + 1 > currentStep.step ? 'futur-label' : ''}`}>
                {`${TIMELINE[step].label === 'livre' ? 'livré' : TIMELINE[step].label} ${isProgressing ? 'en cours' : ''}`}
              </div>
              {stepStartingDate && (
                <div className='start-date fr-text--sm fr-mb-0'>Depuis le {stepStartingDate}</div>
              )}
            </>
          )

          // Last step
          if (idx === timelineLength - 1) {
            return (
              <Tooltip key={step} tooltipContent={() => tooltipContent()}>
                <div
                  className='circle'
                  style={{
                    backgroundColor: isCurrentStep ? stepsColors[label] : colors.grey900,
                    color: isCurrentStep ? 'white' : colors.grey200
                  }}
                >
                  <span className='fr-icon-flag-fill' aria-hidden='true' />
                </div>
              </Tooltip>
            )
          }

          return (
            <div key={step} className='step'>
              {isProgressing || idx + 1 > currentStep.step ? (
              // Unvalidated steps
                <Tooltip tooltipContent={tooltipContent}>
                  {isProgressing ? <Loader type='pulse' size='small' /> : <div className='circle' />}
                </Tooltip>
              ) : (
              // Validated steps
                <Tooltip tooltipContent={tooltipContent}>
                  <div
                    className='circle'
                    style={{
                      background: stepsColors[label],
                      color: 'black'
                    }}
                  >
                    <span className='fr-icon-check-line' aria-hidden='true' />
                  </div>
                </Tooltip>
              )}

              <div className='separator' />
            </div>
          )
        })}
      </div>

      {currentStep.step < timelineLength && (
        <div className='fr-text--sm'>
          Prochaine étape: <span className='next-step'>
            {TIMELINE[currentIndex + 1].label === 'livre' ? 'livré' : TIMELINE[currentIndex + 1].label}
          </span>
        </div>
      )}

      <style jsx>{`
        .timeline {
          display: flex;
          align-items: center;
          opacity: ${isObsolete ? '50%' : '100%'}
        }
        .circle {
          background: ${colors.grey900};
          height: 35px;
          width: 35px;
          border-radius: 50%;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .step {
          flex: 1;
          display: grid;
          grid-template-columns: 35px 1fr;
          align-items: center;
        }
        .separator {
          margin: 0 -2px;
          background: ${colors.info425};
          height: 5px;
        }
        .tooltip-label, .next-step {
          font-weight: bold;
        }
        .start-date {
          font-style: italic;
        }
        .futur-label {
          color: ${colors.blueFrance850};
        }
      `}</style>
    </div>
  )
}

Timeline.propTypes = {
  steps: PropTypes.array.isRequired,
  isObsolete: PropTypes.bool,
  stepsColors: PropTypes.object,
  currentStatus: PropTypes.string.isRequired
}

Timeline.defaultProps = {
  stepsColors: null,
  isObsolete: false
}

export default Timeline

