import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import AddPatientModal from './AddPatientModal'
import WaitingRoomTable from './WaitingRoomTable'
import NextAppointmentsTable from './NextAppointmentsTable'

import { HARD_CODED_DATA } from './data'

import './TodayPatientsList.scss'

const Calendar = () => {
  const [waitingRoomPatients, setWaitingRoomPatients] = useState(HARD_CODED_DATA.slice(0, 3))
  const [nextAppointmentsPatients, setNextAppointmentsPatients] = useState(HARD_CODED_DATA.slice(3))

  const onDragEnd = (props) => {
    const { draggableId, destination } = props
    const { droppableId } = destination

    if (droppableId === 'waiting-room') {
      const newNextAppointmentsPatients = nextAppointmentsPatients.filter((item) => item.id !== draggableId)
      const droppedPatient = nextAppointmentsPatients.find((item) => item.id === draggableId)

      setWaitingRoomPatients(() => [...waitingRoomPatients, droppedPatient])
      setNextAppointmentsPatients(() => newNextAppointmentsPatients)
    }
    if (droppableId === 'next-appointments') {
      const newWaitingRoomPatients = waitingRoomPatients.filter((item) => item.id !== draggableId)
      const droppedPatient = waitingRoomPatients.find((item) => item.id === draggableId)

      setNextAppointmentsPatients(() => [...nextAppointmentsPatients, droppedPatient])
      setWaitingRoomPatients(() => newWaitingRoomPatients)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="today-patients-list-page-container">
        <AddPatientModal />

        <div className="room-container">
          <WaitingRoomTable patients={waitingRoomPatients} />
          <NextAppointmentsTable patients={nextAppointmentsPatients} />
        </div>
      </div>
    </DragDropContext>
  )
}

export default Calendar
