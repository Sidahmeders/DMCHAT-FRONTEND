import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

import { setUser } from '@utils'
import { signUpUser } from '@services/users'
import { uploadImage } from '@services/cloud'

const Signup = () => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    pic: '',
  })

  const handleCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleUploadPicture = async (e) => {
    const { name, files } = e.target
    if (files[0] === undefined) {
      return toast({
        title: 'Please select an image',
        status: 'warning',
      })
    }
    setLoading(true)
    try {
      const uploadedImage = await uploadImage(files)
      setCredentials({
        ...credentials,
        [name]: uploadedImage.secure_url.toString(),
      })
      setLoading(false)
    } catch (error) {
      toast({ description: error.message })
    }
    setLoading(false)
  }

  const submitHandler = async () => {
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
      return toast({
        title: 'Veuillez remplir tous les champs obligatoires',
        status: 'warning',
      })
    }
    if (credentials.password !== credentials.confirmPassword) {
      return toast({
        title: 'Passwords Do Not Match',
        status: 'warning',
      })
    }
    setLoading(true)
    try {
      const data = await signUpUser(credentials)
      if (data.success) {
        setUser(data)
        setLoading(false)
        navigate('/chats')
      }
      toast({
        title: data.message,
        status: !data.success ? 'error' : 'success',
      })
    } catch (error) {
      toast()
    }
    setLoading(false)
  }

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl isRequired id="name">
          <FormLabel htmlFor="name">Nom</FormLabel>
          <Input
            type="text"
            name="name"
            value={credentials.name}
            placeholder="entrer votre nom"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="email">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={credentials.email}
            placeholder="entrer votre Email"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="password">
          <FormLabel htmlFor="password">Mot de Passe</FormLabel>
          <InputGroup>
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
            <Input
              type={show ? 'text' : 'password'}
              name="password"
              value={credentials.password}
              placeholder="mot de pass"
              onChange={(e) => handleCredentials(e)}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="confirmPassword">
          <FormLabel htmlFor="confirmPassword">Confirmer Mot de Passe</FormLabel>
          <InputGroup>
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
            <Input
              type={show ? 'text' : 'password'}
              name="confirmPassword"
              value={credentials.confirmPassword}
              placeholder="confirmer mot de pass"
              onChange={(e) => handleCredentials(e)}
            />
          </InputGroup>
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

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => submitHandler()}
        isLoading={loading}>
        S'inscrire
      </Button>
    </Stack>
  )
}

export default Signup
