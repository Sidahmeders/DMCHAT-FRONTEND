import { useEffect, useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { useLocation } from 'react-router-dom'

import { APPOINTMENTS_IDS, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { flattenAppointment } from '../../utils'
import { ChatState, TodayPatientsListState } from '../../context'

import ExpectedAppointments from './ExpectedAppointments'
import WaitingRoomAppointments from './WaitingRoomAppointments'
import DoneAppointments from './DoneAppointments'

import './TodayPatientsList.scss'

export const DragWrap = ({ id, index, children }) => (
  <Draggable draggableId={id} index={index}>
    {(provided) => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        {children}
      </div>
    )}
  </Draggable>
)

export default function TodayPatientsList() {
  const { user, socket } = ChatState()
  const { pathname } = useLocation()
  const { appointmentsList, setAppointmentsList, fetchTodayAppointments } = TodayPatientsListState()
  const [isLoading, setIsLoading] = useState(false)

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
      await fetchTodayAppointments(user)
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pathname])

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentsList, setAppointmentsList])

  return (
    <div className="today-patients-list-page-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="room-container">
          <ExpectedAppointments isLoading={isLoading} appointments={appointmentsList[APPOINTMENTS_IDS.EXPECTED]} />
          <WaitingRoomAppointments
            isLoading={isLoading}
            appointments={appointmentsList[APPOINTMENTS_IDS.WAITING_ROOM]}
          />
          <DoneAppointments isLoading={isLoading} appointments={appointmentsList[APPOINTMENTS_IDS.DONE]} />
        </div>
      </DragDropContext>
    </div>
  )
}
