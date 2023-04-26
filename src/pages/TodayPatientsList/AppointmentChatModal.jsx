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
import { omit } from 'lodash'
import { format, parseISO } from 'date-fns'
import io from 'socket.io-client'

import { ENDPOINT, APPOINTMENTS_LISTENERS, APPOINTMENTS_EVENTS } from '../../config'
import { guid } from '../../utils'
import { ChatState } from '../../context'

import ScrollableChat from '../../components/ScrollableChat'

let socket

export default function AppointmentChatModal({ appointment }) {
  const { user } = ChatState()
  const { fullName, age, startDate, endDate } = appointment
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const isTyping = false

  const sendChatMessage = (e) => {
    if (e.key !== 'Enter') return
    socket.emit(APPOINTMENTS_EVENTS.MESSAGE_APPOINTMENT, {
      _id: guid(),
      content: newMessage,
      sender: omit(user, ['token', 'success', 'statusCode', 'message']),
      appointmentId: appointment._id,
    })
    setNewMessage('')
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
    // fetch messages and then..
    // setMessages()
  }, [])

  useEffect(() => {
    if (socket === undefined) {
      socket = io(ENDPOINT)
    }

    socket.on(APPOINTMENTS_LISTENERS.APPOINTMENT_MESSAGED, (payload) => {
      if (payload.appointmentId === appointment.id) {
        setMessages([...messages, payload])
      }
    })
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
      <Modal closeOnOverlayClick={false} size="2xl" finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
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
