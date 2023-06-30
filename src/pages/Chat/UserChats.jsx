import { useEffect } from 'react'
import { Avatar, Box, HStack, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react'

import { ChatState } from '@context'
import { formatDate, getSender, getSenderFull, getUser } from '@utils'
import { fetchUserChats } from '@services/chats'

import SearchUserDrawer from '@components/SearchUserDrawer'
import GroupChatModal from '@components/miscellaneous/GroupChatModal'
import LogoutButton from '@components/miscellaneous/LogoutButton'

const UserChats = () => {
  const user = getUser()
  const toast = useToast()
  const { onClose } = useDisclosure()
  const { selectedChat, setSelectedChat, chats, setChats, fetchAgain } = ChatState()

  const fetchChats = async () => {
    try {
      const allchats = await fetchUserChats()
      setChats(allchats)
      onClose()
    } catch (error) {
      toast({ description: error.message })
    }
  }

  useEffect(() => {
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
          {chats.length &&
            chats.map((chat) => {
              const sender = getSender(user, chat.users)
              const { pic } = getSenderFull(user, chat.users)
              const { content, updatedAt } = chat?.latestMessage || {}

              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat?._id === chat._id ? '#47f9' : 'gray.100'}
                  color={selectedChat?._id === chat._id ? 'white' : 'black'}
                  position="relative"
                  px="3"
                  py="2"
                  borderRadius="lg">
                  <HStack gap="2">
                    <Avatar src={!chat.isGroupChat && pic} name={chat.chatName} />
                    <Box pt="2">
                      <Text>{!chat.isGroupChat ? sender : chat.chatName}</Text>
                      <Text fontSize="small" color={selectedChat?._id === chat._id ? 'white' : 'blue.500'}>
                        {content && content.slice(0, 35)}
                      </Text>
                    </Box>
                    <Text fontSize="small" position="absolute" right="0.75rem" top="1">
                      {updatedAt && formatDate(updatedAt, 'E hh:mm')}
                    </Text>
                  </HStack>
                </Box>
              )
            })}
        </Stack>
      </Box>
    </Box>
  )
}

export default UserChats
