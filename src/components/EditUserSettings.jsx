import { useState } from 'react'
import {
  Input,
  Button,
  Text,
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
  FormControl,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { Settings } from 'react-feather'
import { omit } from 'lodash'

import { getUser, setUser } from '@utils'
import { CREATE_USER_NAMES } from '@config'
import { updateUser } from '@services/users'
import UploaderAvatar from './UploaderAvatar'

const EditUserSettings = () => {
  const localUser = getUser()
  const isAdmin = localUser.role === 'admin'
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [userUpdate, setUserUpdate] = useState(localUser)
  const [canUpdateUser, setCanUpdateUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserUpdate({ ...userUpdate, [name]: value })
    setCanUpdateUser(true)
  }

  const handleFileLoad = (reader) => {
    setUserUpdate({ ...userUpdate, pic: reader.result })
    setCanUpdateUser(true)
  }

  const handleSubmit = async () => {
    if (userUpdate.password !== userUpdate.confirmPassword) {
      return toast({ title: 'Les mots de passe ne correspondent pas' })
    }
    setIsLoading(true)
    try {
      await updateUser(localUser._id, userUpdate)
      setUser({ ...localUser, ...omit(userUpdate, [CREATE_USER_NAMES.PASSWORD, CREATE_USER_NAMES.CONFIRM_PASSWORD]) })
      setUserUpdate(getUser())
      setCanUpdateUser(false)
      toast({ title: 'utilisateur modifié avec succès', status: 'success' })
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const cancelUpdate = () => {
    setUserUpdate(localUser)
    setCanUpdateUser(false)
    onClose()
  }

  return (
    <>
      <Button p="0" onClick={onOpen}>
        <Settings />
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={cancelUpdate}>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>Modifier mon profil</Text>
            {isAdmin && (
              <Text fontSize="14" color="red">
                <b>REMARQUE:</b> les utilisateurs admin ne peuvent pas modifier leur email pour des raisons de sécurité
              </Text>
            )}
          </ModalHeader>
          <ModalBody>
            <HStack alignItems="flex-start">
              <UploaderAvatar src={userUpdate.pic} onLoad={handleFileLoad} />
              <FormControl>
                <Stack>
                  <Input
                    type="text"
                    id={CREATE_USER_NAMES.NAME}
                    name={CREATE_USER_NAMES.NAME}
                    value={userUpdate.name}
                    onChange={handleChange}
                  />
                  <Input
                    id={CREATE_USER_NAMES.EMAIL}
                    type="text"
                    name={CREATE_USER_NAMES.EMAIL}
                    value={userUpdate.email}
                    onChange={handleChange}
                    disabled={isAdmin}
                  />
                </Stack>

                <Stack mt="2">
                  <InputGroup>
                    <InputRightElement w="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? 'cacher' : 'voir'}
                      </Button>
                    </InputRightElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      id={CREATE_USER_NAMES.PASSWORD}
                      name={CREATE_USER_NAMES.PASSWORD}
                      value={userUpdate.password || ''}
                      placeholder="nouveau mot de passe"
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id={CREATE_USER_NAMES.CONFIRM_PASSWORD}
                    name={CREATE_USER_NAMES.CONFIRM_PASSWORD}
                    value={userUpdate.confirmPassword || ''}
                    placeholder="confirmer nouveau mot de passe"
                    onChange={handleChange}
                  />
                </Stack>
              </FormControl>
            </HStack>
          </ModalBody>
          <ModalFooter>
            {canUpdateUser && (
              <>
                <Button colorScheme="yellow" onClick={handleSubmit} isDisabled={isLoading}>
                  Sauvegarder
                </Button>
                <Button ml="2" onClick={cancelUpdate} isDisabled={isLoading}>
                  Annuler
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditUserSettings
