import { useEffect, useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { omit } from 'lodash'
import io from 'socket.io-client'

import { ENDPOINT, APPOINTMENTS_IDS, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { ChatState } from '../../context'

import ExpectedAppointments from './ExpectedAppointments'
import WaitingRoomAppointments from './WaitingRoomAppointments'
import InProgressAppointments from './InProgressAppointments'
import DoneAppointments from './DoneAppointments'
import AwaitingListAppointments from './AwaitingListAppointments'

import './TodayPatientsList.scss'

const flattenAppointment = (appointment) => {
  const { _id: id, patient } = appointment
  return { id, ...patient, ...omit(appointment, 'patient') }
}

export const DragWrap = ({ id, index, children }) => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        {children}
      </div>
    )}
  </Draggable>
)

let socket

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

    Object.values(APPOINTMENTS_IDS).forEach(async (key) => {
      if (sourceDroppableId && destinationDroppableId === key && sourceDroppableId !== destinationDroppableId) {
        setIsLoading(true)
        const droppedAppointment = appointmentsList[sourceDroppableId].find(
          (appointment) => appointment.id === draggableId,
        )
        const response = await fetch(`/api/appointment/${droppedAppointment.id}/update`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [sourceDroppableId]: false,
            [destinationDroppableId]: true,
          }),
        })

        if (droppedAppointment && response.status === 200) {
          const updatedAppointment = await response.json()
          socket.emit(APPOINTMENTS_EVENTS.DROP_APPOINTMENT, {
            draggableId,
            sourceDroppableId,
            destinationDroppableId,
            updatedAppointment,
          })
        }
        setIsLoading(false)
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
          const { isWaitingRoom, isInProgress, isDone } = appointment
          const flatAppointment = flattenAppointment(appointment)

          if (isWaitingRoom) {
            return { ...prev, awaitingRoom: [...prev.awaitingRoom, flatAppointment] }
          }
          if (isInProgress) {
            return { ...prev, inProgress: [...prev.inProgress, flatAppointment] }
          }
          if (isDone) {
            return { ...prev, doneList: [...prev.doneList, flatAppointment] }
          }
          return { ...prev, expected: [...prev.expected, flatAppointment] }
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

  useEffect(() => {
    if (socket === undefined) {
      socket = io(ENDPOINT)
    }

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_DROPPED, (payload) => {
      const { draggableId, sourceDroppableId, destinationDroppableId, updatedAppointment } = payload
      setAppointmentsList({
        ...appointmentsList,
        [sourceDroppableId]: appointmentsList[sourceDroppableId].filter(
          (appointment) => appointment.id !== draggableId,
        ),
        [destinationDroppableId]: [...appointmentsList[destinationDroppableId], flattenAppointment(updatedAppointment)],
      })
    })
  }, [appointmentsList])

  return (
    <div className="today-patients-list-page-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="room-container">
          <ExpectedAppointments isLoading={isLoading} appointment={appointmentsList[APPOINTMENTS_IDS.EXPECTED]} />
          <WaitingRoomAppointments
            isLoading={isLoading}
            appointment={appointmentsList[APPOINTMENTS_IDS.WAITING_ROOM]}
          />
          <InProgressAppointments isLoading={isLoading} appointment={appointmentsList[APPOINTMENTS_IDS.IN_PROGRESS]} />
          <DoneAppointments isLoading={isLoading} appointment={appointmentsList[APPOINTMENTS_IDS.DONE]} />
          <AwaitingListAppointments
            isLoading={isLoading}
            appointment={appointmentsList[APPOINTMENTS_IDS.AWAITING_LIST]}
          />
        </div>
      </DragDropContext>
    </div>
  )
}
