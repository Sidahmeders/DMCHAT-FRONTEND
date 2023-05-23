import { useForm, Controller } from 'react-hook-form'
import { AlertCircle, CheckCircle, Folder } from 'react-feather'
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

import { CREATE_PATIENT_NAMES } from '../../config'
import { ChatState } from '../../context'
import { getPatient } from '../../utils'
import { useEffect } from 'react'

export default function EditPatientModal({ isOpen, onClose, patientsList, setPatientsList }) {
  const { user } = ChatState()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted },
  } = useForm()

  const onSubmit = async (data) => {
    const response = await fetch(`/api/patient/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.status === 200) {
      const updatedPatient = await response.json()
      const updatedPatientList = patientsList.map((patient) =>
        updatedPatient._id === patient._id ? updatedPatient : patient,
      )
      setPatientsList(updatedPatientList)
      toast({
        title: 'le profil du patient a été mis à jour avec succès',
        status: 'success',
      })
      onClose()
    } else {
      toast()
    }
  }

  useEffect(() => {
    reset(getPatient())
  }, [reset, isOpen])

  return (
    <>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
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
                      <Input type="number" placeholder="Age" value={value} onChange={onChange} />
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
                  name={CREATE_PATIENT_NAMES.HISTORY}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<Folder size="1.25rem" color="gray" />} />
                      <Textarea pl="10" placeholder="Historique" value={value} onChange={onChange} />
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
    </>
  )
}