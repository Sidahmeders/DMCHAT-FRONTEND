import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Plus } from 'react-feather'

import { ChatState } from '@context'
import { createGroupChat } from '@services/chats'

import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'
import { searchUsers } from '@services/users'

const GroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { chats, setChats } = ChatState()

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query || query === '') {
      setSearchResults([])
      return
    }
    setLoading(true)
    try {
      const data = await searchUsers(search)
      setSearchResults(data)
    } catch (error) {
      toast({
        title: 'Erreur est survenue!',
        description: 'Impossible de charger les résultats de la recherche',
        status: 'error',
      })
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      return toast({
        title: 'Veuillez remplir tous les champs obligatoires',
        status: 'warning',
      })
    }

    try {
      const data = await createGroupChat(groupChatName, selectedUsers)
      setChats([data, ...chats])
      onClose()
      toast({
        title: 'Nouvelle discussion de groupe créée!',
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Erreur est survenue!',
        description: 'Échec de la création du chat!',
        status: 'error',
      })
    }
  }

  const handleDelete = (deletedUser) => {
    setSelectedUsers(selectedUsers.filter((selected) => selected._id !== deletedUser._id))
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast({
        title: 'Utilisateur déjà ajouté',
        status: 'warning',
      })
    }
    setSelectedUsers([...selectedUsers, userToAdd])
  }

  return (
    <>
      <Tooltip label="Créer une groupe" hasArrow>
        <Button p="0" onClick={onOpen}>
          <Plus />
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer une discussion de groupe</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder="Nom du chat" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder="Rechercher des utilisateurs" mb={3} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            {/* Selected users */}
            <Box display="flex" flexWrap="wrap" w="100%">
              {selectedUsers.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
              ))}
            </Box>

            {loading ? (
              <div>Loading</div>
            ) : (
              searchResults?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Créer un groupe
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
