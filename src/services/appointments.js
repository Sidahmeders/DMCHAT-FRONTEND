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

export { fetchPatientAppointments }
