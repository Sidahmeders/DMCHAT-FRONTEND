import { useState } from 'react'
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Trash, AlertTriangle } from 'react-feather'

import { deleteMessages } from '@services/messages'

const DeleteChatModal = ({ sender, chatId, setMessages }) => {
  const toast = useToast()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
  const [canDeleteMessages, setCanDeleteMessages] = useState(false)

  const deleteChatMessages = async () => {
    try {
      await deleteMessages(chatId)
      toast({
        title: 'Chat supprimé avec succès',
        status: 'warning',
      })
      onDeleteModalClose()
      setMessages([])
      setCanDeleteMessages(false)
    } catch (error) {
      toast()
      console.log(error)
    }
  }

  const cancelDeleteMessage = () => {
    setCanDeleteMessages(false)
    onDeleteModalClose()
  }

  return (
    <>
      <IconButton icon={<Trash color="red" />} onClick={onDeleteModalOpen} />

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
              <Button colorScheme="red" mr="4" onClick={deleteChatMessages}>
                Confirmer la suppression
              </Button>
            )}
            <Button onClick={cancelDeleteMessage}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteChatModal