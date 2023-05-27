import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { LogOut } from 'react-feather'

import { ChatState } from '../context'
import { getSender } from '../utils'

import GroupChatModal from './miscellaneous/GroupChatModal'
import SearchUserDrawer from './SearchUserDrawer'

const MyChats = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { onClose } = useDisclosure()
  const { selectedChat, setSelectedChat, user, chats, setChats, fetchAgain } = ChatState()

  const [loggedUser, setLoggedUser] = useState()

  const fetchChats = async () => {
    try {
      const response = await fetch(`/api/chat`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.status === 200) {
        setChats(await response.json())
        onClose()
      }
    } catch (error) {
      return toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
    fetchChats()
    // eslint-disable-next-line
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px">
      <Box pb={3} px={3} display="flex" w="100%" justifyContent="space-between" alignItems="center">
        <GroupChatModal>
          <Button display="flex">nouveau group</Button>
        </GroupChatModal>

        <SearchUserDrawer />

        <LogOut
          style={{ cursor: 'pointer' }}
          onClick={() => {
            localStorage.removeItem('userInfo')
            navigate('/')
          }}
        />
      </Box>

      <Box display="flex" flexDir="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        <Stack overflowY="scroll">
          {chats?.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat?._id === chat._id ? '#38B2AC' : '#E8E8E8'}
              color={selectedChat?._id === chat._id ? 'white' : 'black'}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}>
              <Text>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default MyChats
