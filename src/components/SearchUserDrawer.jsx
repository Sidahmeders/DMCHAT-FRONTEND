import { useState } from 'react'
import {
  Button,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Box,
  Input,
  useToast,
  Spinner,
  Stack,
  Skeleton,
} from '@chakra-ui/react'
import { Search } from 'react-feather'

import { ChatState } from '@context'
import { searchUsers } from '@services/users'
import { accessChat } from '@services/chats'

import UserListItem from './UserAvatar/UserListItem'

export default function SearchUserDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const { setSelectedChat, chats, setChats } = ChatState()

  const handleSearch = async () => {
    if (!search.trim()) {
      return toast({
        title: 'veuillez entrer quelque chose dans la recherche',
        status: 'warning',
      })
    }
    setLoading(true)
    try {
      const users = await searchUsers(search)
      setSearchResult(users)
    } catch (error) {
      toast({ description: error.message })
    }
    setLoading(false)
  }

  const accessUserChat = async (userId) => {
    setLoadingChat(true)
    try {
      const chatData = await accessChat(userId)
      // If the chat already inside 'chat' state, append it
      if (!chats.find((c) => c._id === chatData._id)) setChats([chatData, ...chats])
      setSelectedChat(chatData)
      onClose()
    } catch (error) {
      return toast({
        title: 'Erreur lors de la récupération du chat',
        description: error.message,
      })
    }
    setLoadingChat(false)
  }

  return (
    <>
      <Tooltip label="Rechercher des utilisateurs" hasArrow>
        <Button p="0" onClick={onOpen}>
          <Search />
        </Button>
      </Tooltip>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Rechercher des utilisateurs</DrawerHeader>

          <DrawerBody>
            {/* Search User */}
            <Box display="flex" pb="2">
              <Input
                placeholder="rechercher par e-mail ou nom"
                mr="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Aller</Button>
            </Box>

            {/* Polulate Search Results */}
            {loading ? (
              <Stack>
                <Skeleton height="45px" />
                <Skeleton height="45px" />
                <Skeleton height="45px" />
              </Stack>
            ) : (
              searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessUserChat(user._id)} />
              ))
            )}

            {/* if the chat has been created, don't show the loading */}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
