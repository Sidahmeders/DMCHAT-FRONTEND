import { useForm, Controller } from 'react-hook-form'
import { useDisclosure } from '@chakra-ui/react'
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

    if (response.status !== 200) {
      return toast()
    } else {
      toast({
        title: 'nouveau patient créé avec succès',
        status: 'success',
      })
      onClose()
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
          <ModalHeader>Ajouter un patient</ModalHeader>
          <ModalCloseButton />
          <form className="create-profile-form" onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Stack spacing={3}>
                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.FULL_NAME}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="text" placeholder="nom et prénom" value={value} onChange={onChange} />
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.AGE}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="number" placeholder="Age" value={value} onChange={onChange} />
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.MOTIF}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="text" placeholder="Motif de consultation" value={value} onChange={onChange} />
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.GENERAL_STATE}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="text" placeholder="Etate général" value={value} onChange={onChange} />
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.APPOINTMENT}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="datetime-local" placeholder="Fixe rendez vous" value={value} onChange={onChange} />
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.DIAGNOSTIC}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="text" placeholder="Diagnostique" value={value} onChange={onChange} />
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.TREATMENT_PLAN}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="text" placeholder="Plan de traitement" value={value} onChange={onChange} />
                  )}
                />

                <Controller
                  control={control}
                  name={CREATE_PATIENT_NAMES.HISTORY}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value } }) => (
                    <Input type="text" placeholder="Historique" value={value} onChange={onChange} />
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
