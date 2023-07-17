import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Card } from '@chakra-ui/card'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

import { MOCK_PATIENTS_AGE_RATIO_DATA } from '@fakeDB'
import { fetchPatientsAgeRatio } from '@services/statistics'

import CustomTooltip from './CustomTooltip'
import CustomLegend from './CustomLegend'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" fontWeight="500" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const sortPatientsRatio = (a, b) => {
  const [ageOne] = a?.name?.split('-')
  const [ageTwo] = b?.name?.split('-')
  return parseInt(ageOne) - parseInt(ageTwo)
}

const PatientAge = () => {
  const toast = useToast()
  const [patientsAgeRatio, setPatientsAgeRatio] = useState([])
  const [useMockData, setUseMockData] = useState(false)

  const PatientStatData = useMockData ? MOCK_PATIENTS_AGE_RATIO_DATA : patientsAgeRatio

  useEffect(() => {
    ;(async () => {
      try {
        const patientsAgeRatioData = await fetchPatientsAgeRatio()
        setPatientsAgeRatio(patientsAgeRatioData.sort(sortPatientsRatio))
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card variant="filled" bg="gray.50" w="400px">
      <PieChart width={400} height={300}>
        <Tooltip content={CustomTooltip} />
        <Legend verticalAlign content={<CustomLegend useMockData={useMockData} setUseMockData={setUseMockData} />} />
        <Pie
          data={PatientStatData}
          cx={200}
          cy={190}
          outerRadius={100}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="count"
          labelLine={false}>
          {PatientStatData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Card>
  )
}

export default PatientAge
