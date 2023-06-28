import { Box, Badge } from '@chakra-ui/react'
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import { abbreviateNumber, formatMoney } from '@utils'

const data = [
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

const CustomLegend = () => {
  return (
    <Box display="flex" justifyContent="center" ml="14">
      <Badge variant="subtle" color="blue" borderRadius="md">
        Revenu
      </Badge>
    </Box>
  )
}

const YearRevenuChart = () => (
  <ComposedChart width={650} height={400} data={data}>
    <CartesianGrid strokeDasharray="4 4" />
    <Tooltip content={<CustomTooltip />} />
    <Legend content={<CustomLegend />} />
    <YAxis tickFormatter={(value) => abbreviateNumber(value)} />
    <XAxis dataKey="name" scale="revenu" />
    <Bar dataKey="revenu" barSize={2} fill="#36d" />
    <Area dataKey="revenu" type="monotone" stroke="#36d" />
  </ComposedChart>
)

export default YearRevenuChart
