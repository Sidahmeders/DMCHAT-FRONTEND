import { useState } from 'react'
import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Skeleton,
  RadioGroup,
  Radio,
  Stack,
  Text,
  useToast,
  Button,
} from '@chakra-ui/react'
import { ChevronDown, MessageCircle } from 'react-feather'

import { ChatState } from '@context'
import { USER_ROLES } from '@config'
import { accessChat } from '@services/chats'
import { updateUser } from '@services/users'

const UserListItem = ({ user, setUsersList, onClose }) => {
  const toast = useToast()
  const { setSelectedChat, chats, setChats } = ChatState()

  const [loadingChat, setLoadingChat] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [roleValue, setRoleValue] = useState(user.role)
  const [canUpdateRole, setCanUpdateRole] = useState(false)

  const accessUserChat = async () => {
    setLoadingChat(true)
    try {
      const chatData = await accessChat(user._id)
      // If the chat already inside 'chat' state, append it
      if (!chats.find((c) => c._id === chatData._id)) setChats([chatData, ...chats])
      setSelectedChat(chatData)
      onClose()
    } catch (error) {
      toast({ title: 'Erreur lors de la récupération du chat', description: error.message })
    }
    setLoadingChat(false)
  }

  const handleRoleUpdate = async () => {
    try {
      const updatedUser = await updateUser(user._id, { role: roleValue })
      setUsersList((prevUsers) => prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const cancelUpdate = () => {
    setRoleValue(user.role)
    setCanUpdateRole(false)
  }

  if (loadingChat) return <Skeleton height="60px" mb="2" borderRadius="lg" />

  return (
    <Box bg="#E8E8E8" display="flex" alignItems="center" color="black" p="3" mb="2" borderRadius="lg">
      <Stack w="100%">
        <HStack>
          <Avatar name={user.name} src={user.pic} size="sm" mr="3" />
          <HStack w="100%" display="flex" justifyContent="space-between">
            <Text fontWeight="semibold" color="gray.600">
              {user.name}
            </Text>
            <HStack>
              <IconButton
                variant="ghost"
                height="8"
                _hover={{
                  background: '#38B2ACDD',
                  color: 'white',
                }}
                icon={<MessageCircle />}
                onClick={accessUserChat}
              />
              <IconButton variant="ghost" height="8" icon={<ChevronDown />} onClick={() => setShowMore(!showMore)} />
            </HStack>
          </HStack>
        </HStack>

        {/* TODO: ADD DELETE USER */}
        {showMore && (
          <Stack pl="1">
            <Text fontSize="14">
              <b>Email : </b>
              {user.email}
            </Text>
            <Text fontSize="14">
              <b>Accès : </b> {user.role}
            </Text>

            <RadioGroup bg="whiteAlpha.700" p="2" borderRadius="lg" onChange={setRoleValue} value={roleValue}>
              <HStack flexWrap="wrap" columnGap="6" rowGap="2">
                {USER_ROLES.map((role, index) => (
                  <Radio colorScheme="yellow" ml={index === 0 && '2'} key={role.id} value={role.value}>
                    {role.name}
                  </Radio>
                ))}
              </HStack>

              {user.role !== roleValue && (
                <Box mt="5">
                  {canUpdateRole ? (
                    <Button size="sm" colorScheme="red" onClick={handleRoleUpdate}>
                      Confirmer modification
                    </Button>
                  ) : (
                    <Button size="sm" colorScheme="orange" onClick={() => setCanUpdateRole(true)}>
                      Modifier le rôle
                    </Button>
                  )}
                  <Button size="sm" ml="2" onClick={cancelUpdate}>
                    Annuler
                  </Button>
                </Box>
              )}
            </RadioGroup>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default UserListItem
