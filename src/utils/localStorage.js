import { MOTIF_TEMPLATE_VALUES, MOTIF_ENUM } from '@config'
import { guid } from '@utils'

const USER = 'userInfo'
const PATIENT = 'patient'
const PAGE_ROUTE = 'pageRoute'
const MOTIF_TEMPLATE_BUTTONS = 'motifTemplateButtons'

export const getUser = () => JSON.parse(localStorage.getItem(USER)) || {}
export const setUser = (userData) => localStorage.setItem(USER, JSON.stringify(userData))
export const removeUser = () => localStorage.removeItem(USER)

export const getPatient = () => JSON.parse(localStorage.getItem(PATIENT)) || {}
export const setPatient = (patient) => localStorage.setItem(PATIENT, JSON.stringify(patient))

export const getPageRoute = () => localStorage.getItem(PAGE_ROUTE) || '/'
export const setPageRoute = (route) => localStorage.setItem(PAGE_ROUTE, route)

export const getMotifTemplateButtons = () => {
  const motifLocalValues = JSON.parse(localStorage.getItem(MOTIF_TEMPLATE_BUTTONS)) || []
  return [...MOTIF_TEMPLATE_VALUES, ...motifLocalValues]
}
export const addMotifTemplateButtons = (buttonName) => {
  const motifLocalValues = JSON.parse(localStorage.getItem(MOTIF_TEMPLATE_BUTTONS)) || []
  const newButton = {
    id: guid(),
    name: buttonName,
    value: MOTIF_ENUM.OTHERS,
  }
  localStorage.setItem(MOTIF_TEMPLATE_BUTTONS, JSON.stringify([...motifLocalValues, newButton]))
}
export const dropMotifTemplateButton = (buttonId) => {
  const motifLocalValues = JSON.parse(localStorage.getItem(MOTIF_TEMPLATE_BUTTONS)) || []
  const filteredTemplateButtons = motifLocalValues.filter(({ id }) => buttonId !== id)
  localStorage.setItem(MOTIF_TEMPLATE_BUTTONS, JSON.stringify(filteredTemplateButtons))
}
