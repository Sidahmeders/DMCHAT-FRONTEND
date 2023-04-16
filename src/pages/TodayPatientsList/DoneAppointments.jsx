import { Circle } from '@chakra-ui/react'
import { Droppable } from 'react-beautiful-dnd'

import { APPOINTMENTS_IDS } from '../../config'

import PatientCard, { LoadingCards } from './PatientCard'
import { DragWrap } from './TodayPatientsList'

export default function DoneAppointments({ patients, isLoading }) {
  return (
    <Droppable droppableId={APPOINTMENTS_IDS.DONE}>
      {(provided, snapshot) => (
        <div className="done-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">
            Rendez-vous Fini
            <Circle className="circle" size="25px">
              {patients.length}
            </Circle>
          </h1>
          {isLoading ? (
            <LoadingCards />
          ) : (
            patients.map((patient, index) => (
              <DragWrap key={patient.id} id={patient.id} index={index}>
                <PatientCard patient={patient} />
              </DragWrap>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
