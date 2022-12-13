import {orderBy} from 'lodash'

export function sortEventsByDate(events) {
  return orderBy(events, [
    function (event) {
      return Date.parse(`${event.date}T${event.start}`)
    }
  ], ['asc'])
}

export function dateWithDay(date) {
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

  return new Date(date).toLocaleDateString('fr-FR', options)
}
