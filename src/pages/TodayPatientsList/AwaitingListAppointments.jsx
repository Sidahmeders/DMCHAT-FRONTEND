import { useEffect, useState } from 'react'
import { Circle } from '@chakra-ui/react'

import { ChatState } from '../../context'

import AppointmentCard, { LoadingCards } from './AppointmentCard'
import { flattenAppointment } from '../../utils'

export default function AwaitingListAppointments() {
  const { user } = ChatState()
  const [isLoading, setIsLoading] = useState()
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setIsLoading(true)
      const response = await fetch(`/api/appointment/2023/04/05/awaiting`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const awaitingAppointments = await response.json()

      if (response.status === 200) {
        setAppointments(awaitingAppointments.map((appointment) => flattenAppointment(appointment)))
      }
      setIsLoading(false)
    })()
  }, [user])

  return (
    <div className="awaiting-list-appointments-container">
      <h1 className="title">
        Liste d'attente
        <Circle className="circle" size="25px">
          {appointments.length}
        </Circle>
      </h1>
      {isLoading ? (
        <LoadingCards />
      ) : (
        appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
      )}
    </div>
  )
}
