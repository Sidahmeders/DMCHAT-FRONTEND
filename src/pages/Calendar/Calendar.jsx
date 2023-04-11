import PropTypes from 'prop-types'
import { Calendar as BigCalendar, DateLocalizer, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { registerLocale } from 'react-datepicker'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'

import './Calendar.scss'

const DnDCalendar = withDragAndDrop(BigCalendar)

const messages = {
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
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
  return (
    <div className="calendar-container" {...props}>
      <DnDCalendar
        selectable
        culture="fr"
        localizer={localizer}
        events={[]}
        date={new Date()}
        onNavigate={() => {}}
        min={new Date(1972, 0, 1, 8, 0, 59)}
        step={30}
        views={['month', 'day', 'agenda']}
        messages={messages}
      />
    </div>
  )
}

Calendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}
