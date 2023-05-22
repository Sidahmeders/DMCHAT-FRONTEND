const PAGE_ROUTE = 'pageRoute'
const PATIENT = 'patient'
const TEMPLATE_BUTTONS = 'templateButtons'

export const getPageRoute = () => {
  const pageRoute = localStorage.getItem(PAGE_ROUTE)
  return JSON.parse(pageRoute) || {}
}

export const setPageRoute = (route) => {
  localStorage.setItem(PAGE_ROUTE, JSON.stringify(route))
}

export const getPatient = () => {
  const patient = localStorage.getItem(PATIENT)
  return JSON.parse(patient) || {}
}

export const setPatient = (patient) => {
  localStorage.setItem(PATIENT, JSON.stringify(patient))
}

export const getEventTemplateButtons = () => {
  const templateButtons = localStorage.getItem(TEMPLATE_BUTTONS)
  return JSON.parse(templateButtons) || []
}

export const addEventTemplateButtons = (template) => {
  const allTemplateButtons = getEventTemplateButtons()
  localStorage.setItem(TEMPLATE_BUTTONS, JSON.stringify([...allTemplateButtons, template]))
}

export const dropEventTemplateButton = (templateId) => {
  const filteredTemplateButtons = getEventTemplateButtons().filter(({ id }) => templateId !== id)
  localStorage.setItem(TEMPLATE_BUTTONS, JSON.stringify(filteredTemplateButtons))
}
