import {
  Avatar,
  Input,
  Button,
  Box,
  HStack,
  Stack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react'
import { Settings } from 'react-feather'

import { getUser } from '@utils'
import { useState } from 'react'
// import { updateUser } from '@services/users'

const EditUserSettings = () => {
  const localUser = getUser()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [userUpdate, setUserUpdate] = useState(localUser)
  const isAdmin = localUser.role === 'admin'

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserUpdate({ ...userUpdate, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      // await updateUser(localUser._id, userUpdate)
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const cancelUpdate = () => {
    setUserUpdate(localUser)
    onClose()
  }

  return (
    <>
      <Button p="0" onClick={onOpen}>
        <Settings />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Modifier mon profil</ModalHeader>
          <ModalBody>
            <Stack>
              <HStack>
                <Avatar cursor="pointer" src={localUser.pic} />
                <Input type="text" name="name" value={userUpdate.name} onChange={handleChange} />
              </HStack>
              <Box pl="14">
                <Input type="text" name="email" value={userUpdate.email} onChange={handleChange} disabled={isAdmin} />
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="yellow" onClick={handleSubmit}>
              Sauvegarder
            </Button>
            <Button ml="2" onClick={cancelUpdate}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditUserSettings
