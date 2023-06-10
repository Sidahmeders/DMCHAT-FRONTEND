import { useState } from 'react'
import { Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'

import { ADD_APPOINTMENT_NAMES } from '../../config'

export default function AppointmentTable({ appointmentsGroup }) {
  const [baseAppointment] = appointmentsGroup
  const totalPayments = appointmentsGroup.reduce((total, appointment) => total + appointment.payment, 0)
  const paymentLeft = baseAppointment.totalPrice - totalPayments || '0'
  const doneAppointments = appointmentsGroup.reduce((count, appointment) => (appointment.isDone ? count + 1 : count), 0)
  const [canShowSaveBtn, setCanShowSaveBtn] = useState(false)

  const onInputHandler = (e, appointmentId, name) => {
    setCanShowSaveBtn(true)
    console.log(name, appointmentId, e.target.innerText)
  }

  return (
    <table>
      <caption>
        <p style={{ padding: '0.25rem 1rem' }}>
          Reste: <span>{paymentLeft}</span> / Motif: <span>{baseAppointment.motif}</span>
        </p>
        <Accordion allowMultiple display="flex">
          <AccordionItem width="50%" borderRight="1px solid #ddd">
            <AccordionButton>
              Diagnostic
              <AccordionIcon ml="auto" />
            </AccordionButton>
            <AccordionPanel>
              <span style={{ whiteSpace: 'pre-line' }}>{baseAppointment.diagnostic}</span>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="50%" borderRight="1px solid #ddd" borderBottom="0">
            <AccordionButton>
              Plan de traitement
              <AccordionIcon ml="auto" />
            </AccordionButton>
            <AccordionPanel>
              <span style={{ whiteSpace: 'pre-line' }}>{baseAppointment.treatmentPlan}</span>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </caption>
      <thead>
        <tr>
          <th>acte</th>
          <th>versement / prix-total</th>
          <th>est fini</th>
          <th>date de création</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onInputHandler(e, baseAppointment._id, ADD_APPOINTMENT_NAMES.TITLE)}>
            {baseAppointment.title}
          </th>
          <th>
            <span
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onInputHandler(e, baseAppointment._id, ADD_APPOINTMENT_NAMES.PAYMENT)}
              style={{ minWidth: '', padding: '2px 8px', outlineColor: '#587ee9' }}>
              {baseAppointment.payment}
            </span>
            /
            <span
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onInputHandler(e, baseAppointment._id, ADD_APPOINTMENT_NAMES.TOTAL_PRICE)}
              style={{ minWidth: '', padding: '2px 8px', outlineColor: '#587ee9' }}>
              {baseAppointment.totalPrice}
            </span>
          </th>
          <th>
            {doneAppointments} / {appointmentsGroup.length}
          </th>
          <th>{format(parseISO(baseAppointment.createdAt), 'yyyy-MM-dd')}</th>
        </tr>

        {appointmentsGroup.map((appointment, index) => {
          if (index === 0) return null
          const { _id, createdAt, title, payment, isDone } = appointment

          return (
            <tr key={_id}>
              <td
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onInputHandler(e, _id, ADD_APPOINTMENT_NAMES.TITLE)}>
                {title}
              </td>
              <td
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onInputHandler(e, _id, ADD_APPOINTMENT_NAMES.PAYMENT)}>
                {payment || '0'}
              </td>
              <td>{isDone ? 'Oui' : 'No'}</td>
              <td>{format(parseISO(createdAt), 'yyyy-MM-dd')}</td>
            </tr>
          )
        })}
      </tbody>
      {canShowSaveBtn && (
        <tfoot>
          <tr>
            <td style={{ border: 'none', padding: '1rem 0' }}>
              <Button type="submit" colorScheme="orange" mr={3}>
                Sauvegarder rendez-vous
              </Button>
              <Button variant="ghost" onClick={() => setCanShowSaveBtn(false)}>
                Annuler
              </Button>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  )
}
