import { useEffect, useState } from 'react'
import { Button, InputGroup, Input, useToast } from '@chakra-ui/react'
import { CardBody } from '@chakra-ui/card'

import { ChatState } from '@context'
import { CREATE_APPOINTMENT_NAMES, APPOINTMENTS_EVENTS, APPOINTMENTS_LISTENERS } from '@config'
import { updateAppointment } from '@services/appointments'

const PaymentCard = ({ appointment, showPaymentCard }) => {
  const toast = useToast()
  const { socket } = ChatState()
  const { payment, totalPrice, paymentLeft } = appointment
  const [paymentVal, setPaymentVal] = useState(payment)
  const [totalPriceVal, setTotalPriceVal] = useState(totalPrice)
  const [paymentLeftVal, setPaymentLeftVal] = useState(paymentLeft)
  const [canUpdatePayments, setCanUpdatePayments] = useState(false)
  const [canShowUpdateBtn, setCanShowUpdateBtn] = useState(false)

  const updatePaymentVal = (e) => {
    const { value } = e.target
    setPaymentVal(value)
    setPaymentLeftVal(totalPriceVal - value)
    setCanShowUpdateBtn(true)
  }

  const updateTotalPriceVal = (e) => {
    const { value } = e.target
    setTotalPriceVal(value)
    setPaymentLeftVal(value - paymentVal)
    setCanShowUpdateBtn(true)
  }

  const handlePaymentsUpdate = async () => {
    try {
      const update = {
        [CREATE_APPOINTMENT_NAMES.TOTAL_PRICE]: totalPriceVal,
        [CREATE_APPOINTMENT_NAMES.PAYMENT]: paymentVal,
        [CREATE_APPOINTMENT_NAMES.PAYMENT_LEFT]: paymentLeftVal,
      }
      const updatedPayment = await updateAppointment(appointment.id, update)
      socket.emit(APPOINTMENTS_EVENTS.PAYMENT_APPOINTMENT, updatedPayment)
      setCanUpdatePayments(false)
      setCanShowUpdateBtn(false)
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const cancelPaymentUpdate = () => {
    setTotalPriceVal(totalPrice)
    setPaymentVal(payment)
    setPaymentLeftVal(paymentLeft)
    setCanUpdatePayments(false)
    setCanShowUpdateBtn(false)
  }

  useEffect(() => {
    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_PAID, (payload) => {
      // TODO: make payment update
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    showPaymentCard && (
      <CardBody p="0.25rem 1rem" mr="0">
        <InputGroup gap="2">
          <InputGroup className="payments-input">
            <label>T</label>
            <Input type="number" min={0} step={1000} value={totalPriceVal} onChange={updateTotalPriceVal} />
          </InputGroup>
          <InputGroup className="payments-input">
            <label>V</label>
            <Input type="number" value={paymentVal} min={0} step={1000} onChange={updatePaymentVal} />
          </InputGroup>
          <InputGroup className="payments-input">
            <label>R</label>
            <Input type="number" readOnly value={paymentLeftVal} />
          </InputGroup>
        </InputGroup>
        {canShowUpdateBtn && canUpdatePayments && (
          <Button colorScheme="orange" mt="2" mb="2" onClick={handlePaymentsUpdate}>
            Confirmer modification
          </Button>
        )}
        {canShowUpdateBtn && !canUpdatePayments && (
          <Button colorScheme="purple" mt="2" mb="2" onClick={() => setCanUpdatePayments(true)}>
            Enregistrer modification
          </Button>
        )}
        {canShowUpdateBtn && (
          <Button ml="2" onClick={cancelPaymentUpdate}>
            Annuler
          </Button>
        )}
      </CardBody>
    )
  )
}

export default PaymentCard
