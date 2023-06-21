import { useState, useEffect, Children, cloneElement } from 'react'
import { format } from 'date-fns'

import { ChatState } from '@context'
import { CALENDAR_DAY_AVAILABILITY } from '@config'

export default function ColoredDateCellWrapper({ children, value }) {
  const { user } = ChatState()
  const [calendarDay, setCalendarDay] = useState({})
  const { availability } = calendarDay || {}

  const availabilityBgColor = {
    [CALENDAR_DAY_AVAILABILITY.EMPTY]: '#fff',
    [CALENDAR_DAY_AVAILABILITY.REST]: '#ddd',
    [CALENDAR_DAY_AVAILABILITY.BUSY]: '#ffff0066',
    [CALENDAR_DAY_AVAILABILITY.LOADED]: '#ff000066',
  }

  useEffect(() => {
    if (!user) return
    const controller = new AbortController()
    ;(async () => {
      try {
        const response = await fetch(`/api/calendar/${format(new Date(value), 'yyyy/MM/dd')}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          signal: controller.signal,
        })
        setCalendarDay(await response.json())
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error(error)
      }
    })()

    return () => {
      controller.abort()
    }
  }, [user, value])

  return cloneElement(Children.only(children), {
    style: {
      ...children.style,
      backgroundColor: availabilityBgColor[availability],
    },
  })
}
