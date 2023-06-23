const { getUser } = require('@utils')

const user = getUser()

const fetchPatients = async (pageNumber, pageSize) => {
  const response = await fetch(`/api/patients?page=${pageNumber}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return await response.json()
}

const createPatient = async (patientData) => {
  const response = await fetch('/api/patients', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  })

  return await response.json()
}

const updatePatientById = async (patientData) => {
  const response = await fetch(`/api/patients/${patientData._id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  })

  return await response.json()
}

const deletePatientById = async (patientId) => {
  const response = await fetch(`/api/patients/${patientId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  return response.status
}

export { fetchPatients, createPatient, updatePatientById, deletePatientById }
