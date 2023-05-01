import { useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'react-feather'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import io from 'socket.io-client'

import { ENDPOINT, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { ChatState } from '../../context'

import ScrollableChat from '../../components/ScrollableChat'

let socket

export default function AppointmentChatModal({ appointment }) {
  const { user, notifications, setNotifications, selectedChatAppointmentModal, setSelectedChatAppointmentModal } =
    ChatState()
  const { id, fullName, age, startDate, endDate } = appointment
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)

  const isNotificationFound = appointment._id === selectedChatAppointmentModal._id
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const isTyping = false

  const sendChatMessage = async (e) => {
    if (e.key !== 'Enter' || newMessage.trim().length === 0) return

    const payload = {
      content: newMessage,
      sender: user._id,
      appointment: appointment._id,
    }

    const response = await fetch(`/api/appointment/${id}/message`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.status === 200) {
      const appointmentData = await response.json()
      socket.emit(APPOINTMENTS_EVENTS.MESSAGE_APPOINTMENT, appointmentData)
      setNewMessage('')
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!typing) {
      setTyping(true)
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 15000

    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    ;(async () => {
      const response = await fetch(`/api/appointment/${id}/message`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.status === 200) {
        const appointmentMessages = await response.json()
        setMessages(appointmentMessages)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (socket === undefined) {
      socket = io(ENDPOINT)
    }

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_MESSAGED, (payload) => {
      if (payload.appointment === appointment.id) {
        const { _id: senderId, name: userName } = payload.sender
        const { fullName: patientName } = appointment
        const isSenderNotificationFound = Boolean(notifications.find((notif) => notif._id === appointment._id))

        if (!isSenderNotificationFound && user._id !== senderId) {
          const newNotification = { ...appointment, userName, patientName, isAppointmentChat: true }
          setNotifications([newNotification, ...notifications])
        }
        setMessages([...messages, payload])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment, messages])

  const messageIconColor = appointment.age > 30 && { color: 'red', fill: '#f003' }
  const unreadMessages = Math.floor(Math.random() * 4) + 1

  return (
    <>
      <Button
        flex="2"
        variant="ghost"
        pr="2"
        colorScheme="messenger"
        leftIcon={<MessageCircle {...messageIconColor} />}
        onClick={onOpen}>
        {messageIconColor.fill && <span style={{ color: 'red' }}>{unreadMessages}</span>}
      </Button>
      <Modal
        closeOnOverlayClick={false}
        size="2xl"
        finalFocusRef={finalRef}
        isOpen={isOpen || isNotificationFound}
        onClose={() => {
          setSelectedChatAppointmentModal({})
          onClose()
        }}>
        <ModalOverlay />
        <ModalContent height="xl">
          <ModalHeader>
            {fullName} ~ {age} / {format(parseISO(startDate), 'hh:mm')} - {format(parseISO(endDate), 'hh:mm')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto">
            <ScrollableChat messages={messages} isTyping={isTyping} />
          </ModalBody>
          <ModalFooter>
            <FormControl onKeyDown={sendChatMessage} isRequired>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="entrer des messages.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
