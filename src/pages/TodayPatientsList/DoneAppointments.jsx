import { Circle } from '@chakra-ui/react'
import { Droppable } from 'react-beautiful-dnd'

import { APPOINTMENTS_IDS } from '../../config'

import PatientCard, { LoadingCards } from './AppointmentCard'
import { DragWrap } from './TodayPatientsList'

export default function DoneAppointments({ appointments, isLoading }) {
  return (
    <Droppable droppableId={APPOINTMENTS_IDS.DONE}>
      {(provided, snapshot) => (
        <div className="done-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">
            Rendez-vous Fini
            <Circle className="circle" size="25px">
              {appointments.length}
            </Circle>
          </h1>
          {isLoading ? (
            <LoadingCards />
          ) : (
            appointments.map((appointment, index) => (
              <DragWrap key={appointment.id} id={appointment.id} index={index}>
                <PatientCard appointment={appointment} />
              </DragWrap>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
