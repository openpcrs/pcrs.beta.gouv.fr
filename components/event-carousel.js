import {useState, useEffect} from 'react'

import allEvents from '../events.json'

import {sortEventsByDate, dateWithDay} from '@/lib/date-utils'

import colors from '@/styles/colors'

const today = new Date()
const events = sortEventsByDate(allEvents.filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))).slice(0, 3)

const EventCarousel = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const slideInterval = setTimeout(() => {
      setIndex(index === events.length - 1 ? 0 : index + 1)
    }, 4000)

    return () => {
      clearInterval(slideInterval)
    }
  }, [index])

  if (events.length === 0) {
    return null
  }

  return (
    <div className='banner fr-py-1w'>
      <h2 className='fr-text--lead fr-m-0'>Les prochains événements autour du PCRS</h2>
      <div className='slides-controls-container'>
        <div className='slideshow-dots'>
          {events.map((event, idx) => (
            <button
              type='button'
              onClick={() => setIndex(idx)}
              label={`${index === idx ? 'Vous consultez' : 'Aller à '} l’évènement ${event.title} du ${dateWithDay(event.date)}`}
              key={`${event.title}-${event.date}`}
              disabled={index === idx}
              className='dot-button fr-m-0 fr-p-0'
            >
              <div className={`slideshow-dot ${index === idx ? '' : 'disable'}`} />
            </button>
          ))}
        </div>

        <ul className='slider'>
          {events.map((event, idx) => (
            <li className={idx === index ? 'slide' : 'hidden'} key={`${event.title}-${event.date}`}>
              <div className='fr-text--lg fr-m-0'>
                {event.title}
              </div>

              <div className='date'>le {dateWithDay(event.date)}</div>
            </li>
          )
          )}
        </ul>
      </div>

      <style jsx>{`
        .banner {
          background: ${colors.info200};
          text-align: center;
        }

        .banner, .fr-text--lead {
          color: white;
        }

        .fr-text--lg {
          font-weight: bold;
        }

        .date {
          font-style: italic;
        }

        .slides-controls-container {
          display: flex;
          /* Accessibility: Use column-reverse to show slider controler on bottom (keep it above for the DOM) */
          flex-direction: column-reverse;
        }

        .slide {
          animation: fadeIn linear 1s;
        }

        @keyframes fadeIn {
          0% {opacity:0;}
          100% {opacity:1;}
        }

          /* Buttons */
        .dot-button:hover {
          background: none;
        }

        .slideshow-dots {
          display: grid;
          grid-template-columns: 18px 18px 18px;
          justify-content: center;
        }

        .slideshow-dot {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background-color: white;
          margin: 5px;
        }

        .disable {
          opacity: 50%;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default EventCarousel
