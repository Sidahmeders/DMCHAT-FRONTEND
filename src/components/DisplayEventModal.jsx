import { useState } from 'react'
import { Info, FileMinus, FilePlus, Clipboard, Phone, CheckCircle, MinusCircle } from 'react-feather'
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
  Stack,
  Text,
  useToast,
  Textarea,
  InputGroup,
  InputRightElement,
  HStack,
} from '@chakra-ui/react'

import { formatDate, formatPhoneNumber, formatMoney } from '@utils'
import { deleteAppointment } from '@services/appointments'

import TooltipMobile from '@components/TooltipMobile'
import Loader from '@components/Loader/Loader'

export default function DisplayEventModal({ selectedEvent, setEvents, isOpen, onClose }) {
  const {
    id,
    isNewTreatment,
    isDone,
    start,
    end,
    patient,
    totalPrice,
    payment,
    paymentLeft,
    motif,
    diagnostic,
    treatmentPlan,
  } = selectedEvent
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [canDeleteEvent, setCanDeleteEvent] = useState(false)

  const onDeleteEventIntent = () => {
    setCanDeleteEvent(true)
  }

  const deleteEvent = async () => {
    setIsLoading(true)
    try {
      await deleteAppointment(id)
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
      toast({
        title: 'rendez-vous a été supprimé avec succès',
        status: 'warning',
      })
      onClose()
    } catch (error) {
      toast({ description: error.message })
    }
    setCanDeleteEvent(false)
    setIsLoading(false)
  }

  return (
    <Modal size="xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        onKeyDownCapture={(e) => {
          // This is a fix to (TypeError: Cannot read properties of undefined (reading 'getDate') at MonthView.selectDates)
          e.stopPropagation()
        }}>
        <Loader loading={isLoading}>
          <ModalHeader>
            <div
              style={{
                position: 'absolute',
                right: '1rem',
                display: 'flex',
              }}>
              <HStack gap="3">
                {isDone ? (
                  <TooltipMobile label="rendez-vous fini" background="green.500" placement="top-end" hasArrow>
                    <CheckCircle color="green" />
                  </TooltipMobile>
                ) : (
                  <TooltipMobile label="rendez-vous en attente" background="orange.400" placement="top-end" hasArrow>
                    <MinusCircle color="orange" />
                  </TooltipMobile>
                )}
                {isNewTreatment && (
                  <TooltipMobile
                    label="Attention, en supprimant ce rendez-vous, le système risque de réagir de manière imprévue par rapport aux autres rendez-vous."
                    background="red.500"
                    placement="bottom-start"
                    hasArrow>
                    <Info color="red" />
                  </TooltipMobile>
                )}
              </HStack>
            </div>

            {start && (
              <HStack color="Highlight" gap="2">
                <Text>
                  {formatDate(start, 'yy.MM.dd')} du {formatDate(start, 'hh:mm')} à {formatDate(end, 'hh:mm')}
                </Text>
              </HStack>
            )}
            <HStack color="Highlight" gap="2" mt="2">
              <Text fontSize="1rem">
                {patient?.fullName} / {patient?.age} ans
              </Text>
            </HStack>
            <HStack color="Highlight" gap="2" mt="2">
              <HStack gap="6">
                <Text fontSize="1rem">T: {formatMoney(totalPrice)}</Text>
                <Text fontSize="1rem">V: {formatMoney(payment)}</Text>
                <Text fontSize="1rem">R: {formatMoney(paymentLeft)}</Text>
              </HStack>
            </HStack>
            <HStack color="Highlight" gap="1" mt="2">
              <Phone size="1rem" />
              <Text fontSize="1rem">{formatPhoneNumber(patient?.phoneNumber)} / ##.##.##.##.##</Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Stack spacing="2">
              <Text pl="1">
                Motif de consultation: <strong>{motif?.name}</strong>
              </Text>
              <HStack>
                <InputGroup>
                  <Textarea value={diagnostic} readOnly />
                  <InputRightElement children={<FileMinus color="#9996" />} />
                </InputGroup>
                <InputGroup>
                  <Textarea value={treatmentPlan} readOnly />
                  <InputRightElement children={<FilePlus color="#9996" />} />
                </InputGroup>
              </HStack>
              <HStack>
                <InputGroup>
                  <Textarea value={patient?.generalState} readOnly />
                  <InputRightElement children={<Clipboard color="#9996" />} />
                </InputGroup>
              </HStack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            {!canDeleteEvent ? (
              <>
                <Button colorScheme="orange" mr={3} onClick={onDeleteEventIntent}>
                  Supprimer
                </Button>
              </>
            ) : (
              <Button type="submit" mr={3} colorScheme="red" onClick={deleteEvent}>
                Supprimer définitivement
              </Button>
            )}
            <Button
              variant="solid"
              onClick={() => {
                setCanDeleteEvent(false)
                onClose()
              }}>
              Annuler
            </Button>
          </ModalFooter>
        </Loader>
      </ModalContent>
    </Modal>
  )
}
