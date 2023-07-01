import { Card, CardBody, HStack } from '@chakra-ui/react'

import PaymentRatio from './PaymentRatio'
import RevenuChart from './RevenuChart/RevenuChart'
import PayerCategoryChart from './PayerCategoryChart'
import WorkLoadChart from './WorkLoadChart'

export default function Statistics() {
  return (
    <HStack gap="8" mt="4rem" minHeight="90vh" width="100%" p="4" justifyContent="space-around" flexWrap="wrap">
      <Card display="flex" width={940} ml="2">
        <CardBody display="flex">
          <PaymentRatio />
          <PayerCategoryChart />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <RevenuChart />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <WorkLoadChart />
        </CardBody>
      </Card>
    </HStack>
  )
}
