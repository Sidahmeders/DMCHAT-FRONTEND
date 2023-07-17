import { Card, CardBody, Stack, HStack } from '@chakra-ui/react'

import PaymentRatio from './PaymentRatio'
import RevenuChart from './RevenuChart/RevenuChart'
import PayerCategoryChart from './PayerCategoryChart'
import WorkLoadChart from './WorkLoadChart'
import PatientAgeRatio from './PatientAgeRatio/PatientAgeRatio'
import PatientsCount from './PatientsCount'

const Statistics = () => (
  <Stack gap="8" width="100%" maxW="85rem" px="8" mt="2">
    <HStack gap="4" display="flex" justify="center" flexWrap="wrap">
      <PaymentRatio />
      <PayerCategoryChart />
      <PatientAgeRatio />
      <PatientsCount />
    </HStack>

    <Card>
      <CardBody display="flex" justifyContent="center">
        <RevenuChart />
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <WorkLoadChart />
      </CardBody>
    </Card>
  </Stack>
)

export default Statistics
