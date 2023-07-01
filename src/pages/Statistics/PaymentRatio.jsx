import {
  Card,
  CardBody,
  CardHeader,
  Tooltip,
  FormControl,
  FormLabel,
  Switch,
  Input,
  HStack,
  CardFooter,
  Text,
  Box,
} from '@chakra-ui/react'
import { formatDate, formatMoney } from '@utils'

const PaymentRatio = () => {
  const TOTAL = 25220000
  const PAID = 11220000
  const REMAINING = TOTAL - PAID
  const paidPercentage = Math.round((PAID / TOTAL) * 100)

  return (
    <Card variant="filled" bg="gray.50">
      <CardHeader>
        <HStack>
          <FormControl mr="1">
            <Input
              type="date"
              fontSize="15px"
              variant="unstyled"
              bg="#fff"
              borderRadius="md"
              px="1"
              width="125px"
              defaultValue={formatDate(new Date())}
            />
          </FormControl>

          <FormControl mr="1">
            <Input
              type="date"
              fontSize="15px"
              variant="unstyled"
              bg="#fff"
              borderRadius="md"
              px="1"
              width="125px"
              defaultValue={formatDate(new Date())}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" m="0" bg="#fff" borderRadius="md">
            <FormLabel htmlFor="show-all-time" fontSize="xs" pl="1" m="1">
              Toute?
            </FormLabel>
            <Switch size="sm" id="show-all-time" colorScheme="yellow" checked={false} onChange={() => {}} />
          </FormControl>
        </HStack>
      </CardHeader>
      <CardBody px="8">
        <HStack fontWeight="semibold" justify="space-between">
          <Text>Total:</Text>
          <Text fontSize="14" fontWeight="normal" color="gray.500">
            (100%)
          </Text>
          <Text>{formatMoney(TOTAL)}</Text>
        </HStack>
        <HStack fontWeight="semibold" justify="space-between" color="#ff930f">
          <Text>Payé:</Text>
          <Text fontSize="14" fontWeight="normal" color="gray.500">
            ({paidPercentage}%)
          </Text>
          <Text>{formatMoney(PAID)}</Text>
        </HStack>
        <HStack fontWeight="semibold" justify="space-between" color="#1f7ea1">
          <Text>Reste:</Text>
          <Text fontSize="14" fontWeight="normal" color="gray.500">
            ({100 - paidPercentage}%)
          </Text>
          <Text>{formatMoney(REMAINING)}</Text>
        </HStack>
      </CardBody>
      <CardFooter px="8">
        <Tooltip label={`${formatMoney(REMAINING)}`} bg="blue.200" placement="top-end" hasArrow>
          <Box width="100%" height="6" borderRadius="full" bg="#1f7ea166" overflow="hidden">
            <Tooltip label={`${formatMoney(PAID)}`} bg="orange.400" placement="top-start" hasArrow>
              <Box width={`${paidPercentage}%`} height="100%" bg="#ff930f" />
            </Tooltip>
          </Box>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}

export default PaymentRatio
