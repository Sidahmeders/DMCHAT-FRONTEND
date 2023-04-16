import { useEffect, useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { omit } from 'lodash'

import { ChatState } from '../../context'
import { AWAITINGLIST_DATA, APPOINTMENTS_IDS } from '../../config'

import ExpectedAppointments from './ExpectedAppointments'
import WaitingRoomAppointments from './WaitingRoomAppointments'
import InProgressAppointments from './InProgressAppointments'
import DoneAppointments from './DoneAppointments'
import AwaitingListAppointments from './AwaitingListAppointments'

import './TodayPatientsList.scss'

export const DragWrap = ({ id, index, children }) => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        {children}
      </div>
    )}
  </Draggable>
)

export default function TodayPatientsList() {
  const { user } = ChatState()

  const [isLoading, setIsLoading] = useState(false)
  const [expectedPatients, setExpectedPatients] = useState([])
  const [waitingRoomPatients, setWaitingRoomPatients] = useState([])
  const [inProgressPatients, setInProgressPatients] = useState([])
  const [donePatients, setDonePatients] = useState([])

  const onDragEnd = (props) => {
    const { draggableId, destination } = props
    const { droppableId } = destination || {}

    if (droppableId === APPOINTMENTS_IDS.WAITING_ROOM && destination) {
      const newNextAppointmentsPatients = inProgressPatients.filter((item) => item.id !== draggableId)
      const droppedPatient = inProgressPatients.find((item) => item.id === draggableId)

      if (droppedPatient) {
        setWaitingRoomPatients(() => [...waitingRoomPatients, droppedPatient])
        setInProgressPatients(() => newNextAppointmentsPatients)
      }
    }

    if (droppableId === APPOINTMENTS_IDS.IN_PROGRESS && destination) {
      const newWaitingRoomPatients = waitingRoomPatients.filter((item) => item.id !== draggableId)
      const droppedPatient = waitingRoomPatients.find((item) => item.id === draggableId)

      if (droppedPatient) {
        setInProgressPatients(() => [...inProgressPatients, droppedPatient])
        setWaitingRoomPatients(() => newWaitingRoomPatients)
      }
    }
  }

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setIsLoading(true)
      const response = await fetch('api/appointment/2023/04/05', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const todayAppointments = await response.json()

      const { expected, awaitingRoom, inProgress, doneList } = todayAppointments.reduce(
        (prev, appointment) => {
          const { _id: id, patient, isWaitingRoom, isInProgress, isDone } = appointment
          const appointmentBody = { id, ...patient, ...omit(appointment, 'patient') }

          if (isWaitingRoom) {
            return { ...prev, awaitingRoom: [...prev.awaitingRoom, appointmentBody] }
          }
          if (isInProgress) {
            return { ...prev, inProgress: [...prev.inProgress, appointmentBody] }
          }
          if (isDone) {
            return { ...prev, doneList: [...prev.doneList, appointmentBody] }
          }
          return { ...prev, expected: [...prev.expected, appointmentBody] }
        },
        {
          expected: [],
          awaitingRoom: [],
          inProgress: [],
          doneList: [],
        },
      )

      setExpectedPatients(expected)
      setWaitingRoomPatients(awaitingRoom)
      setInProgressPatients(inProgress)
      setDonePatients(doneList)
      setIsLoading(false)
    })()
  }, [user])

  return (
    <div className="today-patients-list-page-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="room-container">
          <ExpectedAppointments isLoading={isLoading} patients={expectedPatients} />
          <WaitingRoomAppointments isLoading={isLoading} patients={waitingRoomPatients} />
          <InProgressAppointments isLoading={isLoading} patients={inProgressPatients} />
          <DoneAppointments isLoading={isLoading} patients={donePatients} />
          <AwaitingListAppointments isLoading={isLoading} patients={AWAITINGLIST_DATA} />
        </div>
      </DragDropContext>
    </div>
  )
}
