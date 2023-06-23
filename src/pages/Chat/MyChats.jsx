import { useEffect, useState } from 'react'
import { Box, HStack, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react'

import { ChatState } from '@context'
import { getSender, getUser } from '@utils'

import SearchUserDrawer from '@components/SearchUserDrawer'
import GroupChatModal from '@components/miscellaneous/GroupChatModal'
import LogoutButton from '@components/miscellaneous/LogoutButton'

const MyChats = () => {
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
    setLoggedUser(getUser())
    fetchChats()
    // eslint-disable-next-line
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      boxShadow="inner"
      borderRadius="lg"
      w={{ base: '100%', md: '30%' }}>
      <HStack p="5" gap="2" width="100%" justifyContent="space-evenly">
        <GroupChatModal />
        <SearchUserDrawer />
        <LogoutButton />
      </HStack>

      <Box display="flex" flexDir="column" p="4" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
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
