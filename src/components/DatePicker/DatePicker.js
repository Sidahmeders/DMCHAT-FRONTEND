import propTypes from 'prop-types'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { fr } from 'date-fns/locale'

import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.scss'

registerLocale(fr)

export default function DatePicker({ value, onChange, dateFormat, className }) {
  return (
    <div className={className}>
      <ReactDatePicker dateFormat={dateFormat} locale={fr} selected={value} onChange={(date) => onChange(date)} />
    </div>
  )
}

DatePicker.propTypes = {
  value: propTypes.instanceOf(Date),
  onChange: propTypes.func,
  dateFormat: propTypes.string,
  className: propTypes.string,
}

DatePicker.defaultProps = {
  value: new Date(),
  onChange: () => {},
  dateFormat: 'yyyy/MM/dd',
  className: 'react-date-picker',
}
