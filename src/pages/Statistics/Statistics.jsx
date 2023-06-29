import { HStack } from '@chakra-ui/react'

import RevenuChart from './RevenuChart'
import PayerCategoryChart from './PayerCategoryChart'

export default function Statistics() {
  return (
    <HStack mt="4rem" minHeight="90vh" width="100%" p="4" justifyContent="space-around" flexWrap="wrap">
      <RevenuChart />
      <PayerCategoryChart />
    </HStack>
  )
}
