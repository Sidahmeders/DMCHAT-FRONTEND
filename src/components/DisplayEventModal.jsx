import { useState } from 'react'
import { Info, FileText, Folder, PenTool, Phone, CheckCircle, MinusCircle } from 'react-feather'
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
  Tooltip,
} from '@chakra-ui/react'

import { formatDate } from '@utils'
import { deleteAppointment } from '@services/appointments'

import Loader from '@components/Loader/Loader'

export default function DisplayEventModal({ selectedEvent, setEvents, isOpen, onClose }) {
  const {
    id,
    isNewTreatment,
    isDone,
    start,
    end,
    patient = {},
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
      toast()
    }
    setCanDeleteEvent(false)
    setIsLoading(false)
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />
      <ModalContent>
        <Loader loading={isLoading}>
          <ModalHeader>
            <div
              style={{
                position: 'absolute',
                right: '1rem',
                display: 'flex',
              }}>
              <HStack gap="2">
                {isDone ? (
                  <Tooltip label="rendez-vous fini" background="green.500" placement="top-end" hasArrow>
                    <CheckCircle color="green" />
                  </Tooltip>
                ) : (
                  <Tooltip label="rendez-vous en attente" background="orange.400" placement="top-end" hasArrow>
                    <MinusCircle color="orange" />
                  </Tooltip>
                )}
                {isNewTreatment && (
                  <Tooltip
                    label="Attention, en supprimant ce rendez-vous, le système risque de réagir de manière imprévue par rapport aux autres rendez-vous."
                    background="red.500"
                    placement="bottom-start"
                    hasArrow>
                    <Info color="red" />
                  </Tooltip>
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
                {patient.fullName} / {patient.age} ans
              </Text>
            </HStack>
            <HStack color="Highlight" gap="2" mt="2">
              <HStack gap="4">
                <Text fontSize="1rem">T: {totalPrice}</Text>
                <Text fontSize="1rem">V: {payment || '0'}</Text>
                <Text fontSize="1rem">R: {paymentLeft || '0'}</Text>
              </HStack>
            </HStack>
            <HStack color="Highlight" gap="1" mt="2">
              <Phone size="1rem" />
              <Text fontSize="1rem">{patient.phoneNumber} / #### </Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Stack spacing="2">
              <Text pl="1">
                Motif de consultation: <strong>{motif}</strong>
              </Text>
              <HStack>
                <InputGroup>
                  <Textarea value={diagnostic} readOnly />
                  <InputRightElement children={<FileText color="#48dd" />} />
                </InputGroup>
                <InputGroup>
                  <Textarea value={treatmentPlan} readOnly />
                  <InputRightElement children={<PenTool color="#48dd" />} />
                </InputGroup>
              </HStack>
              <HStack>
                <InputGroup>
                  <Textarea value={patient.generalState} readOnly />
                  <InputRightElement children={<Folder color="#48dd" />} />
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