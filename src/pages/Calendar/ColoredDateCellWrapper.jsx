import { useState, useEffect, Children, cloneElement } from 'react'
import { format } from 'date-fns'

import { ChatState } from '../../context'
import { CALENDAR_DAY_AVAILABILITY } from '../../config'

export default function ColoredDateCellWrapper({ children, value }) {
  const { user } = ChatState()
  const [calendarDay, setCalendarDay] = useState({})
  const { availability } = calendarDay || {}

  const availabilityBgColor = {
    [CALENDAR_DAY_AVAILABILITY.REST]: '#ddd',
    [CALENDAR_DAY_AVAILABILITY.BUSY]: '#ffff0066',
    [CALENDAR_DAY_AVAILABILITY.LOADED]: '#ff000066',
  }

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const response = await fetch(`/api/calendar/${format(new Date(value), 'yyyy/MM/dd')}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      setCalendarDay(await response.json())
    })()
  }, [user, value])

  return cloneElement(Children.only(children), {
    style: {
      ...children.style,
      backgroundColor: availabilityBgColor[availability],
    },
  })
}
