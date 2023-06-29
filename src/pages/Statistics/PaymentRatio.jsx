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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <div style={{ width: '100px' }}>Total:</div>
          <div>{formatMoney(TOTAL)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <div style={{ width: '100px' }}>Payé:</div>
          <div>{formatMoney(PAID)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <div style={{ width: '100px' }}>Reste:</div>
          <div>{formatMoney(REMAINING)}</div>
        </div>
      </CardBody>
      <CardFooter px="8">
        <Tooltip label={`${formatMoney(REMAINING)}`} bg="blue.200" placement="bottom-end" hasArrow>
          <div
            style={{
              marginTop: '2rem',
              width: '100%',
              height: '20px',
              backgroundColor: '#1f7ea166',
              borderRadius: '10px',
              display: 'flex',
              overflow: 'hidden',
            }}>
            <Tooltip label={`${formatMoney(PAID)}`} bg="orange.400" placement="top-start" hasArrow>
              <div
                style={{
                  width: `${paidPercentage}%`,
                  height: '100%',
                  backgroundColor: '#ff930f',
                  transition: 'width 0.5s',
                }}
              />
            </Tooltip>
          </div>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}

export default PaymentRatio
