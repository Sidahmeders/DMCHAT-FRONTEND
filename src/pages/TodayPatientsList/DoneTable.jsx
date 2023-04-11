import { Circle } from '@chakra-ui/react'
import { Droppable } from 'react-beautiful-dnd'

import PatientCard from './PatientCard'
import { DragWrap } from './TodayPatientsList'

export default function DoneTable({ patients }) {
  return (
    <Droppable droppableId="done-table" type="PATIENT">
      {(provided, snapshot) => (
        <div className="done-table-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">
            Rendez-vous Fini
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
