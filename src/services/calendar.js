const { format } = require('date-fns')
const { getUser } = require('@utils')

const user = getUser()

const setCalendarAvailability = async (date, availability) => {
  const response = await fetch(`/api/calendar/${format(date, 'yyyy/MM/dd')}/availability`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({ availability }),
  })

  return await response.json()
}

export { setCalendarAvailability }
