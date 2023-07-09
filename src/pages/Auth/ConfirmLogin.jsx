import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, useToast, Flex, Box, Input, Button, Stack, Text } from '@chakra-ui/react'

import { getConfirmationToken, setUser } from '@utils'
import { APP_ROUTES } from '@config'
import { confirmSignIn } from '@services/users'
import { Mail } from 'react-feather'

const ConfirmLogin = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const codeRef = useRef(null)
  const [OTPCode, setOTPCode] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    if (OTPCode.length !== 6) {
      return toast({ title: 'veuillez entrer les 6 chiffres', status: 'warning' })
    }
    setIsDisabled(true)
    try {
      const token = getConfirmationToken()
      const userData = await confirmSignIn({ token, otpCode: OTPCode })
      setUser(userData)
      toast({ title: 'utilisateur authentifié avec succès', status: 'success' })
      setTimeout(() => {
        window.location = APP_ROUTES.CHATS
      }, 500)
    } catch (error) {
      toast({ description: error.message })
      setTimeout(() => {
        navigate('/')
      }, 1500)
    }
  }

  const handleCodeBoxClick = () => {
    codeRef.current.focus()
  }

  const handleCodeChange = (e) => {
    const code = e.target.value
    // Ensure only numbers are entered
    if (/^\d*$/.test(code) && code.length <= 6) {
      setOTPCode(code)
    }
  }

  return (
    <Container maxWidth="md" onClick={handleCodeBoxClick}>
      <Stack mb="4">
        <Box display="flex" justifyContent="center">
          <Mail size="12rem" color="#36fd" />
        </Box>
        <Text textAlign="center" style={{ margin: 0 }} fontSize="xl" color="#36fd" fontWeight="bold">
          Vérifier votre E-mail pour le code
        </Text>
      </Stack>

      <Box>
        <Text fontSize="lg" p="2" mb="1" color="gray.400" fontWeight="medium" textAlign="center">
          Entrer le 6-chiffres code
        </Text>
        <Flex justify="space-between">
          {[...Array(6)].map((_, index) => (
            <Box
              key={index}
              w="16"
              h="16"
              mx="0.5"
              border="2px"
              borderRadius="md"
              display="flex"
              justifyContent="center"
              alignItems="center"
              fontSize="2xl"
              fontWeight="bold"
              bg={OTPCode.length > index ? 'gray.100' : 'transparent'}
              borderColor={OTPCode.length === index ? 'blue.300' : 'gray.200'}
              cursor="text">
              {OTPCode[index]}
            </Box>
          ))}
        </Flex>
        <Input
          type="text"
          maxLength="6"
          ref={codeRef}
          value={OTPCode}
          onChange={handleCodeChange}
          opacity="0"
          height="0"
        />
      </Box>
      <Button colorScheme="blue" opacity="0.9" width="100%" onClick={handleOTPSubmit} isDisabled={isDisabled}>
        Envoyer le code de vérification
      </Button>
    </Container>
  )
}

export default ConfirmLogin
