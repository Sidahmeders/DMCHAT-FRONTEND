import { useForm, Controller } from 'react-hook-form'
import { useDisclosure } from '@chakra-ui/react'
import { AlertCircle, CheckCircle, FileText, File, Folder, Clock } from 'react-feather'
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
  Textarea,
  Stack,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'

import { CREATE_PATIENT_NAMES } from '../config'
import { ChatState } from '../context'

const initialValues = Object.values(CREATE_PATIENT_NAMES).reduce((prev, curr) => ({ ...prev, [curr]: '' }), {})

export default function AddPatientModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = ChatState()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    formState: { isSubmitted },
  } = useForm({ defaultValues: initialValues })

  const onSubmit = async (data) => {
    const response = await fetch('/api/patient', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.status === 200) {
      toast({
        title: 'nouveau patient créé avec succès',
        status: 'success',
      })
      onClose()
    } else {
      toast()
    }
  }

  return (
    <>
      <Button onClick={onOpen} size="sm">
        Ajouter patient
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Ajouter un patient avec rendez-vous</ModalHeader>
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
                  name={CREATE_PATIENT_NAMES.MOTIF}
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
                      <Input type="text" placeholder="Motif de consultation" value={value} onChange={onChange} />
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
                          String(value).length >= 1 ? (
                            <CheckCircle size="1.25rem" color="green" />
                          ) : (
                            <AlertCircle size="1.25rem" color="red" />
                          )
                        }
                      />
                      <Input type="text" placeholder="Etate général" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.DIAGNOSTIC}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<File size="1.25rem" color="gray" />} />
                      <Input type="text" placeholder="Diagnostique" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.TREATMENT_PLAN}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<FileText size="1.25rem" color="gray" />} />
                      <Textarea pl="10" placeholder="Plan de traitement" value={value} onChange={onChange} />
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

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.APPOINTMENT}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<Clock size="1.25rem" color="orange" />} />
                      <Input type="datetime-local" value={value} onChange={onChange} />
                    </InputGroup>
                  )}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                Créer patient
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
