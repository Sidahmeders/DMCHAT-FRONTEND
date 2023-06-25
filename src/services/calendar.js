import { formatDate } from '@utils'
import _fetch from './_fetch'

const fetchCalendarAvailabilities = async (date) => await _fetch.GET(`/api/calendar/${formatDate(date, 'yyyy/MM')}`)

const setCalendarAvailability = async (date, availability) => {
  return await fetch(`/api/calendar/${formatDate(date, 'yyyy/MM/dd')}/availability`, { availability })
}

export { fetchCalendarAvailabilities, setCalendarAvailability }
