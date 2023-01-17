import PropTypes from 'prop-types'
import {find, indexOf} from 'lodash'

import {formatDate} from '@/lib/date-utils.js'

import colors from '@/styles/colors.js'

import Tooltip from '@/components/tooltip.js'
import Loader from '@/components/loader.js'

const Timeline = ({timeline, currentStep, steps, isObsolete}) => {
  const timelineLength = timeline.length
  const currentIndex = indexOf(timeline, currentStep)

  return (
    <div className='fr-mb-3w'>
      <div className='timeline fr-mt-3w'>
        {Object.keys(timeline).map((step, idx) => {
          const isCurrentStep = currentStep.step === idx + 1
          const isProgressing = isCurrentStep && timeline[step].isProgressingStep
          const stepStartingDate = idx + 1 <= currentStep.step && formatDate(find(steps, {statut: timeline[step].label.toLowerCase()}).date_debut)

          const tooltipContent = () => (
            <>
              <div className={`tooltip-label ${idx + 1 > currentStep.step ? 'futur-label' : ''}`}>
                {`${timeline[step].label} ${isProgressing ? 'en cours' : ''}`}
              </div>
              {stepStartingDate && <div className='start-date fr-text--sm fr-mb-0'>Depuis le {stepStartingDate}</div>}
            </>
          )

          // Last step
          if (idx === timelineLength - 1) {
            return (
              <Tooltip key={step} tooltipContent={() => tooltipContent()}>
                <div
                  className='circle'
                  style={{
                    backgroundColor: isCurrentStep ? timeline[step].background : colors.grey900,
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
                      background: timeline[step].background,
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
          Prochaine étape: <span className='next-step'>{timeline[currentIndex + 1].label}</span>
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
  timeline: PropTypes.array.isRequired,
  currentStep: PropTypes.object.isRequired,
  steps: PropTypes.array.isRequired,
  isObsolete: PropTypes.bool
}

export default Timeline
