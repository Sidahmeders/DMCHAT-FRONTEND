import { useEffect, useState } from 'react'
import { useDisclosure, IconButton, Box, Flex, Heading, Stack, Skeleton, useToast } from '@chakra-ui/react'
import { Card, CardHeader } from '@chakra-ui/card'
import { Activity, ChevronDown, ChevronUp, Edit2 } from 'react-feather'
import { isBoolean } from 'lodash'

import { ChatState, AppointmentsState } from '@context'
import { setPatient } from '@utils'
import { APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '@config'
import { toggleAppointmentConfirmation, toggleAppointmentLeave } from '@services/appointments'
import { fetchPatientById } from '@services/patients'

import PatientFollowupsModal from '@components/PatientFollowupsModal/PatientFollowupsModal'
import PaymentCard from './PaymentCard'
import ConfirmSound from '../../assets/songs/confirmation-tone.wav'
import DoorBellSound from '../../assets/songs/door-bell.wav'

export const LoadingCards = () => (
  <Stack mt="2">
    <Skeleton height="3rem" />
    <Skeleton height="3rem" />
    <Skeleton height="3rem" />
  </Stack>
)

export default function AppointmentCard({ appointment, withConfirm, withPresence }) {
  const { fullName, motif } = appointment
  const { socket } = ChatState()
  const { fetchTodayAppointments } = AppointmentsState()
  const {
    isOpen: isPatientFollowupsModalOpen,
    onOpen: onPatientFollowupsModalOpen,
    onClose: onPatientFollowupsModalClose,
  } = useDisclosure()
  const toast = useToast()

  const [isConfirmed, setIsConfirmed] = useState(appointment.isConfirmed)
  const [isLeft, setIsLeft] = useState(appointment.isLeft)
  const [showPaymentCard, setShowPaymentCard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmation = async () => {
    setIsLoading(true)
    try {
      const confirmedPatient = await toggleAppointmentConfirmation(appointment.id, isConfirmed)
      if (isBoolean(confirmedPatient.isConfirmed)) {
        socket.emit(APPOINTMENTS_EVENTS.CONFIRM_APPOINTMENT, confirmedPatient)
      }
    } catch (error) {
      toast({ message: error.message })
    }
    setIsLoading(false)
  }

  const handlePresence = async () => {
    setIsLoading(true)
    try {
      const leftPatient = await toggleAppointmentLeave(appointment.id, isLeft)
      if (isBoolean(leftPatient.isLeft)) {
        socket.emit(APPOINTMENTS_EVENTS.LEAVE_APPOINTMENT, leftPatient)
      }
    } catch (error) {
      toast({ message: error.message })
    }
    setIsLoading(false)
  }

  const handleOpenEditPatient = async () => {
    setIsLoading(true)
    try {
      onPatientFollowupsModalOpen()
      const patientData = await fetchPatientById(appointment.patientId)
      setPatient(patientData)
    } catch (error) {
      toast({ error: error.message })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_CONFIRMATION, (payload) => {
      if (payload._id === appointment._id) {
        setIsConfirmed(payload.isConfirmed)
        fetchTodayAppointments()
        new Audio(ConfirmSound).play()
      }
    })

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_LEFT, (payload) => {
      if (payload._id === appointment._id) {
        setIsLeft(payload.isLeft)
        fetchTodayAppointments()
        new Audio(DoorBellSound).play()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) return <Skeleton mt="2" height="3rem" />

  return (
    <>
      <PatientFollowupsModal isOpen={isPatientFollowupsModalOpen} onClose={onPatientFollowupsModalClose} />
      <Card
        className={`card-container ${withConfirm && isConfirmed && 'confirmed'} ${withPresence && isLeft && 'left'}`}>
        <CardHeader p="1">
          <Flex spacing="4">
            <Flex flex="1" gap="2" justifyContent="space-between" alignItems="center">
              <Box pl="2">
                <Heading size="sm" display="flex">
                  {fullName} <Activity /> {motif?.name}
                </Heading>
              </Box>
              {withPresence && (
                <IconButton variant="ghost" p="0" icon={<>{isLeft ? 'A' : 'P'}</>} onClick={handlePresence} />
              )}
              {withConfirm && (
                <IconButton variant="ghost" p="0" icon={<>{isConfirmed ? 'C' : 'NC'}</>} onClick={handleConfirmation} />
              )}
            </Flex>
            <IconButton variant="ghost" icon={<Edit2 size="1rem" />} onClick={handleOpenEditPatient} />
            <IconButton
              variant="ghost"
              icon={showPaymentCard ? <ChevronUp /> : <ChevronDown />}
              onClick={() => setShowPaymentCard(!showPaymentCard)}
            />
          </Flex>
        </CardHeader>
        <PaymentCard appointmentData={appointment} showPaymentCard={showPaymentCard} />
      </Card>
    </>
  )
}
