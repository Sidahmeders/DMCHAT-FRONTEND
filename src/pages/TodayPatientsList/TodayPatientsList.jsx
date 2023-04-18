import { useEffect, useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { omit } from 'lodash'

import { ChatState } from '../../context'
import { APPOINTMENTS_IDS } from '../../config'

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
  const [appointmentsList, setAppointmentsList] = useState({
    [APPOINTMENTS_IDS.EXPECTED]: [],
    [APPOINTMENTS_IDS.WAITING_ROOM]: [],
    [APPOINTMENTS_IDS.IN_PROGRESS]: [],
    [APPOINTMENTS_IDS.DONE]: [],
    [APPOINTMENTS_IDS.AWAITING_LIST]: [],
  })

  const onDragEnd = (props) => {
    const { draggableId, destination, source } = props
    const { droppableId: sourceDroppableId } = source || {}
    const { droppableId: destinationDroppableId } = destination || {}

    Object.values(APPOINTMENTS_IDS).forEach((key) => {
      if (destinationDroppableId === key && destination) {
        const newPatientsList = appointmentsList[sourceDroppableId].filter((item) => item.id !== draggableId)
        const droppedPatient = appointmentsList[sourceDroppableId].find((item) => item.id === draggableId)
        if (droppedPatient) {
          setAppointmentsList({
            ...appointmentsList,
            [destinationDroppableId]: [...appointmentsList[destinationDroppableId], droppedPatient],
            [sourceDroppableId]: newPatientsList,
          })
        }
      }
    })
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

      setAppointmentsList({
        [APPOINTMENTS_IDS.EXPECTED]: expected,
        [APPOINTMENTS_IDS.WAITING_ROOM]: awaitingRoom,
        [APPOINTMENTS_IDS.IN_PROGRESS]: inProgress,
        [APPOINTMENTS_IDS.DONE]: doneList,
        [APPOINTMENTS_IDS.AWAITING_LIST]: [
          {
            id: 'id-100',
            fullName: 'Samir Benmahjoub',
            age: '35',
            motif: 'douleur 1/10',
            state: 'très bien',
            diagnostic: 'carie entre les dents',
            treatmentPlan: 'Ipsum Dolor Sit Amet',
            history: 'Ipsum Dolor',
          },
          {
            id: 'id-101',
            fullName: 'Adb Kader Lamouri',
            age: '35',
            motif: 'douleur 1/10',
            state: 'très bien',
            diagnostic: 'carie entre les dents',
            treatmentPlan: 'Ipsum Dolor Sit Amet',
            history: 'Ipsum Dolor',
          },
        ],
      })
      setIsLoading(false)
    })()
  }, [user])

  return (
    <div className="today-patients-list-page-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="room-container">
          <ExpectedAppointments isLoading={isLoading} patients={appointmentsList[APPOINTMENTS_IDS.EXPECTED]} />
          <WaitingRoomAppointments isLoading={isLoading} patients={appointmentsList[APPOINTMENTS_IDS.WAITING_ROOM]} />
          <InProgressAppointments isLoading={isLoading} patients={appointmentsList[APPOINTMENTS_IDS.IN_PROGRESS]} />
          <DoneAppointments isLoading={isLoading} patients={appointmentsList[APPOINTMENTS_IDS.DONE]} />
          <AwaitingListAppointments isLoading={isLoading} patients={appointmentsList[APPOINTMENTS_IDS.AWAITING_LIST]} />
        </div>
      </DragDropContext>
    </div>
  )
}
