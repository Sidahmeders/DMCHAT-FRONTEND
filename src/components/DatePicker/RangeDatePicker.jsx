import { forwardRef } from 'react'
import propTypes from 'prop-types'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { fr } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import './RangeDatePicker.scss'

registerLocale(fr)

export default function RangeDatePicker({ rangeValue, onChange, dateFormat, className }) {
  const [startDate, endDate] = rangeValue || []

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className={className ? className : 'date-range-picker'} ref={ref} onClick={onClick}>
      {value}
    </button>
  ))

  return (
    <ReactDatePicker
      withPortal
      selectsRange
      fixedHeight
      showMonthDropdown
      showYearDropdown
      maxDate={new Date()}
      monthsShown={2}
      locale={fr}
      calendarStartDay={6}
      dateFormat={dateFormat}
      dropdownMode="select"
      placeholderText="sélectionner une date"
      todayButton="Aujourd'hui"
      startDate={startDate}
      customInput={<CustomInput />}
      endDate={endDate}
      onChange={(newValue) => {
        if (onChange) {
          onChange(newValue)
        }
      }}
    />
  )
}

RangeDatePicker.propTypes = {
  rangeValue: propTypes.arrayOf(propTypes.instanceOf(Date)),
  onChange: propTypes.func,
  dateFormat: propTypes.string,
}

RangeDatePicker.defaultProps = {
  rangeValue: [new Date(), new Date()],
  onChange: () => {},
  dateFormat: 'yyyy/MM/dd',
}
