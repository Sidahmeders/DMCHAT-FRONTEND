import { omit, debounce } from 'lodash'

export * from './localStorage'
export * from './ChatLogics'
export * from './date'

export const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const notify = debounce(async ({ title, description }) => {
  const options = {
    tag: title,
    icon: 'https://i.ibb.co/vB1mDPv/logo192.png',
    vibrate: 3,
  }

  // mobile notification
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(description, options)
  })

  // FIXME: experimental notification //
  navigator.serviceWorker.controller.postMessage({
    title,
    description,
    ...options,
  })
  // FIXME: experimental notification //

  // web notification
  if (Notification.permission === 'default' || Notification.permission === 'denied') {
    await Notification.requestPermission()
  }
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: description,
      ...options,
    })
    setTimeout(notification.close.bind(notification), 4500)
  }
}, 500)

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

export const formatMoney = (number) => {
  let numArray = String(number).split('')
  let dotCount = Math.floor((numArray.length - 1) / 3)

  for (let i = 1; i <= dotCount; i++) {
    numArray.splice(-i * 3, 0, ',')
  }

  return numArray.join('')
}
