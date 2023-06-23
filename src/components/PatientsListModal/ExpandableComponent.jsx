import { useEffect, useState } from 'react'
import { Textarea, InputGroup, Box, Skeleton, useToast } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'

import { fetchPatientAppointments } from '@services/appointments'

import Loader from '../Loader/Loader'

export default function ExpandableComponent({ data, user }) {
  const toast = useToast()
  const [patientAppointments, setPatientAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const patientAppointments = await fetchPatientAppointments(data._id)
        setPatientAppointments(patientAppointments)
      } catch (error) {
        toast()
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, user])

  if (isLoading) return <Skeleton mt="2" mb="2" height="100" />

  return (
    <Loader loading={isLoading}>
      <Box pl="12">
        {patientAppointments.map((appointment) => {
          const {
            _id,
            motif,
            generalState,
            diagnostic,
            treatmentPlan,
            title,
            createdAt,
            isNewTreatment,
            isDone,
            totalPrice,
            payment,
          } = appointment
          const history =
            `Motif:: ${motif}\nEtate:: ${generalState}\nDiag:: ${diagnostic}\nPlan:: ${treatmentPlan}\nTitre:: ${title}`.trim()

          return (
            <InputGroup key={_id}>
              <div style={{ width: '6rem' }}>
                {isNewTreatment && <hr />}
                <div style={{ padding: '0 0.25rem', color: isNewTreatment ? 'blue' : 'gray' }}>
                  <span style={{ borderBottom: isNewTreatment ? '1px solid blue' : '' }}>
                    {format(parseISO(createdAt), 'yy.MM.dd')}
                  </span>
                  {isNewTreatment && (
                    <>
                      <br />
                      T: {totalPrice}
                      <br />
                      V: {payment}
                      <br />
                      {isDone ? 'F' : 'DF'}
                    </>
                  )}
                </div>
              </div>
              {isNewTreatment ? (
                <Textarea
                  readOnly
                  p="0.5"
                  pl="2"
                  height="32"
                  outline="none"
                  border="none"
                  value={history}
                  placeholder="Historique"
                  onChange={() => {}}
                />
              ) : (
                <div>
                  Titre:: {title} / V: {payment || '0'} / {isDone ? 'F' : 'DF'}
                </div>
              )}
            </InputGroup>
          )
        })}
      </Box>
    </Loader>
  )
}
