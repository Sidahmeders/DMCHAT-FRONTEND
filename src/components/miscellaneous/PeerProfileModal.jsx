import propTypes from 'prop-types'
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
import { Info } from 'react-feather'

import DeleteChatModal from './DeleteChatModal'

export default function PeerProfileModal({ sender, chatId, setMessages }) {
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure()

  return (
    <>
      <HStack>
        <DeleteChatModal sender={sender} chatId={chatId} setMessages={setMessages} />
        <IconButton icon={<Info />} onClick={onProfileOpen} />
      </HStack>

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

PeerProfileModal.propTypes = {
  sender: propTypes.object,
  chatId: propTypes.string,
  setMessages: propTypes.func,
}

PeerProfileModal.defaultProps = {
  sender: {},
  chatId: '',
  setMessages: () => {},
}
