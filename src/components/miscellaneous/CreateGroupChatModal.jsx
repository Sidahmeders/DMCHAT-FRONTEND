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
import { SyncLoader } from 'react-spinners'

import { ChatState } from '@context'
import { createGroupChat } from '@services/chats'
import { searchUsers } from '@services/users'

import UserBadgeItem from './UserBadgeItem'
import GroupUserItem from './GroupUserItem'

const CreateGroupChatModal = () => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { userChats, setUserChats } = ChatState()

  const [groupChatName, setGroupChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [usersResult, setUsersResult] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e) => {
    const { value: query } = e.target
    if (query.trim().length <= 2) {
      return setUsersResult([])
    }
    setIsLoading(true)
    try {
      const matchedUsers = await searchUsers(query)
      setUsersResult(matchedUsers)
    } catch (error) {
      toast({
        title: 'Erreur est survenue!',
        description: 'Échec de charger les résultats de la recherche',
        status: 'error',
      })
    }
    setIsLoading(false)
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
      setUserChats([data, ...userChats])
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

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== deleteUser._id))
  }

  const addUserToGroup = (addUser) => {
    if (selectedUsers.indexOf(addUser) >= 0) {
      return toast({ title: 'Utilisateur déjà ajouté', status: 'warning' })
    }
    setSelectedUsers([...selectedUsers, addUser])
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
              <Input placeholder="Rechercher des utilisateurs" mb={3} onChange={handleSearch} />
            </FormControl>

            <Box display="flex" flexWrap="wrap" w="100%">
              {selectedUsers.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
              ))}
            </Box>

            {isLoading ? (
              <Box mt="8">
                <SyncLoader color="#474aff99" />
              </Box>
            ) : (
              usersResult?.map((user) => (
                <GroupUserItem key={user._id} user={user} handleFunction={() => addUserToGroup(user)} />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            {selectedUsers.length >= 2 ? (
              <Button colorScheme="blue" onClick={handleSubmit}>
                Créer un groupe
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateGroupChatModal
