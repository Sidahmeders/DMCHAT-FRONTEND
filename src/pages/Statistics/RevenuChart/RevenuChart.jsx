import { useEffect, useState } from 'react'
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { isValid, subDays } from 'date-fns'

import { abbreviateNumber, formatDate } from '@utils'
import { fetchPaymentsByDateRange } from '@services/statistics'

import CustomLegend from './CustomLegend'
import CustomTooltip from './CustomTooltip'

import './RevenuChart.scss'

const yearData = [
  {
    name: 'jan',
    date: '22-01',
    revenu: 650000,
  },
  {
    name: 'fev',
    date: '22-02',
    revenu: 550000,
  },
  {
    name: 'mar',
    date: '22-03',
    revenu: 880000,
  },
  {
    name: 'avr',
    date: '22-04',
    revenu: 490000,
  },
  {
    name: 'mai',
    date: '22-05',
    revenu: 950000,
  },
  {
    name: 'jun',
    date: '22-06',
    revenu: 1430000,
  },
  {
    name: 'jul',
    date: '22-07',
    revenu: 1030000,
  },
  {
    name: 'aou',
    date: '22-08',
    revenu: 430000,
  },
  {
    name: 'sep',
    date: '22-09',
    revenu: 830000,
  },
  {
    name: 'oct',
    date: '22-10',
    revenu: 1130000,
  },
  {
    name: 'nov',
    date: '22-11',
    revenu: 330000,
  },
  {
    name: 'dec',
    date: '22-12',
    revenu: 530000,
  },
  {
    name: 'jan',
    date: '23-01',
    revenu: 650000,
  },
]

const mixedMonthData = [
  { name: '01', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '02', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '03', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '04', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '05', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '06', revenu: 0 },
  { name: '07', revenu: 0 },
  { name: '08', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '09', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '10', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '11', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '12', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '13', revenu: 0 },
  { name: '14', revenu: 0 },
  { name: '15', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '16', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '17', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '18', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '19', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '20', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '21', revenu: 0 },
  { name: '22', revenu: 0 },
  { name: '23', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '24', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '25', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '26', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '27', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '28', revenu: 0 },
  { name: '29', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '30', revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
]

const cleanMonthData = mixedMonthData.filter((day) => day.revenu > 0)

const aggregateYearData = (data) => {
  const paymentsMap = new Map()

  data.forEach((payment) => {
    const paymentDate = formatDate(payment.date)
    if (paymentsMap.has(paymentDate)) {
      const previousAmount = paymentsMap.get(paymentDate)
      paymentsMap.set(paymentDate, payment.amount + previousAmount)
    } else {
      paymentsMap.set(paymentDate, payment.amount)
    }
  })

  return paymentsMap
}

const RevenuChart = () => {
  const [selectedStat, setSelectedStat] = useState({ year: true, month: false })
  const [showEmptyDays, setShowEmptyDays] = useState(false)
  const [dateRangeValue, setDateRangeValue] = useState([subDays(new Date(), 30), new Date()])

  const monthData = showEmptyDays ? mixedMonthData : cleanMonthData

  useEffect(() => {
    ;(async () => {
      const [startDate, endDate] = dateRangeValue
      if (!isValid(startDate) || !isValid(endDate)) return
      const paymentRatioData = await fetchPaymentsByDateRange(startDate, endDate)
      console.log(aggregateYearData(paymentRatioData))
    })()
  }, [dateRangeValue])

  return (
    <div className="revenu-stat-container">
      <ComposedChart width={900} height={400} data={selectedStat.year ? yearData : monthData}>
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
            />
          }
        />
        <YAxis tickFormatter={(value) => abbreviateNumber(value)} />
        <XAxis
          tickFormatter={(value) => (selectedStat.year ? yearData[value].name : monthData[value].name)}
          scale="revenu"
        />
        <Bar dataKey="revenu" barSize={2} fill="#36dd" />
        <Area dataKey="revenu" type="monotone" fill={selectedStat.year ? '#474aff66' : '#36d9'} stroke="#36d" />
      </ComposedChart>
    </div>
  )
}

export default RevenuChart
