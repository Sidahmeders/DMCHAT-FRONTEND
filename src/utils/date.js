import { format, isValid, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

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
      return format(date, dateFormat, { locale: fr })
    }

    const parsedDate = parseISO(date)
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date')
    }

    return format(parsedDate, dateFormat, { locale: fr })
  } catch (error) {
    console.error('Error formatting date:', error.message)
    return null
  }
}
