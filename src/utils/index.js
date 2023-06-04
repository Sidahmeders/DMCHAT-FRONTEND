import { omit } from 'lodash'

export * from './localStorage'
export * from './ChatLogics'

export const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const flattenAppointment = (appointment) => ({
  id: appointment._id,
  patientId: appointment.patient._id,
  ...appointment.patient,
  ...omit(appointment, 'patient'),
})

export const checkIsJWTExpired = (token = '') => {
  const payload = token.split('.')[1]
  const decode = JSON.parse(window.atob(payload))
  if (decode.exp * 1000 < new Date().getTime()) {
    return true
  }
  return false
}
