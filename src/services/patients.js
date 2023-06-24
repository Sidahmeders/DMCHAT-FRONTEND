import Fetch from './_fetch'

const _fetch = new Fetch()

const fetchPatients = async ({ pageNumber, pageSize, searchName }) => {
  let searchQuery = [
    pageNumber && `page=${pageNumber}`,
    pageSize && `pageSize=${pageSize}`,
    searchName && `fullName=${searchName}`,
  ]
    .filter((query) => query)
    .join('&')

  return await _fetch.GET(`/api/patients?${searchQuery}`)
}

const createPatient = async (patientData) => await _fetch.POST('/api/patients', patientData)

const updatePatientById = async (patientData) => await _fetch.PUT(`/api/patients/${patientData._id}`, patientData)

const deletePatientById = async (patientId) => await _fetch.DELETE(`/api/patients/${patientId}`)

export { fetchPatients, createPatient, updatePatientById, deletePatientById }
