export const groupAppointments = (appointments) => {
  const groupedAppointments = []

  const appointmentMap = new Map(appointments.map((appointment) => [appointment._id, appointment]))

  appointments.forEach((appointment) => {
    if (appointment.baseAppointmentId) {
      const baseAppointment = appointmentMap.get(appointment.baseAppointmentId)

      if (baseAppointment) {
        const parentAppointment = groupedAppointments.find((a) => a._id === baseAppointment._id)
        if (parentAppointment) {
          parentAppointment.group.push(appointment)
        } else {
          groupedAppointments.push({
            _id: baseAppointment._id,
            group: [baseAppointment, appointment],
          })
        }
      }
    } else {
      const existingGroup = groupedAppointments.find((group) => group._id === appointment._id)
      if (!existingGroup) {
        groupedAppointments.push({
          _id: appointment._id,
          group: [appointment],
        })
      }
    }
  })

  return groupedAppointments
}
