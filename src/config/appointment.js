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
  isNewTreatment: 'isNewTreatment',
  IS_CONFIRMED: 'isConfirmed',
  IS_LEFT: 'isLeft',
  IS_WAITING_ROOM: 'isWaitingRoom',
  IS_DONE: 'isDone',
  ORDER: 'order',
}

export const MOTIF_ENUM = {
  PAIN: 'pain',
  FUNCTIONAL: 'functional',
  AESTHETIC: 'aesthetic',
  OTHERS: 'others',
}

export const MOTIF_TEMPLATE_VALUES = [
  { id: '#1', name: 'douleur', value: MOTIF_ENUM.PAIN, isRequired: true },
  { id: '#2', name: 'fonctionnel', value: MOTIF_ENUM.FUNCTIONAL, isRequired: true },
  { id: '#3', name: 'esthetique', value: MOTIF_ENUM.AESTHETIC, isRequired: true },
]

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
  UPDATE_APPOINTMENT: 'update appointment',
  REORDER_APPOINTMENT: 'reorder appointment',
}

export const APPOINTMENTS_LISTENERS = {
  APPOINTMENT_CONFIRMATION: 'appointment confirmation',
  APPOINTMENT_LEFT: 'appointment left',
  APPOINTMENT_DROPPED: 'appointment dropped',
  APPOINTMENT_MESSAGED: 'appointment messaged',
  APPOINTMENT_PAID: 'appointment paid',
  APPOINTMENT_UPDATED: 'appointment updated',
  APPOINTMENT_REORDERED: 'appointment reordered',
}
