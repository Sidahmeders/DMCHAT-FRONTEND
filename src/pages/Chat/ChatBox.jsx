import { Box } from '@chakra-ui/react'

import SingleChat from '@components/SingleChat'

const ChatBox = () => {
  return (
    <Box
      display={{ md: 'flex' }}
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
