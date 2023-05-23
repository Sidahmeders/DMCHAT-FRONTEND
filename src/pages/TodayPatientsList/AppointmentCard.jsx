import { useEffect, useState } from 'react'
import { Text, IconButton, Button, Box, Flex, Heading, Stack, Skeleton } from '@chakra-ui/react'
import { Card, CardHeader, CardBody } from '@chakra-ui/card'
import { ChevronDown, ChevronUp } from 'react-feather'
import { isBoolean } from 'lodash'
import io from 'socket.io-client'

import { ENDPOINT, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { ChatState, TodayPatientsListState } from '../../context'

import ConfirmSong from '../../assets/songs/confirmation-tone.wav'
import DoorBellSong from '../../assets/songs/door-bell.wav'

export const LoadingCards = () => (
  <Stack mt="2">
    <Skeleton height="4rem" />
    <Skeleton height="4rem" />
    <Skeleton height="4rem" />
  </Stack>
)

let socket

export default function AppointmentCard({ appointment, withConfirm, withPresence }) {
  const { fullName, motif, state, diagnostic, treatmentPlan, history } = appointment
  const { user } = ChatState()
  const { fetchTodayAppointments } = TodayPatientsListState()
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

  const handlePresence = async () => {
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
        fetchTodayAppointments(user)
        new Audio(ConfirmSong).play()
      }
    })

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_LEFT, (payload) => {
      if (payload._id === appointment._id) {
        setIsLeft(payload.isLeft)
        fetchTodayAppointments(user)
        new Audio(DoorBellSong).play()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) return <Skeleton mt="2" height="4rem" />

  return (
    <Card className={`card-container ${withConfirm && isConfirmed && 'confirmed'} ${withPresence && isLeft && 'left'}`}>
      <CardHeader p="2">
        <Flex spacing="4">
          <Flex flex="1" gap="2" justifyContent="space-between">
            <Box pl="2">
              <Heading size="sm">
                {fullName} ~ {motif}
              </Heading>
              <Text>
                versement:
                <span style={{ fontWeight: 'bold', color: 'orange' }}> 1200 </span>
                reste:
                <span style={{ fontWeight: 'bold', color: 'orange' }}> 2800 </span>
              </Text>
            </Box>
            {withPresence && <Button variant="ghost" leftIcon={isLeft ? 'A' : 'P'} onClick={handlePresence}></Button>}
            {withConfirm && (
              <Button variant="ghost" leftIcon={isConfirmed ? 'C' : 'NC'} onClick={handleConfirmation}></Button>
            )}
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
        <CardBody p="0.25rem 1rem" mr="0">
          <p>Etate général: {state}</p>
          <p>diagnostique: {diagnostic}</p>
          <p>plan: {treatmentPlan}</p>
          <p>historique: {history}</p>
        </CardBody>
      )}
    </Card>
  )
}
