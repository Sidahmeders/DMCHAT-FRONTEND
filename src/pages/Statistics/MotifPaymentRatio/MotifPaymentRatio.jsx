import { useCallback, useState } from 'react'
import { Card, CardHeader } from '@chakra-ui/card'
import { FormControl, Input } from '@chakra-ui/react'
import { PieChart, Pie } from 'recharts'

import { PAYMENT_CATEGORY_DATA } from '@fakeDB'
import { formatDate } from '@utils'

import RenderActiveShape from './RenderActiveShape'

const MotifPaymentRatio = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )
  return (
    <Card variant="filled" bg="gray.50" overflow="auto" width="500px" height="300px">
      <CardHeader pb="1" display="flex" justifyContent="space-around">
        <FormControl width="150px" mr="1">
          <Input
            type="date"
            variant="unstyled"
            bg="#fff"
            borderRadius="md"
            px="4"
            value={formatDate(startDate)}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormControl>

        <FormControl width="150px" mr="1">
          <Input
            type="date"
            variant="unstyled"
            bg="#fff"
            borderRadius="md"
            px="4"
            value={formatDate(endDate)}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormControl>
      </CardHeader>

      <PieChart width={500} height={300}>
        <Pie
          activeIndex={activeIndex}
          activeShape={RenderActiveShape}
          data={PAYMENT_CATEGORY_DATA}
          cx={230}
          innerRadius={60}
          outerRadius={85}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </Card>
  )
}

export default MotifPaymentRatio
