import { useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'

import WaitingRoomTable from './WaitingRoomTable'
import NextAppointmentsTable from './NextAppointmentsTable'
import DoneTable from './DoneTable'
import AwaitingList from './AwaitingList'
import { HARD_CODED_DATA, AWAITINGLIST_DATA } from './data'

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
  const [waitingRoomPatients, setWaitingRoomPatients] = useState(HARD_CODED_DATA.slice(0, 3))
  const [nextAppointmentsPatients, setNextAppointmentsPatients] = useState(HARD_CODED_DATA.slice(3))
  const doneAppointmentsPatients = []

  const onDragEnd = (props) => {
    const { draggableId, destination } = props
    const { droppableId } = destination || {}

    if (droppableId === 'waiting-room' && destination) {
      const newNextAppointmentsPatients = nextAppointmentsPatients.filter((item) => item.id !== draggableId)
      const droppedPatient = nextAppointmentsPatients.find((item) => item.id === draggableId)

      if (droppedPatient) {
        setWaitingRoomPatients(() => [...waitingRoomPatients, droppedPatient])
        setNextAppointmentsPatients(() => newNextAppointmentsPatients)
      }
    }

    if (droppableId === 'next-appointments' && destination) {
      const newWaitingRoomPatients = waitingRoomPatients.filter((item) => item.id !== draggableId)
      const droppedPatient = waitingRoomPatients.find((item) => item.id === draggableId)

      if (droppedPatient) {
        setNextAppointmentsPatients(() => [...nextAppointmentsPatients, droppedPatient])
        setWaitingRoomPatients(() => newWaitingRoomPatients)
      }
    }
  }

  return (
    <div className="today-patients-list-page-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="room-container">
          <WaitingRoomTable patients={waitingRoomPatients} />
          <NextAppointmentsTable patients={nextAppointmentsPatients} />
          <DoneTable patients={doneAppointmentsPatients} />
          <AwaitingList patients={AWAITINGLIST_DATA} />
        </div>
      </DragDropContext>
    </div>
  )
}
