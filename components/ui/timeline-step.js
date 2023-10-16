import Proptypes from 'prop-types'

import Loader from '@/components/loader.js'
import Tooltip from '@/components/tooltip.js'
import colors from '@/styles/colors.js'

const TimelineStep = ({stepDateDebut, status, isCurrentStep, isLastStep}) => {
  const tooltipContent = () => (
    <>
      <div className={`tooltip-label ${stepDateDebut ? '' : 'futur-label'}`}>
        {status.label}
      </div>

      {stepDateDebut && <div className='start-date fr-text--sm fr-mb-0'>Depuis le {stepDateDebut}</div>}

      <style jsx>{`
        .futur-label {
          color: ${colors.blueFrance850};
        }
        .tooltip-label, .next-step {
          font-weight: bold;
        }
        .start-date {
          font-style: italic;
        }
      `}</style>
    </>
  )

  return (
    <div className='step'>
      <Tooltip
        tooltipContent={() => tooltipContent()}
        position='left'
      >
        {(!isCurrentStep || isLastStep) ? (
          <div
            className='circle'
            style={{
              backgroundColor: stepDateDebut ? status.color : colors.grey900,
              color: stepDateDebut ? status.textColor : colors.grey200
            }}
          >
            {(stepDateDebut || isLastStep) && (
              <span className={isLastStep ? 'fr-icon-flag-fill' : 'fr-icon-check-line'} aria-hidden='true' />
            )}
          </div>
        ) : (
          <Loader type='pulse' size='small' />
        )}

      </Tooltip>

      {!isLastStep && <div className='separator' />}

      <style jsx>{`
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
      `}</style>
    </div>
  )
}

TimelineStep.propTypes = {
  stepDateDebut: Proptypes.string,
  status: Proptypes.shape({
    label: Proptypes.string.isRequired,
    color: Proptypes.string.isRequired,
    textColor: Proptypes.string.isRequired
  }).isRequired,
  isCurrentStep: Proptypes.bool.isRequired,
  isLastStep: Proptypes.bool.isRequired
}

export default TimelineStep
