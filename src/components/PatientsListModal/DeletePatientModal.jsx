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
  HStack,
  Text,
} from '@chakra-ui/react'
import { AlertTriangle } from 'react-feather'

import { getPatient } from '@utils'
import { deletePatientById } from '@services/patients'

import Loader from '../Loader/Loader'

export default function DeletePatientModal({ isOpen, onClose, setPatientsData }) {
  const toast = useToast()

  const [patient, setPatient] = useState({})
  const [canDeletePatient, setCanDeletePatient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const deletePatient = async () => {
    setIsLoading(true)
    try {
      await deletePatientById(patient._id)
      toast({
        title: `${patient.fullName} / ${patient.age} ans a été supprimé avec succès`,
        status: 'warning',
      })
      setPatientsData((patientsData) => ({
        ...patientsData,
        totalCount: patientsData.totalCount - 1,
        patients: patientsData.patients.filter((item) => patient._id !== item._id),
      }))
      setCanDeletePatient(false)
      onClose()
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setPatient(getPatient())
  }, [isOpen])

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>êtes-vous sûr de vouloir supprimer ce patient</ModalHeader>
        <ModalCloseButton p="6" />
        <Loader loading={isLoading}>
          <ModalBody>
            êtes-vous sûr de vouloir supprimer <strong>{patient.fullName}</strong> / <strong>{patient.age}</strong> ans
            <HStack color="red" mt="4">
              <AlertTriangle />
              <Text fontWeight="semibold">veuillez noter que cette action ne peut pas être annulée!</Text>
            </HStack>
          </ModalBody>
          <ModalFooter>
            {canDeletePatient ? (
              <Button type="submit" colorScheme="red" mr={3} onClick={deletePatient}>
                Supprimer définitivement
              </Button>
            ) : (
              <Button colorScheme="orange" mr={3} onClick={() => setCanDeletePatient(true)}>
                Supprimer
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setCanDeletePatient(false)
                onClose()
              }}>
              Annuler
            </Button>
          </ModalFooter>
        </Loader>
      </ModalContent>
    </Modal>
  )
}
