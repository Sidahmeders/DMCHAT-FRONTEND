import { Box } from '@chakra-ui/react'

import { ChatState } from '@context'

import ChatBox from '@components/ChatBox'
import MyChats from '@components/MyChats'

export default function Chat() {
  const { user } = ChatState()

  return (
    <div style={{ width: '100%', marginTop: '3rem' }}>
      {user && (
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
          <MyChats />
          <ChatBox />
        </Box>
      )}
    </div>
  )
}
