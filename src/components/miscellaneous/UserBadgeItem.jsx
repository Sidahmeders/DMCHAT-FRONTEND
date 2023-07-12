import { Box, Badge } from '@chakra-ui/react'
import { X } from 'react-feather'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      display="flex"
      alignItems="center"
      onClick={handleFunction}>
      <Box mr="2">{user.name}</Box>
      <X size="0.75rem" />
    </Badge>
  )
}

export default UserBadgeItem
