import {format} from 'date-fns'
import {fr} from 'date-fns/locale'
import {orderBy} from 'lodash-es'

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

export function shortDate(date) {
  const options = {year: 'numeric', month: 'short', day: 'numeric'}

  return new Date(date).toLocaleDateString('fr-FR', options)
}

export function formatDate(string) {
  return format(new Date(string), 'PPP', {locale: fr})
}

