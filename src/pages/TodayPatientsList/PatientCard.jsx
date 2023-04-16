import { useState } from 'react'
import { Text, IconButton, Button, Box, Flex, Avatar, Heading, Stack, Skeleton } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/card'
import { ChevronDown, ChevronUp, CheckCircle, MessageCircle, Flag } from 'react-feather'
import { isBoolean } from 'lodash'

import { ChatState } from '../../context'

export const LoadingCards = () => (
  <Stack mt="2">
    <Skeleton height="7.5rem" />
    <Skeleton height="7.5rem" />
    <Skeleton height="7.5rem" />
  </Stack>
)

export default function PatientCard({ patient }) {
  const { user } = ChatState()
  const [isConfirmed, setIsConfirmed] = useState(patient.isConfirmed)
  const [isLeft, setIsLeft] = useState(patient.isLeft)
  const [showCardBody, setShowCardBody] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmation = async () => {
    setIsLoading(true)
    const response = await fetch(`/api/appointment/${patient.id}/confirm`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isConfirmed }),
    })
    const confirmedPatient = await response.json()

    if (isBoolean(confirmedPatient.isConfirmed)) {
      setIsConfirmed(!isConfirmed)
    }
    setIsLoading(false)
  }

  const handleLeave = async () => {
    setIsLoading(true)
    const response = await fetch(`/api/appointment/${patient.id}/leave`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isLeft }),
    })
    const leftPatient = await response.json()

    if (isBoolean(leftPatient.isLeft)) {
      setIsLeft(!isLeft)
    }
    setIsLoading(false)
  }

  if (isLoading) return <Skeleton mt="2" height="7.5rem" />

  return (
    <Card className={`card-container ${isConfirmed && 'confirmed'} ${isLeft && 'left'}`}>
      <CardHeader mb="0" padding="0.5rem">
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={patient.fullName} src="" />
            <Box>
              <Heading size="sm">
                {patient.fullName} | {patient.age}
              </Heading>
              <Text padding="0.5">{patient.title}</Text>
            </Box>
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={showCardBody ? <ChevronUp /> : <ChevronDown />}
            onClick={() => setShowCardBody(!showCardBody)}
          />
        </Flex>
      </CardHeader>

      {showCardBody && (
        <CardBody padding="0 1.5rem">
          <p>motif: {patient.motif}</p>
          <p>Etate général: {patient.state}</p>
          <p>diagnostique: {patient.diagnostic}</p>
          <p>plan: {patient.treatmentPlan}</p>
          <p>historique: {patient.history}</p>
        </CardBody>
      )}

      <CardFooter justify="space-between" flexWrap="wrap" padding="0.5rem">
        <Button flex="4" variant="ghost" leftIcon={<CheckCircle />} onClick={handleConfirmation}>
          confirmer
        </Button>

        <Button flex="3" variant="ghost" leftIcon={<Flag />} onClick={handleLeave}>
          parti
        </Button>

        <Button flex="2" variant="ghost" pr="2" colorScheme="messenger" leftIcon={<MessageCircle />}></Button>
      </CardFooter>
    </Card>
  )
}
