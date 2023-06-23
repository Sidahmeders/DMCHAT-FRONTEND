const { getUser, formatDate } = require('@utils')

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
  const response = await fetch(`/api/appointments/${formatDate(date, 'yyyy/MM')}`, {
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

const toggleAppointmentConfirmation = async (appointmentId, isConfirmed) => {
  const response = await fetch(`/api/appointments/${appointmentId}/toggle-confirmation`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isConfirmed }),
  })

  return await response.json()
}

const toggleAppointmentLeave = async (appointmentId, isLeft) => {
  const response = await fetch(`/api/appointments/${appointmentId}/toggle-leave`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isLeft }),
  })

  return await response.json()
}

export {
  fetchPatientAppointments,
  createAppointment,
  relateAppointment,
  updateAppointment,
  updateAppointmentsHistory,
  fetchMonthAppointments,
  deleteAppointment,
  toggleAppointmentConfirmation,
  toggleAppointmentLeave,
}
