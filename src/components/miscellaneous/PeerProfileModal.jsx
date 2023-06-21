import { useState } from 'react'
import {
  Button,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Eye, Trash, AlertTriangle } from 'react-feather'

export default function PeerProfileModal({ sender }) {
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()

  const [canDeleteMessages, setCanDeleteMessages] = useState(false)

  const cancelDeleteMessage = () => {
    setCanDeleteMessages(false)
    onDeleteModalClose()
  }

  return (
    <>
      <HStack>
        <IconButton icon={<Trash color="red" />} onClick={onDeleteModalOpen} />
        <IconButton icon={<Eye />} onClick={onProfileOpen} />
      </HStack>

      <Modal size="xl" isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>êtes-vous sûr de vouloir supprimer l'intégralité de cette conversation?</ModalHeader>
          <ModalBody>
            <Text pl="2">
              vous êtes sur le point de supprimer toute la conversation avec <strong>{sender.name}</strong> à
              <strong> {sender.email}</strong>
            </Text>
            <HStack color="red" mt="4">
              <AlertTriangle />
              <Text fontWeight="semibold">veuillez noter que cette action ne peut pas être annulée!</Text>
            </HStack>
          </ModalBody>
          <ModalFooter>
            {!canDeleteMessages ? (
              <Button colorScheme="orange" onClick={() => setCanDeleteMessages(true)} mr="4">
                Supprimer
              </Button>
            ) : (
              <Button colorScheme="red" mr="4">
                Confirmer la suppression
              </Button>
            )}
            <Button onClick={cancelDeleteMessage}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size="xl" isOpen={isProfileOpen} onClose={onProfileClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center" fontSize="1.5rem">
            {sender.name}
          </ModalHeader>
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" objectFit="cover" boxSize="12.5rem" src={sender.pic} alt={sender.name} />
            <Text fontSize="1.25rem" mt="6">
              Email: <strong> {sender.email}</strong>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onProfileClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
