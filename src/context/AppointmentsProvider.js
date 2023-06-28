import { createContext, useContext, useEffect, useState } from 'react'

import { APPOINTMENTS_IDS } from '../config'
import { flattenAppointment } from '../utils'
import { fetchDayAppointments } from '@services/appointments'
import { fetchDayPayments } from '@services/payments'

const AppointmentsContext = createContext()

export const AppointmentsProvider = ({ children }) => {
  const [appointmentsList, setAppointmentsList] = useState({
    [APPOINTMENTS_IDS.EXPECTED]: [],
    [APPOINTMENTS_IDS.WAITING_ROOM]: [],
    [APPOINTMENTS_IDS.IN_PROGRESS]: [],
    [APPOINTMENTS_IDS.DONE]: [],
  })
  const [todayPaymentHistory, setTodayPaymentHistory] = useState([])

  const fetchTodayAppointments = async () => {
    const todayAppointments = await fetchDayAppointments(new Date())

    const { expected, awaitingRoom, inProgress, doneList } = todayAppointments.reduce(
      (prev, appointment) => {
        const { isWaitingRoom, isInProgress, isDone } = appointment
        const flatAppointment = flattenAppointment(appointment)

        if (isWaitingRoom) {
          return { ...prev, awaitingRoom: [...prev.awaitingRoom, flatAppointment] }
        }
        if (isInProgress) {
          return { ...prev, inProgress: [...prev.inProgress, flatAppointment] }
        }
        if (isDone) {
          return { ...prev, doneList: [...prev.doneList, flatAppointment] }
        }
        return { ...prev, expected: [...prev.expected, flatAppointment] }
      },
      {
        expected: [],
        awaitingRoom: [],
        inProgress: [],
        doneList: [],
      },
    )

    setAppointmentsList({
      [APPOINTMENTS_IDS.EXPECTED]: expected,
      [APPOINTMENTS_IDS.WAITING_ROOM]: awaitingRoom,
      [APPOINTMENTS_IDS.IN_PROGRESS]: inProgress,
      [APPOINTMENTS_IDS.DONE]: doneList,
    })
  }

  useEffect(() => {
    ;(async () => {
      const todayPayments = await fetchDayPayments(new Date())
      setTodayPaymentHistory(todayPayments)
    })()
  }, [])

  return (
    <AppointmentsContext.Provider
      value={{
        appointmentsList,
        setAppointmentsList,
        fetchTodayAppointments,
        todayPaymentHistory,
        setTodayPaymentHistory,
      }}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export const AppointmentsState = () => useContext(AppointmentsContext)
