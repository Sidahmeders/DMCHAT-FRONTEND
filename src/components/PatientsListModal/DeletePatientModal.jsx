import { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react'

import { ChatState } from '../../context'
import { getPatient } from '../../utils'

import Loader from '../Loader/Loader'

export default function DeletePatientModal({ isOpen, onClose, patientsData, setPatientsData }) {
  const { user } = ChatState()
  const toast = useToast()

  const [patient, setPatient] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const deletePatient = async () => {
    setIsLoading(true)
    const response = await fetch(`/api/patients/${patient._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    if (response.status === 200) {
      toast({
        title: `${patient.fullName} / ${patient.age} ans a été supprimé avec succès`,
        status: 'warning',
      })
      setPatientsData({
        ...patientsData,
        totalCount: patientsData.totalCount - 1,
        patients: patientsData.patients.filter((item) => patient._id !== item._id),
      })
      onClose()
    } else {
      toast()
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setPatient(getPatient())
  }, [user, isOpen])

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>êtes-vous sûr de vouloir supprimer ce patient</ModalHeader>
        <ModalCloseButton p="6" />
        <Loader loading={isLoading}>
          <ModalBody>
            <div>
              Nom: <span style={{ fontWeight: 'bold' }}>{patient.fullName}</span>
            </div>
            <div>
              Age: <span style={{ fontWeight: 'bold' }}>{patient.age}</span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="red" mr={3} onClick={deletePatient}>
              Supprimer patient
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          </ModalFooter>
        </Loader>
      </ModalContent>
    </Modal>
  )
}
