import {useState, useEffect} from 'react'
import Image from 'next/image'

import events from '../events.json'

import {sortEventsByDate} from '@/lib/date-utils.js'

import Page from '@/layouts/main.js'

import EventCard from '@/components/event-card.js'

const Evenements = () => {
  const [currentMonthEvents, setCurrentMonthEvents] = useState([])
  const [nextMonthsEvents, setNextMonthsEvents] = useState([])

  useEffect(() => {
    const today = new Date()
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const filteredFuturEvents = sortEventsByDate(events.filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)))

    const sortedCurrentMonthEvents = filteredFuturEvents.filter(event => {
      const [year, month] = event.date.split('-')

      return (currentMonth === Number(month)) && (currentYear === Number(year))
    })

    const sortedNextMonthEvents = filteredFuturEvents.filter(event => {
      const [year, month] = event.date.split('-')

      return currentYear < year || (currentMonth < Number(month) && currentYear === year)
    })

    setCurrentMonthEvents(sortedCurrentMonthEvents)
    setNextMonthsEvents(sortedNextMonthEvents)
  }, [])

  return (
    <Page title='Événements autour du PCRS' description='Consultez les événements à venir.'>
      <div className='events-header fr-my-5w'>
        <Image
          src='/images/illustrations/calendar_illustration-colored.png'
          height={200}
          width={200}
          alt=''
          aria-hidden='true'
        />
        <h2 className='fr-my-5w'>Événements autour du PCRS</h2>
      </div>

      <div className='fr-p-5w'>
        <div>
          <h3 className='fr-h6'>Les événements du mois</h3>
          {currentMonthEvents.length > 0 ? (
            <div className='events-container'>
              {currentMonthEvents.map(event => <EventCard key={`${event.date}-${event.start}-${event.end}`} {...event} />)}
            </div>
          ) : (
            <div className='empty'>Aucun événement prévu ce mois-ci</div>
          )}
        </div>

        <div className='fr-mt-8w'>
          <h3 className='fr-h6'>À venir les mois prochains</h3>
          {nextMonthsEvents.length > 0 ? (
            <div className='events-container'>
              {nextMonthsEvents.map(event => <EventCard key={`${event.date}-${event.start}-${event.end}`} {...event} />)}
            </div>
          ) : (
            <div className='empty'>Aucun événement prévu les mois prochains</div>
          )}
        </div>

      </div>

      <style jsx>{`
      .events-header {
        text-align: center;
      }

      .events-container {
        display: flex;
        flex-wrap: wrap;
        gap: 2em;
      }

      .empty {
        font-style: italic;
      }
    `}</style>
    </Page>
  )
}

export default Evenements
