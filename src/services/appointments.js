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

export { fetchPatientAppointments, createAppointment, relateAppointment }
