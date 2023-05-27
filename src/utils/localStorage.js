const PATIENT = 'patient'
const PAGE_ROUTE = 'pageRoute'
const TEMPLATE_BUTTONS = 'templateButtons'

export const getPatient = () => JSON.parse(localStorage.getItem(PATIENT)) || {}
export const setPatient = (patient) => localStorage.setItem(PATIENT, JSON.stringify(patient))

export const getPageRoute = () => localStorage.getItem(PAGE_ROUTE) || ''
export const setPageRoute = (route) => localStorage.setItem(PAGE_ROUTE, route)

export const getEventTemplateButtons = () => JSON.parse(localStorage.getItem(TEMPLATE_BUTTONS)) || []
export const addEventTemplateButtons = (template) => {
  localStorage.setItem(TEMPLATE_BUTTONS, JSON.stringify([...getEventTemplateButtons(), template]))
}
export const dropEventTemplateButton = (templateId) => {
  const filteredTemplateButtons = getEventTemplateButtons().filter(({ id }) => templateId !== id)
  localStorage.setItem(TEMPLATE_BUTTONS, JSON.stringify(filteredTemplateButtons))
}
