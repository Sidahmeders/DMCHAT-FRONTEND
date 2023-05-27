import { useEffect, useState } from 'react'
import { IconButton, Button, Box, Flex, Heading, Stack, Skeleton, InputGroup, Input } from '@chakra-ui/react'
import { Card, CardHeader, CardBody } from '@chakra-ui/card'
import { ChevronDown, ChevronUp } from 'react-feather'
import { isBoolean } from 'lodash'

import { APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { ChatState, TodayPatientsListState } from '../../context'

import ConfirmSound from '../../assets/songs/confirmation-tone.wav'
import DoorBellSound from '../../assets/songs/door-bell.wav'

export const LoadingCards = () => (
  <Stack mt="2">
    <Skeleton height="4rem" />
    <Skeleton height="4rem" />
    <Skeleton height="4rem" />
  </Stack>
)

export default function AppointmentCard({ appointment, withConfirm, withPresence }) {
  const { fullName, motif, generalState, diagnostic, treatmentPlan, payment, totalPrice } = appointment
  const { user, socket } = ChatState()
  const { fetchTodayAppointments } = TodayPatientsListState()
  const [isConfirmed, setIsConfirmed] = useState(appointment.isConfirmed)
  const [isLeft, setIsLeft] = useState(appointment.isLeft)
  const [showCardBody, setShowCardBody] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [paymentVal, setPaymentVal] = useState(payment)
  const [totalPriceVal, setTotalPriceVal] = useState(totalPrice)

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
    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_CONFIRMATION, (payload) => {
      if (payload._id === appointment._id) {
        setIsConfirmed(payload.isConfirmed)
        fetchTodayAppointments(user)
        new Audio(ConfirmSound).play()
      }
    })

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_LEFT, (payload) => {
      if (payload._id === appointment._id) {
        setIsLeft(payload.isLeft)
        fetchTodayAppointments(user)
        new Audio(DoorBellSound).play()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) return <Skeleton mt="2" height="4rem" />

  return (
    <Card className={`card-container ${withConfirm && isConfirmed && 'confirmed'} ${withPresence && isLeft && 'left'}`}>
      <CardHeader p="1">
        <Flex spacing="4">
          <Flex flex="1" gap="2" justifyContent="space-between" alignItems="center">
            <Box pl="2">
              <Heading size="sm">
                {fullName} ~ {motif}
              </Heading>
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
          <p>
            Etate: <span style={{ fontWeight: 'bold' }}>{generalState}</span>
          </p>
          <p>
            Diag: <span style={{ fontWeight: 'bold' }}>{diagnostic}</span>
          </p>
          <p>
            Plan: <span style={{ fontWeight: 'bold' }}>{treatmentPlan}</span>
          </p>
          <InputGroup gap="2">
            <InputGroup className="payments-input">
              <label>T</label>
              <Input
                type="number"
                placeholder="Prix total"
                value={totalPriceVal}
                onChange={(e) => setTotalPriceVal(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="payments-input">
              <label>V</label>
              <Input
                type="number"
                placeholder="versement"
                value={paymentVal}
                onChange={(e) => setPaymentVal(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="payments-input">
              <label>R</label>
              <Input type="number" readOnly value={totalPriceVal - paymentVal || 0} />
            </InputGroup>
          </InputGroup>
        </CardBody>
      )}
    </Card>
  )
}
