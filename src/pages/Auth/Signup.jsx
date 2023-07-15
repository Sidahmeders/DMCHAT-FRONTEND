import { useState } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  useToast,
} from '@chakra-ui/react'

import { signUpUser } from '@services/users'
import { uploadImage } from '@services/cloud'
import { CREATE_USER_NAMES } from '@config'

const initialValues = Object.values(CREATE_USER_NAMES).reduce((acc, val) => ({ ...acc, [val]: '' }), {})

const Signup = () => {
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [credentials, setCredentials] = useState(initialValues)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  const handleUploadPicture = async (e) => {
    const { name, files } = e.target
    if (files[0] === undefined) {
      return toast({ title: 'Veuillez sélectionner une image', status: 'warning' })
    }
    setIsLoading(true)
    try {
      const uploadedImage = await uploadImage(files)
      setCredentials({ ...credentials, [name]: uploadedImage.secure_url.toString() })
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const submitHandler = async () => {
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
      return toast({ title: 'Veuillez remplir tous les champs obligatoires', status: 'warning' })
    }
    if (credentials.password !== credentials.confirmPassword) {
      return toast({ title: 'Les mots de passe ne correspondent pas', status: 'warning' })
    }
    setIsLoading(true)
    try {
      await signUpUser(credentials)
      setCredentials(initialValues)
      toast({
        title: "l'utilisateur s'est inscrit avec succès",
        description: "veuillez contacter l'administrateur pour vous donner accès au système",
        duration: 15000,
        status: 'success',
      })
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl isRequired id="name">
          <FormLabel htmlFor="name">Nom</FormLabel>
          <Input
            type="text"
            name={CREATE_USER_NAMES.NAME}
            value={credentials.name}
            placeholder="entrer votre nom"
            onChange={handleChange}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="email">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name={CREATE_USER_NAMES.EMAIL}
            value={credentials.email}
            placeholder="entrer votre Email"
            onChange={handleChange}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="password">
          <FormLabel htmlFor="password">Mot de Passe</FormLabel>
          <InputGroup>
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'cacher' : 'voir'}
              </Button>
            </InputRightElement>
            <Input
              type={showPassword ? 'text' : 'password'}
              name={CREATE_USER_NAMES.PASSWORD}
              value={credentials.password}
              placeholder="mot de pass"
              onChange={handleChange}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="confirmPassword">
          <FormLabel htmlFor="confirmPassword">Confirmer Mot de Passe</FormLabel>
          <Input
            type={showPassword ? 'text' : 'password'}
            name={CREATE_USER_NAMES.CONFIRM_PASSWORD}
            value={credentials.confirmPassword}
            placeholder="confirmer mot de pass"
            onChange={handleChange}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl id="pic">
          <FormLabel htmlFor="pic">Téléchargez votre image</FormLabel>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <i className="fas fa-folder-open" />
            </InputLeftElement>

            <Input
              type="file"
              name="pic"
              accept="image/*"
              isInvalid={true}
              errorBorderColor="#eaafc8"
              sx={{
                '::file-selector-button': {
                  height: 10,
                  padding: 0,
                  mr: 4,
                  background: 'none',
                  border: 'none',
                  fontWeight: 'bold',
                },
              }}
              onChange={(e) => handleUploadPicture(e)}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={isLoading}>
        S'inscrire
      </Button>
    </Stack>
  )
}

export default Signup
