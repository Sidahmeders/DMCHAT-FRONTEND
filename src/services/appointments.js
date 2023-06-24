import { formatDate } from '@utils'
import Fetch from './_fetch'

const _fetch = new Fetch()

const fetchPatientAppointments = async (patientId) => await _fetch.GET(`/api/appointments/${patientId}`)

const fetchMonthAppointments = async (date) => await _fetch.GET(`/api/appointments/${formatDate(date, 'yyyy/MM')}`)

const fetchDayAppointments = async (date) => _fetch.GET(`/api/appointments/${formatDate(date, 'yyyy/MM/dd')}`)

const createAppointment = async (appointmentData) => await _fetch.POST('/api/appointments/new', appointmentData)

const relateAppointment = async (appointmentData) => await _fetch.POST('/api/appointments/relate', appointmentData)

const updateAppointment = async (appointmentId, appointmentData) => {
  return await _fetch.PUT(`/api/appointments/${appointmentId}/update`, appointmentData)
}

const updateAppointmentsHistory = async (appointmentData) => _fetch.PUT('/api/appointments/history', appointmentData)

const deleteAppointment = async (appointmentId) => await _fetch.DELETE(`/api/appointments/${appointmentId}`)

const toggleAppointmentConfirmation = async (appointmentId, isConfirmed) => {
  return await _fetch.PUT(`/api/appointments/${appointmentId}/toggle-confirmation`, { isConfirmed })
}

const toggleAppointmentLeave = async (appointmentId, isLeft) => {
  return await _fetch.PUT(`/api/appointments/${appointmentId}/toggle-leave`, { isLeft })
}

export {
  fetchPatientAppointments,
  createAppointment,
  relateAppointment,
  updateAppointment,
  updateAppointmentsHistory,
  fetchMonthAppointments,
  fetchDayAppointments,
  deleteAppointment,
  toggleAppointmentConfirmation,
  toggleAppointmentLeave,
}
