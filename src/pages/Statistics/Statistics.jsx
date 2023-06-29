import { HStack } from '@chakra-ui/react'

import RevenuChart from './RevenuChart'
import PayerCategoryChart from './PayerCategoryChart'
import WorkLoadChart from './WorkLoadChart'

export default function Statistics() {
  return (
    <HStack gap="8" mt="4rem" minHeight="90vh" width="100%" p="4" justifyContent="space-around" flexWrap="wrap">
      <RevenuChart />
      <WorkLoadChart />
      <PayerCategoryChart />
    </HStack>
  )
}
