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
} from '@chakra-ui/react'

export default function AddPatientModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Ajouter patient</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un patient</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input type="text" placeholder="Nom" />
              <Input type="text" placeholder="Age" />
              <Input type="text" placeholder="Motif de consultation" />
              <Input type="text" placeholder="Etate général" />
              <Input type="datetime-local" placeholder="Fixe rendez vous" />
              <Input type="text" placeholder="Diagnostique" />
              <Input type="text" placeholder="Plan de traitement" />
              <Input type="text" placeholder="Historique" />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {}}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
