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
} from '@chakra-ui/react'

import { ChatState } from '../context'

import UserListItem from './UserAvatar/UserListItem'
import ChatLoading from './ChatLoading'

export default function SearchUserDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const { user, setSelectedChat, chats, setChats } = ChatState()

  const handleSearch = async () => {
    if (!search.trim()) {
      return toast({
        title: 'veuillez entrer quelque chose dans la recherche',
        status: 'warning',
      })
    }
    setLoading(true)

    const response = await fetch(`/api/user?search=${search}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    if (response.status !== 200) {
      return toast()
    } else {
      setSearchResult(await response.json())
    }
    setLoading(false)
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)

      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      })
      const data = await response.json()

      // If the chat already inside 'chat' state, append it
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

      setSelectedChat(data)
      setLoadingChat(false)
      onClose() // Close the side drawer
    } catch (error) {
      setLoadingChat(false)
      return toast({
        title: 'Erreur lors de la récupération du chat',
        description: error.message,
      })
    }
  }

  return (
    <>
      <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
        <Button onClick={onOpen}>trouver utilisateur</Button>
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
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
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
