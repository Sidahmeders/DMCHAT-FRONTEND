import { useEffect, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { Trash2, Edit3 } from 'react-feather'

import { ChatState } from '../../context'
import { setPatient } from '../../utils'

import DataTable from '../DataTable/DataTable'

import './PatientsListModal.scss'

export default function AddPatientModal() {
  const { user } = ChatState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [patientsList, setPatientsList] = useState([])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const response = await fetch('/api/patient', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setPatientsList(await response.json())
    })()
  }, [user])

  console.log(patientsList, 'patientsList')

  return (
    <>
      <Button onClick={onOpen} size="sm">
        Liste des patients
      </Button>

      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Liste des patients</ModalHeader>
          <ModalCloseButton p="6" />
          <ModalBody>
            <DataTable columns={patientColumns()} data={patientsList} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export const patientColumns = () => [
  {
    name: 'Nom',
    selector: ({ fullName }) => fullName,
    sortable: true,
    minWidth: '35%',
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
      }

      const onDeleteClick = () => {
        setPatient(row)
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
