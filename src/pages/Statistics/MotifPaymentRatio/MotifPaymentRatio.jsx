import { useCallback, useEffect, useState } from 'react'
import { Card, CardHeader } from '@chakra-ui/card'
import { FormControl, Input, useToast } from '@chakra-ui/react'
import { PieChart, Pie } from 'recharts'
import { subDays } from 'date-fns'

import { formatDate } from '@utils'
import { fetchPaymentMotifByDateRange } from '@services/statistics'

import RenderActiveShape from './RenderActiveShape'

const MotifPaymentRatio = () => {
  const toast = useToast()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paymentMotifData, setPaymentMotifData] = useState([])
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  useEffect(() => {
    ;(async () => {
      try {
        const paymentMotif = await fetchPaymentMotifByDateRange(startDate, endDate)
        setPaymentMotifData(paymentMotif.map((item) => ({ name: item._id, value: item.totalPayment })))
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, startDate])

  return (
    <Card variant="filled" bg="gray.50" overflow="auto" width="500px" height="350px">
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
          data={paymentMotifData}
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
