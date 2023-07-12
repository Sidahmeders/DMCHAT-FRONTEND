import { useEffect } from 'react'
import { Box, HStack, Skeleton, Stack, useDisclosure, useToast } from '@chakra-ui/react'
import { isEmpty } from 'lodash'

import { ChatState } from '@context'
import { fetchUserChats } from '@services/chats'

import UsersListDrawer from '@components/UsersListDrawer'
import GroupChatModal from '@components/miscellaneous/GroupChatModal'
import UserChatItem from '@components/miscellaneous/UserChatItem'
import LogoutButton from '@components/miscellaneous/LogoutButton'

const UsersChatLoader = () => (
  <Stack>
    <Skeleton height="67px" borderRadius="md" />
    <Skeleton height="67px" borderRadius="md" />
    <Skeleton height="67px" borderRadius="md" />
  </Stack>
)

const UserChats = () => {
  const toast = useToast()
  const { onClose } = useDisclosure()
  const { selectedChat, chats, setChats, fetchAgain } = ChatState()

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
      display={{ base: !isEmpty(selectedChat) ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      boxShadow="inner"
      borderRadius="lg"
      w={{ base: '100%', md: '30%' }}>
      <HStack p="5" gap="2" width="100%" justifyContent="space-evenly">
        <UsersListDrawer />
        <GroupChatModal />
        <LogoutButton />
      </HStack>

      <Box display="flex" flexDir="column" p="4" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        <Stack overflowY="scroll">
          {chats.length ? chats.map((chat) => <UserChatItem key={chat._id} chat={chat} />) : <UsersChatLoader />}
        </Stack>
      </Box>
    </Box>
  )
}

export default UserChats
