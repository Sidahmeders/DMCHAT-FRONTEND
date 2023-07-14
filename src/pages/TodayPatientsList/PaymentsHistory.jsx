import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  Button,
  useDisclosure,
  HStack,
  Box,
  Text,
} from '@chakra-ui/react'
import { Cloud } from 'react-feather'

import { AppointmentsState } from '@context'
import { formatMoney } from '@utils'

const PaymentsHistory = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { todayPaymentHistory } = AppointmentsState()

  const totalpaymentAmount = todayPaymentHistory.reduce((acc, { amount }) => acc + amount, 0)

  return (
    <>
      <Button colorScheme="purple" position="absolute" bottom="2" right="2" leftIcon={<Cloud />} onClick={onOpen}>
        Paiement Suivi
      </Button>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader px="4" color="purple.500">
            Paiements du Aujourd'hui
          </DrawerHeader>
          <DrawerCloseButton fontSize="14" marginTop="7px" color="purple" />
          <DrawerBody>
            {todayPaymentHistory.map(({ _id, payerName, amount }, index) => (
              <HStack key={_id} justifyContent="space-between" ml="3">
                <Box position="relative">
                  <Text position="absolute" top="2px" left="-1.5rem" fontSize="14px" color="purple">
                    {index + 1}.
                  </Text>
                  {payerName?.slice(0, 18)}
                </Box>
                <Text fontWeight="bold">{formatMoney(amount)}</Text>
              </HStack>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Text fontSize="1.25rem">
              Total: <strong>{formatMoney(totalpaymentAmount)}</strong>
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default PaymentsHistory
