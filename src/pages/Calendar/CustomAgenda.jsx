import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as dates from 'date-arithmetic'
import { startOfMonth, toDate } from 'date-fns'
import { ChevronDown, Calendar, DollarSign, Target, ChevronUp } from 'react-feather'

function rangeFunc(start, end, unit = 'day') {
  let current = start
  const days = []
  while (dates.lte(current, end, unit)) {
    days.push(current)
    current = dates.add(current, 1, unit)
  }
  return days
}

function inRange(e, start, end, accessors) {
  const eStart = dates.startOf(accessors.start(e), 'day')
  const eEnd = accessors.end(e)
  const startsBeforeEnd = dates.lte(eStart, end, 'day')
  const endsAfterStart = !dates.eq(eStart, eEnd, 'minutes')
    ? dates.gt(eEnd, start, 'minutes')
    : dates.gte(eEnd, start, 'minutes')
  return startsBeforeEnd && endsAfterStart
}

export default function CustomAgenda({ accessors, localizer, length, date, events }) {
  const end = dates.add(date, length, 'day')
  const range = rangeFunc(date, end, 'day')
  events = events.filter((event) => inRange(event, date, end, accessors))
  events.sort((a, b) => +accessors.start(a) - +accessors.start(b))

  if (events.length === 0) return 'No event dates in range'

  return (
    <div>
      {range.map((day, index) => (
        <DayEvents key={index} localizer={localizer} accessors={accessors} day={day} events={events} />
      ))}
    </div>
  )
}

const DayEvents = ({ localizer, accessors, events, day }) => {
  const [show, setShow] = useState(false)

  events = events.filter((e) => inRange(e, dates.startOf(day, 'day'), dates.endOf(day, 'day'), accessors))

  if (events.length === 0) return

  return (
    <div>
      <div
        style={{
          display: 'flex',
          border: '1px solid gray',
          margin: '6px 0',
          padding: '2px 6px',
          alignItems: 'center',
        }}
        onClick={() => setShow(!show)}>
        <Calendar color="blue" size="1rem" style={{ marginRight: '6px' }} /> {localizer.format(day, 'yyyy MMMM dd')}{' '}
        <div style={{ width: '1rem' }}></div>
        <DollarSign color="orange" size="1rem" style={{ marginRight: '6px' }} /> 690000 DZD
        <div style={{ width: '1rem' }}></div>
        <Target color="green" size="1rem" style={{ marginRight: '6px' }} /> Fini: {Math.floor(events.length / 2)}/
        {events.length}
        <div style={{ marginLeft: 'auto' }}>{show ? <ChevronUp /> : <ChevronDown />}</div>
      </div>
      {events.map(
        ({ motif, patient, isDone }, index) => (
          <div key={index} style={{ display: show ? 'block' : 'none' }}>
            <div
              style={{
                border: isDone ? '1px solid #0806' : '1px solid #d006',
                margin: '6px 0',
                padding: '6px 12px',
                background: isDone ? '#0801' : '#d0d1',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <span>
                {patient?.fullName} / {motif?.name}
              </span>
              <span>7000 DZD</span>
            </div>
          </div>
        ),
        [],
      )}
    </div>
  )
}

CustomAgenda.title = (start, { localizer }) => {
  const end = dates.add(start, 1, 'month')
  return localizer.format({ start, end }, 'agendaHeaderFormat')
}

CustomAgenda.navigate = (date, action) => {
  const sDate = toDate(startOfMonth(date))
  switch (action) {
    case 'PREV':
      return dates.add(sDate, -1, 'month')
    case 'NEXT':
      return dates.add(sDate, 1, 'month')
    default:
      return date
  }
}

CustomAgenda.propTypes = {
  events: PropTypes.array,
  date: PropTypes.instanceOf(Date),
  length: PropTypes.number,
  selected: PropTypes.object,
  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,
}
