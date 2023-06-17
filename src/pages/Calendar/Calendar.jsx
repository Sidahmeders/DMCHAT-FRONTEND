import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { useSwipeable } from 'react-swipeable'
import PropTypes from 'prop-types'
import { Calendar as BigCalendar, DateLocalizer, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { registerLocale } from 'react-datepicker'
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

import { ChatState } from '../../context'

import AddAppointmentModal from '../../components/AddAppointmentModal/AddAppointmentModal'
import DisplayEventModal from './DisplayEventModal'
import CustomToolbar from './CustomToolbar'
import ColoredDateCellWrapper from './ColoredDateCellWrapper'
import CustomAgenda from './CustomAgenda'

import './Calendar.scss'

const DnDCalendar = withDragAndDrop(BigCalendar)

const messages = {
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Jour Liste',
  date: 'Date',
  time: 'Heure',
  event: 'Evenement',
}

const fnslocalizer = dateFnsLocalizer({
  format,
  parse,
  getDay,
  locales: { fr: fr },
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
})

registerLocale(fr)

export default function Calendar({ localizer = fnslocalizer, ...props }) {
  const { user } = ChatState()
  const {
    isOpen: isAddAppointmentModalOpen,
    onOpen: onAddAppointmentModalOpen,
    onClose: onAddAppointmentModalClose,
  } = useDisclosure()
  const {
    isOpen: isDisplayEventModalOpen,
    onOpen: onDisplayEventModalOpen,
    onClose: onDisplayEventModalClose,
  } = useDisclosure()
  const clickRef = useRef(null)

  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({})
  const [selectedEvent, setSelectedEvent] = useState({})

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setSelectedDate(addMonths(selectedDate, 1)),
    onSwipedRight: () => setSelectedDate(subMonths(selectedDate, 1)),
  })

  const showMoreDetails = (callEvent) => {
    setSelectedEvent(callEvent)
    onDisplayEventModalOpen()
  }

  const onSelectEvent = useCallback((callEvent) => {
    /**
     * Here we are waiting 250 milliseconds (use what you want) prior to firing
     * our method. Why? Because both 'click' and 'doubleClick'
     * would fire, in the event of a 'doubleClick'. By doing
     * this, the 'click' handler is overridden by the 'doubleClick'
     * action.
     */
    clearTimeout(clickRef?.current)
    clickRef.current = setTimeout(() => showMoreDetails(callEvent, 'onSelectEvent'), 250)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDoubleClickEvent = useCallback((callEvent) => {
    clearTimeout(clickRef?.current)
    clickRef.current = setTimeout(() => showMoreDetails(callEvent, 'onDoubleClickEvent'), 250)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelectSlot = useCallback(
    (slotInfo) => {
      /**
       * Here we are waiting 250 milliseconds (use what you want) prior to firing
       * our method. Why? Because both 'click' and 'doubleClick'
       * would fire, in the event of a 'doubleClick'. By doing
       * this, the 'click' handler is overridden by the 'doubleClick'
       * action.
       */
      clearTimeout(clickRef?.current)
      clickRef.current = setTimeout(() => 'TODO', 250)
      setSelectedSlotInfo(slotInfo)
      onAddAppointmentModalOpen()
    },
    [onAddAppointmentModalOpen],
  )

  const onEventDrop = async ({ event, start, end }) => {
    const response = await fetch(`/api/appointments/${event.id}/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate: start, endDate: end }),
    })
    const updatedAppointment = await response.json()
    const updatedEvents = events.map((appointment) => {
      if (appointment.id === updatedAppointment._id) {
        return {
          ...appointment,
          start: new Date(updatedAppointment.startDate),
          end: new Date(updatedAppointment.endDate),
        }
      }
      return appointment
    })
    setEvents(updatedEvents)
  }

  useEffect(() => {
    /**
     * What Is This?
     * This is to prevent a memory leak, in the off chance that you
     * teardown your interface prior to the timed method being called.
     */
    return () => {
      clearTimeout(clickRef?.current)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const response = await fetch(`/api/appointments/${format(selectedDate, 'yyyy/MM')}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const monthAppointments = await response.json()
      const eventsList = monthAppointments.map((event) => ({
        ...event,
        id: event._id,
        title: `${event?.patient?.fullName} / ${event.title} / ${event.payment || '0'}`,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }))
      setEvents(eventsList)
    })()
  }, [selectedDate, user])

  return (
    <div {...swipeHandlers} className="calendar-container" {...props}>
      <AddAppointmentModal
        selectedSlotInfo={selectedSlotInfo}
        isOpen={isAddAppointmentModalOpen}
        onClose={onAddAppointmentModalClose}
        events={events}
        setEvents={setEvents}
      />
      <DisplayEventModal
        user={user}
        isOpen={isDisplayEventModalOpen}
        onClose={onDisplayEventModalClose}
        selectedEvent={selectedEvent}
        events={events}
        setEvents={setEvents}
      />

      <DnDCalendar
        selectable
        culture="fr"
        localizer={localizer}
        events={events}
        date={selectedDate}
        onNavigate={(date) => setSelectedDate(date)}
        min={new Date(1972, 0, 1, 9, 0, 59)}
        max={new Date(1972, 0, 1, 17, 30, 59)}
        step={30}
        views={{
          month: true,
          day: true,
          agenda: CustomAgenda,
        }}
        messages={messages}
        onSelectEvent={onSelectEvent}
        onDoubleClickEvent={onDoubleClickEvent}
        onSelectSlot={onSelectSlot}
        onEventDrop={onEventDrop}
        components={{
          toolbar: (props) => <CustomToolbar setSelectedDate={setSelectedDate} {...props} />,
          dateCellWrapper: ColoredDateCellWrapper,
        }}
      />
    </div>
  )
}

Calendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}
