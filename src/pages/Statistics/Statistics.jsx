import { HStack } from '@chakra-ui/react'

import YearRevenuChart from './YearRevenuChart'
import PayerCategoryChart from './PayerCategoryChart'

export default function Statistics() {
  return (
    <HStack mt="4rem" minHeight="90vh" width="100%" p="4" justifyContent="space-around">
      <YearRevenuChart />
      <PayerCategoryChart />
    </HStack>
  )
}
