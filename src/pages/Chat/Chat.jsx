import { Box } from '@chakra-ui/react'

import { ChatState } from '@context'

import ChatBox from './ChatBox'
import UserChats from './UserChats'

export default function Chat() {
  const { user } = ChatState()

  return (
    <>
      {user && (
        <Box display="flex" justifyContent="space-between" w="100%" mt="16" h="90vh" p="1rem" pb="0">
          <UserChats />
          <ChatBox />
        </Box>
      )}
    </>
  )
}
