import { useEffect, useState } from 'react'
import { Button, InputGroup, Input, useToast } from '@chakra-ui/react'
import { CardBody } from '@chakra-ui/card'

import { AppointmentsState, ChatState } from '@context'
import { formatMoney, getTodayPaymentHistory, guid, notify, setTodayPaymentHistory } from '@utils'
import { CREATE_APPOINTMENT_NAMES, APPOINTMENTS_EVENTS, APPOINTMENTS_LISTENERS } from '@config'
import { updateAppointment } from '@services/appointments'

const commitTodayPayment = (currentPayment, fullName) => {
  const paymentData = {
    id: guid(),
    amount: currentPayment,
    payer: fullName,
  }
  setTodayPaymentHistory(paymentData)
  return getTodayPaymentHistory()
}

const PaymentCard = ({ appointmentData, showPaymentCard }) => {
  const toast = useToast()
  const { socket } = ChatState()
  const { setTodayPaymentHistory } = AppointmentsState()
  const [appointment, setAppointmentData] = useState(appointmentData)
  const [paymentVal, setPaymentVal] = useState(appointment.payment || 0)
  const [totalPriceVal, setTotalPriceVal] = useState(appointment.totalPrice || 0)
  const [paymentLeftVal, setPaymentLeftVal] = useState(appointment.paymentLeft || 0)
  const [canUpdatePayments, setCanUpdatePayments] = useState(false)
  const [canShowUpdateBtn, setCanShowUpdateBtn] = useState(false)

  const updatePaymentVal = (e) => {
    setCanShowUpdateBtn(true)
    const { value } = e.target
    const difference = paymentVal - value

    setPaymentVal(value)
    if (difference < 0) {
      setPaymentLeftVal(paymentLeftVal - Math.abs(difference))
    } else {
      setPaymentLeftVal(paymentLeftVal + Math.abs(difference))
    }
  }

  const updateTotalPriceVal = (e) => {
    const { value } = e.target
    const difference = appointment.totalPrice - value

    setTotalPriceVal(value)
    if (difference < 0) {
      setPaymentLeftVal(appointment.paymentLeft + Math.abs(difference))
    } else {
      setPaymentLeftVal(appointment.paymentLeft - Math.abs(difference))
    }
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
    setTotalPriceVal(appointment.totalPrice)
    setPaymentVal(appointment.payment)
    setPaymentLeftVal(appointment.paymentLeft)
    setCanUpdatePayments(false)
    setCanShowUpdateBtn(false)
  }

  useEffect(() => {
    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_PAID, (payload) => {
      if (payload._id === appointment._id) {
        const { patient, totalPrice, payment, paymentLeft } = payload || {}
        const currentPayment = payment - appointment.payment
        setAppointmentData(payload)
        setTotalPriceVal(totalPrice)
        setPaymentVal(payment)
        setPaymentLeftVal(paymentLeft)
        notify({
          title: `paiement effectué par "${patient.fullName}"`,
          description: `payé: ${formatMoney(currentPayment)} / reste: ${formatMoney(paymentLeft)}`,
        })
        const commitedPayments = commitTodayPayment(currentPayment, patient?.fullName)
        setTodayPaymentHistory(commitedPayments)
      }
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
