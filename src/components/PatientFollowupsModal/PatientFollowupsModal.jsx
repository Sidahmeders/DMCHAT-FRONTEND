import { useEffect, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Button,
} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { ChevronDown, ChevronUp } from 'react-feather'

import { ChatState } from '../../context'
import { getPatient } from '../../utils'
import Loader from '../Loader/Loader'
import PatientEditBody from './PatientEditBody'

import './PatientFollowupsModal.scss'

export default function PatientFollowupsModal({ isOpen, onClose }) {
  const { user } = ChatState()
  const patient = getPatient()

  const [appointments, setAppointments] = useState([])
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await fetch(`/api/appointment/${patient._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.status === 200) {
        const appointmenstData = await response.json()
        const groupedAppointments = appointmenstData.reduce((prevAppointments, appointment) => {
          if (appointment.isNewTreatment) {
            return [...prevAppointments, [appointment]]
          }
          const lastGroup = prevAppointments[prevAppointments.length - 1] || []
          return [...prevAppointments.slice(0, -1), [...lastGroup, appointment]]
        }, [])

        setAppointments(groupedAppointments)
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen])

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent className="patient-followups-modal-container">
        <ModalHeader>
          <Box display="flex" alignItems="center">
            <span style={{ paddingRight: '1rem' }}>
              {patient.fullName} / {patient.age} ans
            </span>
            <button className="toggle-edit-patient" onClick={() => setIsEditPatientOpen(!isEditPatientOpen)}>
              {isEditPatientOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </Box>
          {isEditPatientOpen ? <PatientEditBody patient={patient} /> : null}
        </ModalHeader>
        <ModalCloseButton p="6" />
        <ModalBody className="patient-followups-modal-body">
          <Loader loading={isLoading}>
            {appointments.map((appointmentsGroup, index) => (
              <table key={index}>
                <caption>
                  Motif: <span>{appointmentsGroup[0].motif}</span>
                  <br />
                  Plan: <span>{appointmentsGroup[0].treatmentPlan}</span>
                </caption>
                <thead>
                  <tr>
                    <th>titre</th>
                    <th>versement</th>
                    <th>est fini</th>
                    <th>date de création</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => console.log(e.target.innerText, '2')}>
                      {appointmentsGroup[0].title}
                    </th>
                    <th
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => console.log(e.target.innerText, '3')}>
                      {appointmentsGroup[0].totalPrice}
                    </th>
                    <th>
                      {appointmentsGroup.reduce((count, appointment) => (appointment.isDone ? count + 1 : count), 0)}
                    </th>
                    <th
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => console.log(e.target.innerText, '1')}>
                      {format(parseISO(appointmentsGroup[0].createdAt), 'yyyy-MM-dd')}
                    </th>
                  </tr>

                  {appointmentsGroup.map((appointment) => {
                    const { _id, createdAt, title, payment, isDone } = appointment
                    return (
                      <tr key={_id}>
                        <td
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => console.log(e.target.innerText, '5')}>
                          {title}
                        </td>
                        <td
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => console.log(e.target.innerText, '6')}>
                          {payment}
                        </td>
                        <td>{isDone ? 'Oui' : 'No'}</td>
                        <td
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => console.log(e.target.innerText, '4')}>
                          {format(parseISO(createdAt), 'yyyy-MM-dd')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <Button type="submit" colorScheme="orange" mr={3}>
                        Sauvegarder rendez-vous
                      </Button>
                      <Button variant="ghost" onClick={() => {}}>
                        Annuler
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            ))}
          </Loader>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
