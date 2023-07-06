import { useEffect, useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { useLocation } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

import { ChatState, AppointmentsState } from '@context'
import { flattenAppointment } from '@utils'
import { APPOINTMENTS_IDS, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '@config'
import { updateAppointment } from '@services/appointments'

import ExpectedAppointments from './ExpectedAppointments'
import WaitingRoomAppointments from './WaitingRoomAppointments'
import DoneAppointments from './DoneAppointments'
import PaymentsHistory from './PaymentsHistory'

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

const reorderAppointments = async ({ socket, appointmentsList, source, destination }) => {
  if (source.droppableId !== APPOINTMENTS_IDS.WAITING_ROOM) return
  const appointments = appointmentsList[source.droppableId]

  const sourceAppointment = appointments[source.index]
  const destinationAppointment = appointments[destination.index]

  const updatedSourceAppointment = await updateAppointment(sourceAppointment._id, { order: destination.index })
  const updatedDestinationAppointment = await updateAppointment(destinationAppointment._id, { order: source.index })

  socket.emit(APPOINTMENTS_EVENTS.REORDER_APPOINTMENT, [updatedSourceAppointment, updatedDestinationAppointment])
}

const updateAppointmentStatus = async ({ socket, appointmentsList, draggableId, source, destination }) => {
  const { droppableId: sourceDroppableId } = source || {}
  const { droppableId: destinationDroppableId } = destination || {}

  Object.values(APPOINTMENTS_IDS).forEach(async (key) => {
    if (sourceDroppableId && destinationDroppableId === key && sourceDroppableId !== destinationDroppableId) {
      const droppedAppointment = appointmentsList[sourceDroppableId].find(
        (appointment) => appointment.id === draggableId,
      )

      const updatedAppointment = await updateAppointment(droppedAppointment.id, {
        [sourceDroppableId]: false,
        [destinationDroppableId]: true,
      })

      socket.emit(APPOINTMENTS_EVENTS.DROP_APPOINTMENT, {
        draggableId,
        sourceDroppableId,
        destinationDroppableId,
        updatedAppointment,
      })
    }
  })
}

export default function TodayPatientsList() {
  const { socket } = ChatState()
  const { pathname } = useLocation()
  const toast = useToast()
  const { appointmentsList, setAppointmentsList, fetchTodayAppointments } = AppointmentsState()
  const [isLoading, setIsLoading] = useState(false)

  const onDragEnd = async (props) => {
    setIsLoading(true)
    try {
      const { draggableId, destination, source } = props

      if (source.droppableId === destination.droppableId) {
        await reorderAppointments({ socket, appointmentsList, source, destination })
      } else {
        await updateAppointmentStatus({ socket, appointmentsList, draggableId, source, destination })
      }
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        await fetchTodayAppointments()
      } catch (error) {
        toast({ description: error.message })
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

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

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_REORDERED, (updatedAppointments) => {
      const appointments = appointmentsList[APPOINTMENTS_IDS.WAITING_ROOM].map((appointment) => {
        const foundAppointment = updatedAppointments.find((item) => item._id === appointment._id)
        return foundAppointment ? flattenAppointment(foundAppointment) : appointment
      })

      setAppointmentsList({
        ...appointmentsList,
        [APPOINTMENTS_IDS.WAITING_ROOM]: appointments.sort((a, b) => a.order - b.order),
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
      <PaymentsHistory />
    </div>
  )
}
