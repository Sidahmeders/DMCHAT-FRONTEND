export const APP_ROUTES = {
  CHATS: '/chats',
  CALENDAR: '/calendar',
  TODAY_PATIENTS_LIST: '/today-patients-list',
  STATISTICS: '/statistics',
}

export const CREATE_PROFILE_NAMES = {
  FULL_NAME: 'fullName',
  BIRTH_DATE: 'birthDate',
  PHONE_NUMBER_ONE: 'phoneNumber1',
  PHONE_NUMBER_TWO: 'phoneNumber2',
  DIAGNOSTIC: 'diagnostic',
  TREATMENT_PLAN: 'treatmentPlan',
  TOTAL_PRICE: 'totalPrice',
  STATUS: 'status',
  IS_URGENT: 'isUrgent',
  CREATION_DATE: 'creationDate',
  PROFILE_IMAGE: 'profileImage',
}

export const EDIT_PROFILE_NAMES = {
  ...CREATE_PROFILE_NAMES,
  NOTES: 'notes',
  IMAGES_ID: 'imagesId',
}

export const PATIENT_PROGRESS_NAMES = {
  HELLO_WORLD: 'hello',
}

export const PATIENT_IMAGE_NAMES = {
  PRE_PHOTO: 'prePhoto',
  POST_PHOTO: 'postPhoto',
  PRE_RADIO: 'preRadio',
  POST_RADIO: 'postRadio',
  PRE_SCAN: 'preScan',
  POST_SCAN: 'postScan',
}

export const EDIT_PROFILE_CHECKBOXES = [
  { name: 'Collage', label: 'En attente de collage' },
  { name: 'EnCours', label: 'En cours de trt' },
  { name: 'Debr', label: 'En attente de debrackeage' },
  { name: 'Fini', label: 'Fini' },
]

export const ADD_EVENT_NAMES = {
  START: 'start',
  END: 'end',
  TITLE: 'title',
  PATIENT_ID: 'patientId',
}

export const CALENDAR_NAVIGATION = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}

export const FILTER_CHECKBOXES = [
  { name: 'filterCollage', isChecked: true, label: 'Collage' },
  { name: 'filterEnCours', isChecked: true, label: 'EnCours' },
  { name: 'filterDebr', isChecked: true, label: 'Debr' },
  { name: 'filterFini', isChecked: true, label: 'Fini' },
  { name: 'filterIsUrgent', isChecked: true, label: 'Urgent' },
]

export const DATABSE_COLLECTIONS_CHECKBOXES = [
  { name: 'patients', isChecked: true, label: 'patients' },
  { name: 'followups', isChecked: true, label: 'suivis' },
  { name: 'events', isChecked: true, label: 'événements' },
  { name: 'images', isChecked: true, label: 'images' },
]

export const FOLLOWUPS = {
  PAYMENT: 'payment',
  LAST_PAYMENTS: 'lastPayments',
  DESCRIPTION: 'description',
  IMAGE: 'image',
  CREATION_DATE: 'creationDate',
  PATIENT_ID: 'patientId',
}

export const MILLISECONDS = {
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 60000 * 60,
  DAY: 60000 * 60 * 24,
}

export const ACCEPTED_IMAGE_EXTENTIONS = '.png, .jpg, .jpeg, .gif, .tiff'
