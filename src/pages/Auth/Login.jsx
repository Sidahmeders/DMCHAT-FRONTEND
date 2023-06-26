import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'lodash'

import { setUser } from '@utils'
import { signInUser } from '@services/users'

const Login = () => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const toast = useToast()
  const navigate = useNavigate()

  const handleCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const submitHandler = async () => {
    if (!credentials.email || !credentials.password) {
      return toast({
        title: 'Veuillez remplir tous les champs obligatoires',
        status: 'warning',
      })
    }
    setLoading(true)
    try {
      const userData = await signInUser(credentials)
      if (!isEmpty(userData)) {
        setUser(userData)
        setLoading(false)
        navigate('/chats')
        toast({
          title: 'utilisateur authentifié avec succès',
          status: 'success',
        })
      }
    } catch (error) {
      toast({ title: error.message })
    }
    setLoading(false)
  }

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={credentials.email}
            placeholder="enter votre email"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired>
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
              placeholder="mot de passe"
              onChange={(e) => handleCredentials(e)}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
        Connexion
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => setCredentials({ email: 'guest@example.com', password: '12345678' })}>
        <i className="fas fa-user-alt" style={{ fontSize: '15px', marginRight: 8 }} />
        Obtenir informations d'identification
      </Button>
    </Stack>
  )
}

export default Login
