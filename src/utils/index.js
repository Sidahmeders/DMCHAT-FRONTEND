import { omit } from 'lodash'
import { format, isValid, parseISO } from 'date-fns'

export * from './localStorage'
export * from './ChatLogics'

export const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const flattenAppointment = (appointment) => ({
  id: appointment._id,
  patientId: appointment.patient._id,
  ...appointment.patient,
  ...omit(appointment, 'patient'),
})

export const checkIsJWTExpired = (token = '') => {
  const payload = token.split('.')[1]
  const decode = JSON.parse(window.atob(payload))
  if (decode.exp * 1000 < new Date().getTime()) {
    return true
  }
  return false
}

/**
 * Formats a date input into the specified format using the date-fns library.
 *
 * @param {string} dateInput - The date input to be formatted. Should be in ISO 8601 format.
 * @param {string} [dateFormat='yyyy-MM-dd'] - The desired format of the formatted date. Defaults to 'yyyy-MM-dd'.
 * @returns {string | null} The formatted date string in the specified format, or null if an error occurs.
 * @throws {Error} If the date input is invalid or cannot be parsed.
 */
export const formatDate = (date, dateFormat = 'yyyy-MM-dd') => {
  try {
    if (isValid(date)) {
      return format(date, dateFormat)
    }

    const parsedDate = parseISO(date)
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date')
    }

    return format(parsedDate, dateFormat)
  } catch (error) {
    console.error('Error formatting date:', error.message)
    return null
  }
}
