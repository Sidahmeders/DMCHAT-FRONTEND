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
    setLoading(true)

    // If no image selected
    if (e.target.files[0] === undefined) {
      return toast({
        title: 'Please select an image',
        status: 'warning',
      })
    }

    // Check if the type of image is jpeg or png
    if (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png') {
      try {
        const data = new FormData()
        data.append('file', e.target.files[0]) // Contains the file
        data.append('upload_preset', 'chat-app') // Upload preset in Cloudinary
        data.append('cloud_name', 'devcvus7v') // Cloud name in Cloudinary

        const response = await fetch('https://api.cloudinary.com/v1_1/devcvus7v/image/upload', {
          method: 'POST',
          body: data,
        })
        const json = await response.json()

        setCredentials({
          ...credentials,
          [e.target.name]: json.secure_url.toString(),
        })
        setLoading(false)
      } catch (error) {
        toast()
        setLoading(false)
      }
    } else {
      setLoading(false)
      return toast({
        title: 'Please select an image',
        status: 'warning',
      })
    }
  }

  const submitHandler = async () => {
    setLoading(true)

    // If anything is missing
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
      setLoading(false)
      return toast({
        title: 'Veuillez remplir tous les champs obligatoires',
        status: 'warning',
      })
    }

    // If password and confirm password doesn't match
    if (credentials.password !== credentials.confirmPassword) {
      setLoading(false)
      return toast({
        title: 'Passwords Do Not Match',
        status: 'warning',
      })
    }

    // Now submit the data
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          pic: credentials.pic,
        }),
      })
      const data = await response.json()

      toast({
        title: data.message,
        status: !data.success ? 'error' : 'success',
      })

      if (data.success) {
        setUser(data)
        setLoading(false)
        navigate('/chats')
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast()
    }
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
