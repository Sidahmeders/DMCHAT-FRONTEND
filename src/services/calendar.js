const { getUser, formatDate } = require('@utils')

const user = getUser()

const fetchCalendarAvailabilities = async (date) => {
  const response = await fetch(`/api/calendar/${formatDate(date, 'yyyy/MM')}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  })

  return await response.json()
}

const setCalendarAvailability = async (date, availability) => {
  const response = await fetch(`/api/calendar/${formatDate(date, 'yyyy/MM/dd')}/availability`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({ availability }),
  })

  return await response.json()
}

export { fetchCalendarAvailabilities, setCalendarAvailability }
