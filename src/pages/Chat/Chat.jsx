import { Box } from '@chakra-ui/react'
import { isEmpty } from 'lodash'

import { getUser } from '@utils'

import ChatBox from './ChatBox'
import UserChats from './UserChats'

export default function Chat() {
  const user = getUser()

  return (
    <>
      {!isEmpty(user) && (
        <Box display="flex" justifyContent="space-between" w="100%" mt="16" h="90vh" p="1rem" pb="0">
          <UserChats />
          <ChatBox />
        </Box>
      )}
    </>
  )
}
