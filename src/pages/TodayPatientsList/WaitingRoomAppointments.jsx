import { Circle } from '@chakra-ui/react'
import { Droppable } from 'react-beautiful-dnd'

import { APPOINTMENTS_IDS } from '../../config'

import PatientCard from './PatientCard'
import { DragWrap } from './TodayPatientsList'

export default function WaitingRoomAppointments({ patients }) {
  return (
    <Droppable droppableId={APPOINTMENTS_IDS.WAITING_ROOM}>
      {(provided, snapshot) => (
        <div className="waiting-room-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">
            Salle D'Attente
            <Circle className="circle" size="25px">
              {patients.length}
            </Circle>
          </h1>
          {patients.map((patient, index) => (
            <DragWrap key={patient.id} id={patient.id} index={index}>
              <PatientCard patient={patient} />
            </DragWrap>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
