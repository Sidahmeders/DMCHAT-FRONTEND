export const CREATE_APPOINTMENT_NAMES = {
  SENDER: 'sender',
  PATIENT: 'patient',
  BASE_APPOINTMENT_ID: 'baseAppointmentId',
  FULL_NAME: 'fullName',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  TITLE: 'title',
  MOTIF: 'motif',
  DIAGNOSTIC: 'diagnostic',
  TREATMENT_PLAN: 'treatmentPlan',
  TOTAL_PRICE: 'totalPrice',
  PAYMENT: 'payment',
  PAYMENT_LEFT: 'paymentLeft',
  isNewTreatment: 'isNewTreatment',
  IS_CONFIRMED: 'isConfirmed',
  IS_LEFT: 'isLeft',
  IS_WAITING_ROOM: 'isWaitingRoom',
  IS_DONE: 'isDone',
}

export const APPOINTMENTS_IDS = {
  EXPECTED: 'isExpected',
  DONE: 'isDone',
  WAITING_ROOM: 'isWaitingRoom',
}

export const APPOINTMENTS_EVENTS = {
  CONFIRM_APPOINTMENT: 'confirm appointment',
  LEAVE_APPOINTMENT: 'leave appointment',
  DROP_APPOINTMENT: 'drop appointment',
  PAYMENT_APPOINTMENT: 'payment appointment',
}

export const APPOINTMENTS_LISTENERS = {
  APPOINTMENT_CONFIRMATION: 'appointment confirmation',
  APPOINTMENT_LEFT: 'appointment left',
  APPOINTMENT_DROPPED: 'appointment dropped',
  APPOINTMENT_MESSAGED: 'appointment messaged',
  APPOINTMENT_PAID: 'appointment paid',
}
