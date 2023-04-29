import { Box } from '@chakra-ui/react'

import { ChatState } from '../../context'
import { ChatBox, MyChats } from '../../components'

const Chat = () => {
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

export default Chat
