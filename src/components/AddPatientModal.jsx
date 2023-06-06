import { useForm, Controller } from 'react-hook-form'
import { Textarea, useDisclosure } from '@chakra-ui/react'
import { AlertCircle, CheckCircle, Clipboard } from 'react-feather'
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
    const response = await fetch('/api/patients', {
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
        <ModalOverlay bg="blackAlpha.300" />
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
                      <InputLeftElement pointerEvents="none" children={<Clipboard size="1.25rem" color="gray" />} />
                      <Textarea pl="10" placeholder="Etate général" value={value} onChange={onChange} />
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
                Annuler
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
