const PAGE_ROUTE = 'pageRoute'

export const getPageRoute = () => {
  const pageRoute = localStorage.getItem(PAGE_ROUTE)
  return JSON.parse(pageRoute) || {}
}

export const setPageRoute = (route) => {
  localStorage.setItem(PAGE_ROUTE, JSON.stringify(route))
}
