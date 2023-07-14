import { Box, HStack, Skeleton, Stack } from '@chakra-ui/react'
import { isEmpty } from 'lodash'

import { ChatState } from '@context'

import UsersListDrawer from '@components/UsersListDrawer/UsersListDrawer'
import CreateGroupChatModal from '@components/miscellaneous/CreateGroupChatModal'
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
  const { selectedChat, userChats, isLoadingUserChats } = ChatState()

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
        <CreateGroupChatModal />
        <LogoutButton />
      </HStack>

      <Box display="flex" flexDir="column" p="4" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        <Stack overflowY="scroll">
          {isLoadingUserChats ? (
            <UsersChatLoader />
          ) : (
            userChats.map((chat) => <UserChatItem key={chat._id} chat={chat} />)
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default UserChats
