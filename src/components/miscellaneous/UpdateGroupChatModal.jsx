import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Sliders } from 'react-feather'

import { ChatState } from '@context'
import { getUser } from '@utils'
import { joinGroup, leaveGroup, removeGroup } from '@services/chats'
import { searchUsers } from '@services/users'

import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'
import DeleteChatModal from './DeleteChatModal'

const UpdateGroupChatModal = ({ setFetchAgain, fetchMessages, sender, chatId, setMessages }) => {
  const user = getUser()
  const toast = useToast()
  const { selectedChat, setSelectedChat } = ChatState()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [groupChatName, setGroupChatName] = useState('')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const handleRemove = async (removeUser) => {
    // Check if group admin id !== logged in user id and user id who is trying to remove !== logged in user id
    if (selectedChat.groupAdmin._id !== user._id && removeUser._id !== user._id) {
      return toast({
        title: 'Only admins can remove someone!',
        status: 'warning',
      })
    }

    try {
      setLoading(true)
      const data = await leaveGroup(selectedChat._id, removeUser)
      // If logged in user removed himself or left the group
      removeUser._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain((prevState) => !prevState)
      fetchMessages()
      setLoading(false)
    } catch (error) {
      toast({ description: 'Failed to remove the user!' })
      setLoading(false)
    }
  }

  const handleAddUser = async (addUser) => {
    // If the user already in the group
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      return toast({
        title: 'User Already in group!',
        status: 'warning',
      })
    }

    // Check if the user admin or not
    if (selectedChat?.groupAdmin?._id !== user._id) {
      return toast({
        title: 'Only admins can add someone!',
        status: 'warning',
      })
    }

    try {
      setLoading(true)
      const data = await joinGroup(selectedChat._id, addUser)
      setSelectedChat(data)
      setFetchAgain((prevState) => !prevState)
      setLoading(false)
    } catch (error) {
      toast({ description: 'Failed to add the user!' })
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return
    try {
      setRenameLoading(true)
      const data = await removeGroup(selectedChat._id, groupChatName)
      setSelectedChat(data)
      setFetchAgain((prevState) => !prevState)
      setRenameLoading(false)
    } catch (error) {
      toast({ description: 'Failed to rename group chat!' })
      setRenameLoading(false)
    }
    setGroupChatName('')
  }

  const handleSearch = async (query) => {
    setSearch(query)

    if (!query || query === '') {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      const data = await searchUsers(search)
      setLoading(false)
      setSearchResults(data)
    } catch (error) {
      toast({ description: 'Failed to Load the Search Results' })
    }
  }

  return (
    <>
      <HStack>
        <DeleteChatModal sender={sender} chatId={chatId} setMessages={setMessages} />
        <IconButton icon={<Sliders />} onClick={onOpen} />
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader display="flex" justifyContent="center" fontSize="35px">
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb="3">
              {selectedChat.users.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb="3"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input placeholder="Add User to group" mb="1" onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResults?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
