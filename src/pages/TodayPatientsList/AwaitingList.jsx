import { Circle } from '@chakra-ui/react'
import { Droppable } from 'react-beautiful-dnd'

import PatientCard from './PatientCard'
import { DragWrap } from './TodayPatientsList'

export default function AwaitingList({ patients }) {
  return (
    <Droppable droppableId="awaiting-list" type="PATIENT">
      {(provided, snapshot) => (
        <div className="awaiting-list-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">
            Liste d'attente
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
