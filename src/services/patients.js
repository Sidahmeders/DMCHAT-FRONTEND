const { getUser } = require('@utils')

const user = getUser()

const fetchPatients = async ({ pageNumber, pageSize, searchName }) => {
  let searchQuery = [
    pageNumber && `page=${pageNumber}`,
    pageSize && `pageSize=${pageSize}`,
    searchName && `fullName=${searchName}`,
  ]
    .filter((query) => query)
    .join('&')

  const response = await fetch(`/api/patients?${searchQuery}`, {
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
