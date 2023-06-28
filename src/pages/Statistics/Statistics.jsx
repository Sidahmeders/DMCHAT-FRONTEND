import { HStack } from '@chakra-ui/react'
import YearRevenuChart from './YearRevenuChart'

export default function Statistics() {
  return (
    <HStack mt="5%" minHeight="90vh" width="100%" alignItems="flex-start" p="4">
      <YearRevenuChart />
    </HStack>
  )
}
