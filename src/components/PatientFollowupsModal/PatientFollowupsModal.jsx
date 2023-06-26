import { useEffect, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  useToast,
  Button,
} from '@chakra-ui/react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { getPatient } from '@utils'

import Loader from '../Loader/Loader'
import PatientEditBody from './PatientEditBody'
import AppointmentTable from './AppointmentTable'

import './PatientFollowupsModal.scss'
import { fetchPatientAppointments } from '@services/appointments'

export default function PatientFollowupsModal({ isOpen, onClose }) {
  const toast = useToast()
  const patient = getPatient()

  const [appointments, setAppointments] = useState([])
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!patient._id) return
      setIsLoading(true)
      try {
        const patientAppointments = await fetchPatientAppointments(patient._id)
        setAppointments(patientAppointments)
      } catch (error) {
        toast({ description: error.message })
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />
      <ModalContent className="patient-followups-modal-container">
        <ModalHeader>
          <Box display="flex" alignItems="center">
            <span style={{ paddingRight: '1rem' }}>
              {patient.fullName} / {patient.age} ans
            </span>
            <Button variant="ghost" height="8" mt="0.5" px="3" onClick={() => setIsEditPatientOpen(!isEditPatientOpen)}>
              {isEditPatientOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </Box>
          {isEditPatientOpen ? <PatientEditBody onClose={() => setIsEditPatientOpen(false)} /> : null}
        </ModalHeader>
        <ModalCloseButton p="6" />
        <ModalBody className="patient-followups-modal-body">
          {appointments.length ? (
            <Loader loading={isLoading}>
              {appointments
                .reduce((prevAppointments, appointment) => {
                  if (appointment.isNewTreatment) {
                    return [...prevAppointments, [appointment]]
                  }
                  const lastGroup = prevAppointments[prevAppointments.length - 1] || []
                  return [...prevAppointments.slice(0, -1), [...lastGroup, appointment]]
                }, [])
                .map((appointmentsGroup, index) => (
                  <AppointmentTable
                    key={index}
                    appointments={appointments}
                    setAppointments={setAppointments}
                    appointmentsGroup={appointmentsGroup}
                  />
                ))}
            </Loader>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
