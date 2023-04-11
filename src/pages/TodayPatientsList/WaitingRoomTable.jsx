import { Circle } from '@chakra-ui/react'
import { Droppable } from 'react-beautiful-dnd'

import PatientCard from './PatientCard'
import { DragWrap } from './TodayPatientsList'

export default function WaitingRoomTable({ patients }) {
  return (
    <Droppable droppableId="waiting-room" type="PATIENT">
      {(provided, snapshot) => (
        <div className="waiting-room-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">
            Salle D'Attente{' '}
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
