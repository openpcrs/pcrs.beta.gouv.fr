import PropTypes from 'prop-types'
import colors from '@/styles/colors'

function dateWithDay(date) {
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

  return new Date(date).toLocaleDateString('fr-FR', options)
}

const EventCard = ({title, date, start, end, isOnSite, isOnline, address, eventHref, description, type}) => (
  <div className='eventcard-container fr-pb-1w'>
    <div className='event-header fr-px-2w'>
      {eventHref ? (
        <h3 className='fr-text--lg fr-my-0'>
          <a href={eventHref}>{title}</a>
        </h3>
      ) : (
        <h3 className='fr-text--lg fr-my-0'>{title}</h3>
      )}
      <div className='type fr-text--sm fr-mt-1w'>{type}</div>
    </div>

    <div className='infos fr-px-2w'>
      <div>
        <div className='date'>{dateWithDay(date)}</div>
        <div className='fr-m-0 fr-text--sm'>{start} - {end}</div>
      </div>
      <div className='fr-text--sm fr-m-0'>
        {isOnSite && (
          <>
            {(!eventHref && address) && <div className='address'><span className='fr-icon-map-pin-2-fill fr-mr-5px' aria-hidden='true' />{address}</div>}
            {(!eventHref && !address) && <div className='address'><span className='fr-icon-map-pin-2-fill fr-mr-5px' aria-hidden='true' />En présentiel</div>}
            {eventHref && <div className='address'><span className='fr-icon-map-pin-2-fill fr-mr-5px' aria-hidden='true' /><a href={eventHref}>En présentiel</a></div>}
          </>
        )}

        {isOnline && (
          <div className='address fr-mt-1w'>
            <span className='fr-icon-computer-fill fr-mr-1w' aria-hidden='true' />
            {eventHref ? <a href={eventHref}>En ligne</a> : 'En ligne'}
          </div>
        )}
      </div>
      <div className='fr-m-0 fr-text--sm'>{description}</div>
    </div>

    <style jsx>{`
      .eventcard-container {
        display: grid;
        grid-template-rows: 100px 1fr;
        gap: 1em;
        width: 300px;
        border-radius: 5px;
        border: 1px solid #EFEFEF;
        box-shadow: 2px 2px 17px -5px rgba(0, 0, 0, 0.25);
      }

      .fr-text--lg, .event-header {
        color: white;
      }

      .event-header {
        border-radius: 5px 5px 0 0;
        background: ${colors.info200};
        display: grid;
        grid-auto-rows: auto 30px;
        align-content: center;
      }

      .infos {
        display: grid;
        grid-template-rows: auto auto auto;
        gap: 1em;
        height: 100%;
      }

      .date, .type {
        font-weight: bold;
      }

      .address a {
        width: fit-content;
      }

      .address, .type {
        font-style: italic;
      }

      .address {
        display: grid;
        grid-template-columns: 30px 1fr;
      }

      .fr-icon-map-pin-2-fill, .fr-icon-computer-fill {
        color: ${colors.redMarianne425};
      }
    `}</style>
  </div>
)

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  eventHref: PropTypes.string.isRequired,
  isOnSite: PropTypes.bool.isRequired,
  isOnline: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}
export default EventCard
