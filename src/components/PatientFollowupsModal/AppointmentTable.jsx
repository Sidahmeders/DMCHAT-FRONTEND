import { useState, useRef } from 'react'
import { Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { X } from 'react-feather'

import { ADD_APPOINTMENT_NAMES } from '../../config'

import SubAppointment from './SubAppointment'

export default function AppointmentTable({ appointmentsGroup }) {
  const [baseAppointment] = appointmentsGroup
  const totalPayments = appointmentsGroup.reduce((total, appointment) => total + appointment.payment, 0)
  const paymentLeft = baseAppointment.totalPrice - totalPayments || '0'
  const doneAppointments = appointmentsGroup.reduce((count, appointment) => (appointment.isDone ? count + 1 : count), 0)

  const [canShowSaveBtn, setCanShowSaveBtn] = useState(false)
  const [canShowResetBtn, setCanShowResetBtn] = useState(false)
  const [treatmentUpdate, setTreatmentUpdate] = useState({})

  const baseTitleRef = useRef(baseAppointment.title)
  const basePaymentRef = useRef(baseAppointment.payment || '0')
  const baseTotalPriceRef = useRef(baseAppointment.totalPrice)

  const onInputEditHandler = (e, appointmentId, name) => {
    setCanShowSaveBtn(true)
    setTreatmentUpdate({
      ...treatmentUpdate,
      [appointmentId]: {
        ...treatmentUpdate[appointmentId],
        [name]: e.target.innerText,
      },
    })
  }

  const saveUpdateHandler = () => {
    console.log(treatmentUpdate, 'treatmentUpdate')
  }

  const cancelUpdateHandler = () => {
    setCanShowSaveBtn(false)
    setTreatmentUpdate({})
  }

  const resetContentEditable = () => {
    setCanShowResetBtn(false)

    const { _id: baseAppointmentId } = baseAppointment
    setTreatmentUpdate({
      ...treatmentUpdate,
      [baseAppointmentId]: {
        [ADD_APPOINTMENT_NAMES.TITLE]: baseAppointment.title,
        [ADD_APPOINTMENT_NAMES.TOTAL_PRICE]: baseAppointment.totalPrice,
        [ADD_APPOINTMENT_NAMES.PAYMENT]: baseAppointment.payment,
      },
    })

    baseTitleRef.current.innerText = baseAppointment.title
    basePaymentRef.current.innerText = baseAppointment.payment || '0'
    baseTotalPriceRef.current.innerText = baseAppointment.totalPrice
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
            onInput={(e) => {
              setCanShowResetBtn(true)
              onInputEditHandler(e, baseAppointment._id, ADD_APPOINTMENT_NAMES.TITLE)
            }}
            ref={baseTitleRef}>
            {baseAppointment.title}
          </th>
          <th>
            <span
              style={{ display: 'inline-block', width: '65px', outlineColor: '#587ee9' }}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                setCanShowResetBtn(true)
                onInputEditHandler(e, baseAppointment._id, ADD_APPOINTMENT_NAMES.PAYMENT)
              }}
              ref={basePaymentRef}>
              {baseAppointment.payment}
            </span>{' '}
            /{' '}
            <span
              style={{ display: 'inline-block', width: '85px', outlineColor: '#587ee9' }}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                setCanShowResetBtn(true)
                onInputEditHandler(e, baseAppointment._id, ADD_APPOINTMENT_NAMES.TOTAL_PRICE)
              }}
              ref={baseTotalPriceRef}>
              {baseAppointment.totalPrice}
            </span>
          </th>
          <th>
            {doneAppointments} / {appointmentsGroup.length}
          </th>
          <th>{format(parseISO(baseAppointment.createdAt), 'yyyy-MM-dd')}</th>
          {canShowResetBtn && (
            <th style={{ padding: '0', width: '35px' }}>
              <Button variant="ghost" p="0" onClick={resetContentEditable}>
                <X color="orange" size="1.5rem" />
              </Button>
            </th>
          )}
        </tr>

        {appointmentsGroup.map((appointment, index) =>
          index > 0 ? (
            <SubAppointment
              key={index}
              appointment={appointment}
              onInputEditHandler={onInputEditHandler}
              treatmentUpdate={treatmentUpdate}
              setTreatmentUpdate={setTreatmentUpdate}
            />
          ) : null,
        )}
      </tbody>
      {canShowSaveBtn && (
        <tfoot>
          <tr>
            <td style={{ border: 'none', padding: '1rem 0' }}>
              <Button type="submit" colorScheme="orange" mr={3} onClick={saveUpdateHandler}>
                Sauvegarder rendez-vous
              </Button>
              <Button variant="ghost" onClick={cancelUpdateHandler}>
                Annuler
              </Button>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  )
}
