import { Card, CardBody, HStack } from '@chakra-ui/react'

import PaymentRatio from './PaymentRatio'
import RevenuChart from './RevenuChart/RevenuChart'
import PayerCategoryChart from './PayerCategoryChart'
import WorkLoadChart from './WorkLoadChart'

const Statistics = () => (
  <HStack gap="8" width="100%" px="12" justifyContent="space-around" flexWrap="wrap">
    <Card display="flex" ml="2">
      <CardBody>
        <HStack gap="4" flexWrap="wrap" justify="center">
          <PaymentRatio />
          <PayerCategoryChart />
        </HStack>
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

export default Statistics
