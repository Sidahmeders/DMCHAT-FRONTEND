import { useState } from 'react'
import { Container, InputGroup, InputLeftElement, Input, Button, Stack, Text, useToast, HStack } from '@chakra-ui/react'
import { Mail } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'

import Timer from '@components/Timer'

const ForgetPassword = () => {
  const toast = useToast()
  const {
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm()

  const [seconds, setSeconds] = useState(60)

  const submitRestPassword = (data) => {
    try {
      console.log(data, 'DATA++')
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const onErrors = (errors) => toast({ title: errors.email.message, status: 'warning' })

  const resendInstructions = () => {
    console.log(getValues(), 'DATA--')
    setSeconds(60)
  }

  return (
    <Container maxWidth="xl">
      {isSubmitSuccessful ? (
        <Stack gap="4">
          <Text fontSize="lg">
            veuillez vérifier votre boîte de réception et vous devriez recevoir un lien de réinitialisation de mot de
            passe à: <strong>{getValues().email}</strong>
          </Text>

          <HStack>
            <Text>une fois votre mot de passe réinitialisé, vous pouvez: </Text>
            <Button variant="link">
              <Link to="/">revenir à la connexion</Link>
            </Button>
          </HStack>

          <Text color="orange">
            si vous n'avez pas reçu les instructions, assurez-vous d'avoir entré le bon e-mail ou cliquez sur Renvoyer
            les instructions après <strong>1:00 min</strong>
          </Text>
          <Button color="orange" onClick={resendInstructions} isDisabled={seconds > 0}>
            Renvoyer l'instruction {seconds > 0 ? <Timer seconds={seconds} setSeconds={setSeconds} /> : null}
          </Button>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(submitRestPassword, onErrors)}>
          <Stack>
            <Controller
              control={control}
              name="email"
              defaultValue=""
              rules={{
                required: 'remplissez votre email svp',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'votre adresse email est invalide',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<Mail size="1.25rem" color="gray" />} />
                  <Input
                    type="email"
                    min={1}
                    max={120}
                    placeholder="veuillez entrer votre email.."
                    value={value}
                    onChange={onChange}
                  />
                </InputGroup>
              )}
            />

            <Button type="submit" colorScheme="purple" isDisabled={isSubmitting}>
              Envoyer des instructions
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  )
}

export default ForgetPassword
