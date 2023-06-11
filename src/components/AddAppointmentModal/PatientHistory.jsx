import { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'
import { format, parseISO } from 'date-fns'
import { RadioGroup, Radio, Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react'

export default function PatientHistory({ show, user, patient }) {
  const [appointments, setAppointments] = useState([])
  const [treatmentValue, setTreatmentValue] = useState()

  useEffect(() => {
    ;(async () => {
      const response = await fetch(`/api/appointment/${patient._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.status === 200) {
        const appointmenstData = await response.json()

        setTreatmentValue(appointmenstData[0]?._id)

        const groupedAppointments = appointmenstData.reduce((prevAppointments, appointment) => {
          if (appointment.isNewTreatment) {
            return [...prevAppointments, [appointment]]
          }
          const lastGroup = prevAppointments[prevAppointments.length - 1] || []
          return [...prevAppointments.slice(0, -1), [...lastGroup, appointment]]
        }, [])
        setAppointments(groupedAppointments)
      }
    })()
  }, [user, patient])

  console.log(appointments, 'appointments')

  return (
    <RadioGroup value={treatmentValue} onChange={setTreatmentValue}>
      {appointments.map((appointmentsGroup, index) => (
        <div
          key={index}
          style={{
            display: show ? 'flex' : 'none',
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            marginBottom: '6px',
          }}>
          <Radio value={appointmentsGroup[0]?._id} style={{ marginRight: '6px' }}></Radio>
          <TreatmentSummary appointmentsGroup={appointmentsGroup} />
        </div>
      ))}
    </RadioGroup>
  )
}

const TreatmentSummary = ({ appointmentsGroup }) => {
  const [baseAppointment] = appointmentsGroup
  const doneAppointments = appointmentsGroup.reduce((count, appointment) => (appointment.isDone ? count + 1 : count), 0)

  const [show, setShow] = useState(false)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <span>{baseAppointment.diagnostic?.slice(0, 45)}..</span>
        <br />
        <span>{baseAppointment.treatmentPlan?.slice(0, 45)}..</span>
        <br />
        <span>Prix total: {baseAppointment.totalPrice} DA</span>

        <span style={{ position: 'absolute', top: '0', right: '0' }}>
          {doneAppointments} / {appointmentsGroup.length}
        </span>
        <span style={{ position: 'absolute', top: '24px', right: '0' }}>
          {show ? <ChevronUp onClick={() => setShow(false)} /> : <ChevronDown onClick={() => setShow(true)} />}
        </span>
      </div>
      <TableContainer>
        <Table>
          <Tbody>
            {appointmentsGroup.map((appointment, index) => {
              const { _id, startDate, motif, title, payment } = appointment

              return (
                <Tr key={_id} style={{ display: show ? 'block' : 'none' }}>
                  <Td p="1" borderRight="1px solid #ddd" width="80px">
                    {format(parseISO(startDate), 'yy.MM.dd')}
                  </Td>
                  <Td p="1" borderRight="1px solid #ddd" width="90px">
                    V: {payment || '0'}
                  </Td>
                  <Td p="1" borderRight="1px solid #ddd" width="120px">
                    {motif?.slice(0, 10)}..
                  </Td>
                  <Td p="1">{title?.slice(0, 15)}..</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
