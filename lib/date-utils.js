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
  if (string) {
    return format(new Date(string), 'PPP', {locale: fr})
  }
}

export function dateToUtc(string) {
  const dateParts = string.split('-')
  const year = Number(dateParts[0])
  const month = Number(dateParts[1]) - 1 // Month goes to 0 to 11
  const day = Number(dateParts[2])

  const date = new Date(Date.UTC(year, month, day))
  return date
}

