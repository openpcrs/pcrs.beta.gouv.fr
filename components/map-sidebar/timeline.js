import PropTypes from 'prop-types'
import {find, indexOf} from 'lodash'

import {formatDate} from '@/lib/date-utils.js'

import colors from '@/styles/colors.js'

import Tooltip from '@/components/tooltip.js'
import Loader from '@/components/loader.js'

const TIMELINE = [
  {step: 1, value: 'investigation', label: 'Investigation', isProgressingStep: true},
  {step: 2, value: 'production', label: 'Production', isProgressingStep: true},
  {step: 3, value: 'produit', label: 'Produit'},
  {step: 4, value: 'livre', label: 'Livré'}
]

const Timeline = ({currentStatus, stepsColors, steps, isObsolete}) => {
  const timelineLength = TIMELINE.length
  const currentStep = find(TIMELINE, step => step.value === currentStatus)
  const currentIndex = indexOf(TIMELINE, currentStep)

  return (
    <div className='fr-mb-3w'>
      <div className='timeline fr-mt-3w'>
        {Object.keys(TIMELINE).map((step, idx) => {
          const {label, value} = TIMELINE[step]

          const isStepActualOrPassed = idx + 1 <= currentStep.step
          const isCurrentStep = currentStep.step === idx + 1
          const isProgressing = isCurrentStep && TIMELINE[step].isProgressingStep

          const stepStartingDate = isStepActualOrPassed && formatDate(find(steps, {statut: TIMELINE[step].value}).date_debut)

          const tooltipContent = () => (
            <>
              <div className={`tooltip-label ${idx + 1 > currentStep.step ? 'futur-label' : ''}`}>
                {`${label} ${isProgressing ? 'en cours' : ''}`}
              </div>

              {stepStartingDate && <div className='start-date fr-text--sm fr-mb-0'>Depuis le {stepStartingDate}</div>}
            </>
          )

          // Last step
          if (idx === timelineLength - 1) {
            return (
              <Tooltip
                key={step}
                tooltipContent={() => tooltipContent()}
                position='left'
              >
                <div
                  className='circle'
                  style={{
                    backgroundColor: isCurrentStep ? stepsColors[value] : colors.grey900,
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
                <Tooltip tooltipContent={tooltipContent} position={idx === 2 ? 'left' : 'right'}>
                  {isProgressing ? <Loader type='pulse' size='small' /> : <div className='circle' />}
                </Tooltip>
              ) : (
              // Validated steps
                <Tooltip tooltipContent={tooltipContent} position={idx === 2 ? 'left' : 'right'}>
                  <div
                    className='circle'
                    style={{
                      background: stepsColors[value],
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
            {TIMELINE[currentIndex + 1].value === 'livre' ? 'livré' : TIMELINE[currentIndex + 1].value}
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

