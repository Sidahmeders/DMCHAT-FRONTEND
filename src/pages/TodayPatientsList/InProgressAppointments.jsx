import { Circle } from '@chakra-ui/react'
import { Droppable } from 'react-beautiful-dnd'

import { APPOINTMENTS_IDS } from '../../config'

import PatientCard from './PatientCard'
import { DragWrap } from './TodayPatientsList'

export default function InProgressAppointments({ patients }) {
  return (
    <Droppable droppableId={APPOINTMENTS_IDS.IN_PROGRESS}>
      {(provided, snapshot) => (
        <div className="in-progress-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">
            Rendez-vous en cours
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
