import { formatDate } from '@utils'
import _fetch from './_fetch'

const fetchPaymentsByDateRange = async (startDate, endDate) => {
  return await _fetch.GET(`/api/statistics/${formatDate(startDate)}/${formatDate(endDate)}/payments-revenue`)
}

const fetchAppointmentsRevenueByDateRange = async (startDate, endDate) => {
  return await _fetch.GET(`/api/statistics/${formatDate(startDate)}/${formatDate(endDate)}/appointments-revenue`)
}

const fetchPatientsAgeRatio = async () => await _fetch.GET('/api/statistics/patients/age-ratio')

export { fetchPaymentsByDateRange, fetchAppointmentsRevenueByDateRange, fetchPatientsAgeRatio }
