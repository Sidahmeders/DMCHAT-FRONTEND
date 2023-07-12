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
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
} from '@chakra-ui/react'
import { AlertTriangle, ChevronDown, MessageCircle, Trash } from 'react-feather'

import { ChatState } from '@context'
import { USER_ROLES } from '@config'
import { accessChat } from '@services/chats'
import { deleteUser, updateUser } from '@services/users'

const DeleteUserModal = ({ user, isOpen, onOpen, onClose }) => {
  const toast = useToast()
  const [canDeleteUser, setCanDeleteUser] = useState(false)

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user._id)
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const handleClose = () => {
    setCanDeleteUser(false)
    onClose()
  }

  return (
    <>
      <IconButton size="sm" variant="ghost" icon={<Trash size="1.35rem" color="red" />} onClick={onOpen} />

      <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>êtes-vous sûr de vouloir supprimer cet utilisateur?</ModalHeader>
          <ModalBody>
            <Text pl="2">
              vous êtes sur le point de supprimer le utilisateur <strong>{user.name}</strong> à
              <strong> {user.email}</strong>
            </Text>
            <HStack color="red" mt="4">
              <AlertTriangle />
              <Text fontWeight="semibold">veuillez noter que cette action ne peut pas être annulée!</Text>
            </HStack>
          </ModalBody>
          <ModalFooter>
            {canDeleteUser ? (
              <Button colorScheme="red" onClick={handleDeleteUser}>
                Supprimer définitivement
              </Button>
            ) : (
              <Button colorScheme="orange" onClick={setCanDeleteUser}>
                Supprimer
              </Button>
            )}
            <Button ml="2" onClick={handleClose}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const UserListItem = ({ user, setUsersList, closeDrawer }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
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
      closeDrawer()
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
    <>
      <Box bg="#E8E8E8" display="flex" alignItems="center" color="black" p="3" mb="2" borderRadius="lg">
        <Stack w="100%">
          <HStack>
            <Avatar name={user.name} src={user.pic} size="sm" mr="3" />
            <HStack w="100%" display="flex" justifyContent="space-between">
              <Text fontWeight="semibold" fontSize="15" color="gray.600">
                {user.name}
              </Text>
              <HStack>
                <DeleteUserModal user={user} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
                <IconButton
                  size="sm"
                  variant="ghost"
                  color="#38B2AC"
                  icon={<MessageCircle size="1.35rem" />}
                  onClick={accessUserChat}
                />
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={<ChevronDown size="1.35rem" />}
                  onClick={() => setShowMore(!showMore)}
                />
              </HStack>
            </HStack>
          </HStack>

          {showMore && (
            <Stack pl="1">
              <Text fontSize="14">
                <b>Email : </b>
                {user.email}
              </Text>
              <Text fontSize="14">
                <b>Accès :</b>
              </Text>

              <RadioGroup bg="whiteAlpha.600" p="2" borderRadius="lg" onChange={setRoleValue} value={roleValue}>
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
                      <Button size="sm" colorScheme="orange" onClick={setCanUpdateRole}>
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
    </>
  )
}

export default UserListItem
