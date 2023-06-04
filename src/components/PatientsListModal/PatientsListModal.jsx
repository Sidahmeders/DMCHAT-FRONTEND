import { useEffect, useState, useMemo } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'

import { ChatState } from '../../context'
import { setPatient } from '../../utils'

import DataTable from '../DataTable/DataTable'
import { patientColumns } from './patientColumns'
import SearchBar from '../Searchbar/Searchbar'
import PatientFollowupsModal from '../PatientFollowupsModal/PatientFollowupsModal'
import EditPatientModal from './EditPatientModal'
import DeletePatientModal from './DeletePatientModal'
import ExpandableComponent from './ExpandableComponent'

import './PatientsListModal.scss'

export default function PatientListModal() {
  const { user } = ChatState()
  const { isOpen: isPatientsModalOpen, onOpen: onPatientsModalOpen, onClose: onPatientsModalClose } = useDisclosure()
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: ondEditModalClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
  const {
    isOpen: isPatientFollowupsModalOpen,
    onOpen: onPatientFollowupsModalOpen,
    onClose: onPatientFollowupsModalClose,
  } = useDisclosure()

  const [patientsList, setPatientsList] = useState([])
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const response = await fetch('/api/patients', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setPatientsList(await response.json())
    })()
  }, [user])

  const filteredItems = patientsList.filter((patient) => {
    const { fullName } = patient
    const textFiltered = fullName && fullName?.toLowerCase()?.includes(filterText?.toLowerCase())
    return textFiltered ? patient : false
  })

  const subHeaderComponent = useMemo(() => {
    const handleFilter = (e) => setFilterText(e.target.value)

    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }

    return <SearchBar onFilter={handleFilter} onClear={handleClear} filterText={filterText} />
  }, [filterText, resetPaginationToggle])

  return (
    <>
      <Button onClick={onPatientsModalOpen} size="sm">
        Liste des patients
      </Button>

      <Modal size="5xl" isOpen={isPatientsModalOpen} onClose={onPatientsModalClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Liste des patients</ModalHeader>
          <ModalCloseButton p="6" />
          <ModalBody>
            <DataTable
              columns={patientColumns({ onEditModalOpen, onDeleteModalOpen })}
              data={filteredItems}
              subHeaderComponent={subHeaderComponent}
              expandableRowsComponent={(props) => <ExpandableComponent user={user} {...props} />}
              onRowDoubleClicked={(row) => {
                onPatientFollowupsModalOpen()
                setPatient(row)
              }}
            />
            <PatientFollowupsModal isOpen={isPatientFollowupsModalOpen} onClose={onPatientFollowupsModalClose} />
            <EditPatientModal
              isOpen={isEditModalOpen}
              onClose={ondEditModalClose}
              patientsList={patientsList}
              setPatientsList={setPatientsList}
            />
            <DeletePatientModal
              isOpen={isDeleteModalOpen}
              onClose={onDeleteModalClose}
              patientsList={patientsList}
              setPatientsList={setPatientsList}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
