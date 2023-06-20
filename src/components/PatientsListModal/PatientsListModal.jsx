import { useEffect, useState, useMemo } from 'react'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Users } from 'react-feather'

import { ChatState } from '../../context'
import { setPatient } from '../../utils'
import { PAGINATION_ROWS_PER_PAGE_OPTIONS } from '../../config'

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

  const [patientsData, setPatientsData] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_ROWS_PER_PAGE_OPTIONS[0])
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setIsLoading(true)
      const response = await fetch(`/api/patients?page=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.status === 200) {
        setPatientsData(await response.json())
      }
      setIsLoading(false)
    })()
  }, [pageNumber, pageSize, user])

  const filteredItems = patientsData.patients?.filter((patient) => {
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
      <Users onClick={onPatientsModalOpen} color="orange" />

      <Modal size="5xl" isOpen={isPatientsModalOpen} onClose={onPatientsModalClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Liste des patients</ModalHeader>
          <ModalCloseButton p="6" />
          <ModalBody>
            <DataTable
              paginationServer
              loading={isLoading}
              columns={patientColumns({ onEditModalOpen, onDeleteModalOpen })}
              data={filteredItems}
              subHeaderComponent={subHeaderComponent}
              expandableRowsComponent={(props) => <ExpandableComponent user={user} {...props} />}
              paginationTotalRows={patientsData.totalCount}
              paginationRowsPerPageOptions={PAGINATION_ROWS_PER_PAGE_OPTIONS}
              onChangePage={(page) => setPageNumber(page)}
              onChangeRowsPerPage={(currentRowsPerPage) => setPageSize(currentRowsPerPage)}
              paginationPerPage={pageSize}
              onRowDoubleClicked={(row) => {
                onPatientFollowupsModalOpen()
                setPatient(row)
              }}
            />
            <PatientFollowupsModal isOpen={isPatientFollowupsModalOpen} onClose={onPatientFollowupsModalClose} />
            <EditPatientModal
              isOpen={isEditModalOpen}
              onClose={ondEditModalClose}
              patientsData={patientsData}
              setPatientsData={setPatientsData}
            />
            <DeletePatientModal
              isOpen={isDeleteModalOpen}
              onClose={onDeleteModalClose}
              patientsData={patientsData}
              setPatientsData={setPatientsData}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
