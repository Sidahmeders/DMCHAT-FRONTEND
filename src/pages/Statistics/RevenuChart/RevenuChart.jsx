import { useEffect, useState } from 'react'
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { isValid, subDays } from 'date-fns'

import { abbreviateNumber, formatDate } from '@utils'
import { FRENCH_MONTH_NAMES, X_AXIS_DAY_NAMES, MOCK_YEAR_DATA, MOCK_MONTH_DATA } from '@config'
import { fetchPaymentsByDateRange } from '@services/statistics'

import CustomLegend from './CustomLegend'
import CustomTooltip from './CustomTooltip'

import './RevenuChart.scss'

const aggregatePaymentsData = (data, isYearFormat = false) => {
  const paymentsMap = new Map()

  data.forEach((payment) => {
    const paymentDate = isYearFormat ? formatDate(payment.date, 'yyyy-MM') : formatDate(payment.date)
    const paymentValue = paymentsMap.get(paymentDate)

    paymentsMap.set(paymentDate, {
      label: X_AXIS_DAY_NAMES[formatDate(paymentDate, 'd')],
      name: isYearFormat ? FRENCH_MONTH_NAMES[formatDate(paymentDate, 'M')] : formatDate(paymentDate, 'dd'),
      revenu: paymentValue ? payment.amount + paymentValue.revenu : payment.amount,
    })
  })

  return [...paymentsMap.values()]
}

const RevenuChart = () => {
  const [selectedStat, setSelectedStat] = useState({ year: true, month: false })
  const [showEmptyDays, setShowEmptyDays] = useState(false)
  const [dateRangeValue, setDateRangeValue] = useState([subDays(new Date(), 30), new Date()])
  const [yearData, setYearData] = useState([])
  const [monthDateValue, setMonthDateValue] = useState(new Date())
  const [monthData, setMonthData] = useState([])
  const [useMockData, setUseMockData] = useState(false) // TODO: should remove this

  const chosenMonthData = showEmptyDays ? monthData : monthData.filter((day) => day.revenu > 0)

  useEffect(() => {
    ;(async () => {
      const [startDate, endDate] = [formatDate(monthDateValue, 'yyyy-MM-01'), formatDate(monthDateValue, 'yyyy-MM-31')]
      const monthStatData = await fetchPaymentsByDateRange(startDate, endDate)
      // TODO: should remove this
      if (useMockData) {
        setMonthData(MOCK_MONTH_DATA)
      } else {
        setMonthData(aggregatePaymentsData(monthStatData))
      }
    })()
  }, [monthDateValue, useMockData])

  useEffect(() => {
    ;(async () => {
      const [startDate, endDate] = dateRangeValue
      if (!isValid(startDate) || !isValid(endDate)) return
      const yearStatData = await fetchPaymentsByDateRange(startDate, endDate)
      // TODO: should remove this
      if (useMockData) {
        setYearData(MOCK_YEAR_DATA)
      } else {
        setYearData(aggregatePaymentsData(yearStatData, true))
      }
    })()
  }, [dateRangeValue, useMockData])

  return (
    <div className="revenu-stat-container">
      <ComposedChart width={900} height={400} data={selectedStat.year ? yearData : chosenMonthData}>
        <CartesianGrid strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          content={
            <CustomLegend
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
              showEmptyDays={showEmptyDays}
              setShowEmptyDays={setShowEmptyDays}
              dateRangeValue={dateRangeValue}
              setDateRangeValue={setDateRangeValue}
              monthDateValue={monthDateValue}
              setMonthDateValue={setMonthDateValue}
              // TODO: should remove this
              useMockData={useMockData}
              setUseMockData={setUseMockData}
            />
          }
        />
        <YAxis tickFormatter={(value) => abbreviateNumber(value)} />
        <XAxis
          tickFormatter={(value) => (selectedStat.year ? yearData[value].name : chosenMonthData[value].label)}
          scale="revenu"
        />
        <Bar dataKey="revenu" barSize={2} fill="#36dd" />
        <Area dataKey="revenu" type="monotone" fill={selectedStat.year ? '#474aff66' : '#36d9'} stroke="#36d" />
      </ComposedChart>
    </div>
  )
}

export default RevenuChart
