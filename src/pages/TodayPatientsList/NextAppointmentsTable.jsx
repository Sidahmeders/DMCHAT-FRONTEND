import { Droppable } from 'react-beautiful-dnd'

import PatientCard from './PatientCard'
import { DragWrap } from './TodayPatientsList'

export default function NextAppointmentsTable({ patients }) {
  return (
    <Droppable droppableId="next-appointments" type="PATIENT">
      {(provided, snapshot) => (
        <div className="next-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <h1 className="title">Rendez-vous Prochain</h1>
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
