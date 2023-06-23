import { format } from 'date-fns'
const { getUser } = require('@utils')

const user = getUser()

const fetchPatientAppointments = async (patientId) => {
  const response = await fetch(`/api/appointments/${patientId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return await response.json()
}

const createAppointment = async (appointmentData) => {
  const response = await fetch('/api/appointments/new', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  })

  return await response.json()
}

const relateAppointment = async (appointmentData) => {
  const response = await fetch('/api/appointments/relate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  })

  return await response.json()
}

const updateAppointment = async (appointmentId, appointmentData) => {
  const response = await fetch(`/api/appointments/${appointmentId}/update`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  })

  return await response.json()
}

const updateAppointmentsHistory = async (appointmentData) => {
  const response = await fetch('/api/appointments/history', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(appointmentData),
  })

  return await response.json()
}

const fetchMonthAppointments = async (date) => {
  const response = await fetch(`/api/appointments/${format(date, 'yyyy/MM')}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return await response.json()
}

const deleteAppointment = async (appointmentId) => {
  const response = await fetch(`/api/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return response.status
}

export {
  fetchPatientAppointments,
  createAppointment,
  relateAppointment,
  updateAppointment,
  updateAppointmentsHistory,
  fetchMonthAppointments,
  deleteAppointment,
}
