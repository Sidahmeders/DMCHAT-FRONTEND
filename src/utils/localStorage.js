const USER = 'userInfo'
const PATIENT = 'patient'
const PAGE_ROUTE = 'pageRoute'
const MOTIF_TEMPLATE_BUTTONS = 'motifTemplateButtons'

export const getUser = () => JSON.parse(localStorage.getItem(USER)) || {}
export const setUser = (userData) => localStorage.setItem(USER, JSON.stringify(userData))
export const removeUser = () => localStorage.removeItem(USER)

export const getPatient = () => JSON.parse(localStorage.getItem(PATIENT)) || {}
export const setPatient = (patient) => localStorage.setItem(PATIENT, JSON.stringify(patient))

export const getPageRoute = () => localStorage.getItem(PAGE_ROUTE) || ''
export const setPageRoute = (route) => localStorage.setItem(PAGE_ROUTE, route)

export const getMotifTemplateButtons = () => JSON.parse(localStorage.getItem(MOTIF_TEMPLATE_BUTTONS)) || []
export const addMotifTemplateButtons = (button) => {
  localStorage.setItem(MOTIF_TEMPLATE_BUTTONS, JSON.stringify([...getMotifTemplateButtons(), button]))
}
export const dropMotifTemplateButton = (buttonId) => {
  const filteredTemplateButtons = getMotifTemplateButtons().filter(({ id }) => buttonId !== id)
  localStorage.setItem(MOTIF_TEMPLATE_BUTTONS, JSON.stringify(filteredTemplateButtons))
}
