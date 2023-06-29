import { useState } from 'react'
import { Button, HStack, FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import { abbreviateNumber, formatMoney } from '@utils'

const yearData = [
  {
    name: 'janv.',
    revenu: 650000,
  },
  {
    name: 'févr.',
    revenu: 550000,
  },
  {
    name: 'mars',
    revenu: 880000,
  },
  {
    name: 'avr.',
    revenu: 490000,
  },
  {
    name: 'mai',
    revenu: 950000,
  },
  {
    name: 'juin',
    revenu: 1430000,
  },
  {
    name: 'juil.',
    revenu: 1030000,
  },
  {
    name: 'août',
    revenu: 430000,
  },
  {
    name: 'sept.',
    revenu: 830000,
  },
  {
    name: 'oct.',
    revenu: 1130000,
  },
  {
    name: 'nov.',
    revenu: 330000,
  },
  {
    name: 'déc.',
    revenu: 530000,
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

const CustomTooltip = (props) => {
  const { active, payload, label } = props
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          padding: '10px',
          borderRadius: '6px',
        }}>
        <p className="label">{`${label} : ${formatMoney(payload[0].value)}`}</p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ showEmptyDays, setShowEmptyDays, selectedStat, setSelectedStat }) => {
  return (
    <HStack display="flex" justifyContent="space-between" ml="14" mb="4">
      <HStack>
        <Button
          size="sm"
          colorScheme="twitter"
          variant={selectedStat.month ? 'solid' : 'ghost'}
          onClick={() => setSelectedStat({ month: true })}>
          Mois Revenu
        </Button>
        <Button
          size="sm"
          colorScheme="purple"
          variant={selectedStat.year ? 'solid' : 'ghost'}
          onClick={() => setSelectedStat({ year: true })}>
          Année Revenu
        </Button>
      </HStack>

      <HStack>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="show-empty-days" fontSize="xs" mr="1" mb="0">
            afficher jours vides?
          </FormLabel>
          <Switch
            size="sm"
            id="show-empty-days"
            colorScheme="yellow"
            checked={showEmptyDays}
            onChange={() => setShowEmptyDays(!showEmptyDays)}
          />
        </FormControl>
      </HStack>
    </HStack>
  )
}

const RevenuChart = () => {
  const [selectedStat, setSelectedStat] = useState({ year: true, month: false })
  const [showEmptyDays, setShowEmptyDays] = useState(false)

  const monthData = showEmptyDays ? mixedMonthData : cleanMonthData

  return (
    <div style={{ overflowX: 'auto' }}>
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
            />
          }
        />
        <YAxis tickFormatter={(value) => abbreviateNumber(value)} />
        <XAxis dataKey="name" scale="revenu" />
        <Bar dataKey="revenu" barSize={2} fill="#36d" />
        <Area dataKey="revenu" type="monotone" stroke="#36d" />
      </ComposedChart>
    </div>
  )
}

export default RevenuChart
