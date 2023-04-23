import { useState } from 'react'
import { Calendar, Paperclip, Phone } from 'react-feather'
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
  Box,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import Loader from '../../components/Loader/Loader'

const textStyles = { fontWeight: 'bold', paddingLeft: '6px' }

export default function DisplayEventModal({ user, selectedEvent, isOpen, onClose, events, setEvents }) {
  const { id, start, title, patient, isWaitingList } = selectedEvent
  const { fullName, motif, generalState, diagnostic, treatmentPlan } = patient || {}
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [canDeleteEvent, setCanDeleteEvent] = useState(false)

  const onDeleteEventIntent = () => {
    setCanDeleteEvent(true)
  }

  const deleteEvent = async () => {
    setIsLoading(true)
    const response = await fetch(`/api/appointment/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    if (response.status === 200) {
      const deletedAppointment = await response.json()
      const updatedEvents = events.filter((event) => event.id !== deletedAppointment._id)
      setEvents(updatedEvents)
      toast({
        title: `${deletedAppointment.title} a été supprimé avec succès`,
        status: 'warning',
      })
    }

    setCanDeleteEvent(false)
    setIsLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <Loader loading={isLoading}>
          <ModalHeader>
            {start && (
              <Box color="Highlight" display="flex" alignItems="center">
                <Calendar />
                <Text pl="3" pt="0.5">
                  {format(start, 'yyyy-MM-dd / hh:mm')}
                </Text>
              </Box>
            )}
            <Box pt="2" color="blue.300" display="flex" alignItems="center">
              <Paperclip size="1rem" />
              <Text fontSize="1rem" pl="3">
                {title}
              </Text>
            </Box>
            <Box pt="2" color="blue.300" display="flex" alignItems="center">
              <Phone size="1rem" />
              <Text fontSize="1rem" pl="3">
                05.52.22.42.32 / aucun numéro
              </Text>
            </Box>
          </ModalHeader>
          <ModalBody>
            <Stack spacing="2">
              <Text>
                Nom: <span style={textStyles}>{fullName}</span>
              </Text>
              <Text>
                Motif:
                <span style={textStyles}>{motif}</span>
              </Text>
              <Text>
                État: <span style={textStyles}>{generalState}</span>
              </Text>
              <Text>
                Diagnostique:
                <span style={textStyles}>{diagnostic}</span>
              </Text>
              <Text display="flex">
                Plan: <span style={textStyles}>{treatmentPlan}</span>
              </Text>
              <Text>
                Sur la liste d'attente <span style={textStyles}>{isWaitingList ? 'Oui' : 'No'}</span>
              </Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            {!canDeleteEvent && (
              <>
                <Button variant="solid" mr={3} onClick={onClose}>
                  Fermer
                </Button>
                <Button colorScheme="orange" onClick={onDeleteEventIntent}>
                  Supprimer
                </Button>
              </>
            )}
            <div style={{ display: `${canDeleteEvent ? 'block' : 'none'}` }}>
              <Button variant="solid" mr={3} onClick={() => setCanDeleteEvent(false)}>
                Annuler
              </Button>
              <Button type="submit" colorScheme="red" onClick={deleteEvent}>
                Confirmer
              </Button>
            </div>
          </ModalFooter>
        </Loader>
      </ModalContent>
    </Modal>
  )
}
