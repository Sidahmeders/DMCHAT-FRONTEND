export * from './chat'
export * from './calendar'
export * from './patient'
export * from './todayPatientsList'

export const ENDPOINT = 'https://dnmchat-backend.onrender.com'

export const APP_ROUTES = {
  CHATS: '/chats',
  CALENDAR: '/calendar',
  TODAY_PATIENTS_LIST: '/today-patients-list',
  STATISTICS: '/statistics',
}

export const PAGINATION_ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100, 200, 500]
