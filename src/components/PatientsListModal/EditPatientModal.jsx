import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AlertCircle, CheckCircle } from 'react-feather'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Stack,
  useToast,
  InputGroup,
  InputLeftElement,
  Textarea,
} from '@chakra-ui/react'

import { getPatient, getUser } from '@utils'
import { CREATE_PATIENT_NAMES } from '@config'
import { updatePatientById } from '@services/patients'

export default function EditPatientModal({ isOpen, onClose, patientsData, setPatientsData }) {
  const user = getUser()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const updatedPatient = await updatePatientById(data._id, data)
      const updatedPatientList = patientsData.patients.map((patient) =>
        updatedPatient._id === patient._id ? updatedPatient : patient,
      )
      setPatientsData({ ...patientsData, patients: updatedPatientList })
      toast({
        title: 'le profil du patient a été mis à jour avec succès',
        status: 'success',
      })
      onClose()
    } catch (error) {
      toast()
    }
  }

  useEffect(() => {
    const patient = getPatient()
    reset(patient)
  }, [user, reset, isOpen])

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Modifier un patient</ModalHeader>
        <ModalCloseButton p="6" />
        <form className="create-profile-form" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Stack spacing={3}>
              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.FULL_NAME}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        String(value).length >= 1 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="text" placeholder="nom et prénom" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />

              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.AGE}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        String(value).length >= 1 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="number" min={1} max={120} placeholder="Age" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />

              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.PHONE_NUMBER}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        String(value).length >= 1 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="tel" placeholder="numéro de téléphone" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />
              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.GENERAL_STATE}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        value?.length >= 2 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Textarea pl="10" placeholder="Etate général" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              Modifier patient
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
