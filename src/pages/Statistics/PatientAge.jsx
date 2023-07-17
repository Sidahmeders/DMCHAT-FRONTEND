import { Card } from '@chakra-ui/card'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const data = [
  { name: '5/18', value: 292 },
  { name: '19/30', value: 359 },
  { name: '31/45', value: 412 },
  { name: '46+', value: 189 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          padding: '10px',
          borderRadius: '6px',
        }}>
        <p className="label">{payload[0]?.value} patients</p>
      </div>
    )
  }
  return null
}

const PatientAge = () => {
  return (
    <Card variant="filled" bg="gray.50" w="400px">
      <PieChart width={400} height={300}>
        <text x={200} y={30} textAnchor="middle" fill="#6b46c1" fontSize={16}>
          Ratio d'âge des patients
        </text>
        <Tooltip content={CustomTooltip} />
        <Pie
          data={data}
          cx={200}
          cy={145}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </Card>
  )
}

export default PatientAge
