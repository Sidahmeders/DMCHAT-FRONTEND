import { Box } from '@chakra-ui/react'

import { ChatState } from '@context'

import SingleChat from '@components/SingleChat'
import { isEmpty } from 'lodash'

const ChatBox = () => {
  const { selectedChat } = ChatState()

  return (
    <Box
      display={{ base: !isEmpty(selectedChat) ? 'flex' : 'none', md: 'flex' }}
      alignItems="center"
      flexDir="column"
      p={3}
      boxShadow="inner"
      borderRadius="lg"
      w={{ base: '100%', md: '68%' }}>
      <SingleChat />
    </Box>
  )
}

export default ChatBox
