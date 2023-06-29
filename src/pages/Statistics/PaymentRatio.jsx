import { Card, CardBody, Tooltip } from '@chakra-ui/react'
import { formatMoney } from '@utils'

const PaymentRatio = () => {
  const TOTAL = 25220000
  const PAID = 11220000
  const REMAINING = TOTAL - PAID

  const paidPercentage = Math.round((PAID / TOTAL) * 100)

  return (
    <Card variant="filled" bg="#36f1">
      <CardBody>
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <div style={{ width: '100px' }}>Total:</div>
          <div>{formatMoney(TOTAL)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <div style={{ width: '100px' }}>Payé:</div>
          <div>{formatMoney(PAID)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <div style={{ width: '100px' }}>Reste:</div>
          <div>{formatMoney(REMAINING)}</div>
        </div>
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
      </CardBody>
    </Card>
  )
}

export default PaymentRatio
