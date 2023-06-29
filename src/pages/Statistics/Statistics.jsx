import { HStack } from '@chakra-ui/react'

import PaymentRatio from './PaymentRatio'
import RevenuChart from './RevenuChart'
import PayerCategoryChart from './PayerCategoryChart'
import WorkLoadChart from './WorkLoadChart'

export default function Statistics() {
  return (
    <HStack gap="8" mt="4rem" minHeight="90vh" width="100%" p="4" justifyContent="space-around" flexWrap="wrap">
      <PaymentRatio />
      <RevenuChart />
      <WorkLoadChart />
      <PayerCategoryChart />
    </HStack>
  )
}
