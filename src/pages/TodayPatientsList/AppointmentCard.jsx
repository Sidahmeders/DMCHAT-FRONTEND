import { useEffect, useState } from 'react'
import { Text, IconButton, Button, Box, Flex, Avatar, Heading, Stack, Skeleton } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/card'
import { ChevronDown, ChevronUp, CheckCircle, MessageCircle, Flag } from 'react-feather'
import { isBoolean } from 'lodash'
import io from 'socket.io-client'

import { ENDPOINT, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { ChatState } from '../../context'

export const LoadingCards = () => (
  <Stack mt="2">
    <Skeleton height="7.5rem" />
    <Skeleton height="7.5rem" />
    <Skeleton height="7.5rem" />
  </Stack>
)

let socket

export default function AppointmentCard({ appointment }) {
  const { user } = ChatState()
  const [isConfirmed, setIsConfirmed] = useState(appointment.isConfirmed)
  const [isLeft, setIsLeft] = useState(appointment.isLeft)
  const [showCardBody, setShowCardBody] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmation = async () => {
    setIsLoading(true)
    const response = await fetch(`/api/appointment/${appointment.id}/confirm`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isConfirmed }),
    })
    const confirmedPatient = await response.json()

    if (isBoolean(confirmedPatient.isConfirmed)) {
      socket.emit(APPOINTMENTS_EVENTS.CONFIRM_APPOINTMENT, confirmedPatient)
    }
    setIsLoading(false)
  }

  const handleLeave = async () => {
    setIsLoading(true)
    const response = await fetch(`/api/appointment/${appointment.id}/leave`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isLeft }),
    })
    const leftPatient = await response.json()

    if (isBoolean(leftPatient.isLeft)) {
      socket.emit(APPOINTMENTS_EVENTS.LEAVE_APPOINTMENT, leftPatient)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (socket === undefined) {
      socket = io(ENDPOINT)
    }

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_CONFIRMATION, (payload) => {
      if (payload._id === appointment._id) {
        setIsConfirmed(payload.isConfirmed)
      }
    })

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_LEFT, (payload) => {
      if (payload._id === appointment._id) {
        setIsLeft(payload.isLeft)
      }
    })
  }, [appointment])

  if (isLoading) return <Skeleton mt="2" height="7.5rem" />

  return (
    <Card className={`card-container ${isConfirmed && 'confirmed'} ${isLeft && 'left'}`}>
      <CardHeader mb="0" padding="0.5rem">
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={appointment.fullName} src="" />
            <Box>
              <Heading size="sm">
                {appointment.fullName} | {appointment.age}
              </Heading>
              <Text padding="0.5">{appointment.title}</Text>
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
          <p>motif: {appointment.motif}</p>
          <p>Etate général: {appointment.state}</p>
          <p>diagnostique: {appointment.diagnostic}</p>
          <p>plan: {appointment.treatmentPlan}</p>
          <p>historique: {appointment.history}</p>
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
