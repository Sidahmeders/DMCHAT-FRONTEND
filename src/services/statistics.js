import { formatDate } from '@utils'
import _fetch from './_fetch'

const fetchPaymentsByDateRange = async (startDate, endDate) => {
  return await _fetch.GET(`/api/statistics/${formatDate(startDate)}/${formatDate(endDate)}`)
}

export { fetchPaymentsByDateRange }
