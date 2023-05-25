import { useEffect, useState, useMemo } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { Trash2, Edit3 } from 'react-feather'

import { ChatState } from '../../context'
import { setPatient } from '../../utils'

import DataTable from '../DataTable/DataTable'
import SearchBar from '../Searchbar/Searchbar'
import EditPatientModal from './EditPatientModal'
import DeletePatientModal from './DeletePatientModal'

import './PatientsListModal.scss'

export default function PatientListModal() {
  const { user } = ChatState()
  const { isOpen: isPatientsModalOpen, onOpen: onPatientsModalOpen, onClose: onPatientsModalClose } = useDisclosure()
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: ondEditModalClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
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

      <Modal size="full" isOpen={isPatientsModalOpen} onClose={onPatientsModalClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Liste des patients</ModalHeader>
          <ModalCloseButton p="6" />
          <ModalBody>
            <DataTable
              columns={patientColumns({ onEditModalOpen, onDeleteModalOpen })}
              data={filteredItems}
              subHeaderComponent={subHeaderComponent}
            />
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

const patientColumns = ({ onEditModalOpen, onDeleteModalOpen }) => [
  {
    name: 'Nom',
    selector: ({ fullName }) => fullName,
    sortable: true,
    minWidth: '35%',
  },
  {
    name: 'Téléphone',
    selector: ({ phoneNumber }) => phoneNumber || '###',
    minWidth: '250px',
  },
  {
    name: 'Date de création',
    selector: ({ createdAt }) => format(parseISO(createdAt), 'yyyy-MM-dd'),
    sortable: true,
    minWidth: '120px',
  },
  {
    name: 'Actions',
    selector: (row) => {
      const onEditClick = () => {
        setPatient(row)
        onEditModalOpen()
      }

      const onDeleteClick = () => {
        setPatient(row)
        onDeleteModalOpen()
      }

      return (
        <div className="actions-cell">
          <Edit3 onClick={onEditClick} width={20} color="#474aff" />
          <Trash2 onClick={onDeleteClick} width={20} color="#d00" />
        </div>
      )
    },
    width: '120px',
  },
]
